/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2012 Google Inc.
 * https://blockly.googlecode.com/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Utility functions for handling procedures.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Structure');

goog.require('Blockly.Block');
goog.require('Blockly.FieldVariable');
goog.require('Blockly.Names');
goog.require('Blockly.Workspace');

/**
 * Category to separate procedure names from variables and generated functions.
 */
Blockly.Structure.NAME_TYPE = 'STRUCTURE';

/**
 * Find all user-created procedure definitions.
 * @return {!Array.<!Array.<!Array>>} Pair of arrays, the
 *     first contains procedures without return variables, the second with.
 *     Each procedure is defined by a three-element list of name, parameter
 *     list, and return value boolean.
 */
Blockly.Structure.allStructure = function() {
  var blocks = Blockly.mainWorkspace.getAllBlocks();
  var structureDefine = [];
  var structureDeclare = [];

  for (var x = 0; x < blocks.length; x++) {
    var funcDefine = blocks[x].getStructDefine;

    if (funcDefine) {
      var tuple = funcDefine.call(blocks[x]);
      if (tuple) {
        structureDefine.push(tuple);
      }
    }

  }

  structureDefine.sort(Blockly.Structure.procTupleComparator_);

  for (var x = 0; x < blocks.length; x++) {
    var funcDeclare = blocks[x].getStructDeclare;

    if (funcDeclare) {
      var structName = funcDeclare.call(blocks[x]);
      var structType = blocks[x].getTypes();
      structType = structType.toString();
      structName = structName.toString();
      var structMemName;
      var structMemType;
      var structMemDist;
        var strutcMemSpec;
      for (var y = 0; y < structureDefine.length; y++) {
        if (structureDefine[y][1] == structType) {
          structMemType = structureDefine[y][2];
            structMemName = structureDefine[y][3];
            structMemDist = structureDefine[y][4];
            strutcMemSpec = structureDefine[y][5];
        } else
          continue;
      }
      var tuple = ['sn', structType, structName, structMemType, structMemName, structMemDist, strutcMemSpec];
      structureDeclare.push(tuple);
    }
  }

  structureDeclare.sort(Blockly.Structure.procTupleComparator_);
  // console.log(structureDefine);
  // console.log('');
  // console.log(structureDeclare);
  // console.log('');

  return [structureDefine, structureDeclare];
};

/**
 * Comparison function for case-insensitive sorting of the first element of
 * a tuple.
 * @param {!Array} ta First tuple.
 * @param {!Array} tb Second tuple.
 * @return {number} -1, 0, or 1 to signify greater than, equality, or less than.
 * @private
 */
Blockly.Structure.procTupleComparator_ = function(ta, tb) {
  var a = ta[0].toLowerCase();
  var b = tb[0].toLowerCase();
  if (a > b) {
    return 1;
  }
  if (a < b) {
    return -1;
  }
  return 0;
};

/**
 * Ensure two identically-named procedures don't exist.
 * @param {string} name Proposed procedure name.
 * @param {!Blockly.Block} block Block to disambiguate.
 * @return {string} Non-colliding name.
 */
Blockly.Structure.findLegalName = function(name, block) {
  if (block.isInFlyout) {
    // Flyouts can have multiple procedures called 'procedure'.
    return name;
  }
  while (!Blockly.Structure.isLegalName(name, block.workspace, block)) {
    // Collision with another procedure.
    var r = name.match(/^(.*?)(\d+)$/);
    if (!r) {
      name += '2';
    } else {
      name = r[1] + (parseInt(r[2], 10) + 1);
    }
  }
  return name;
};

/**
 * Does this procedure have a legal name?  Illegal names include names of
 * procedures already defined.
 * @param {string} name The questionable name.
 * @param {!Blockly.Workspace} workspace The workspace to scan for collisions.
 * @param {Blockly.Block} opt_exclude Optional block to exclude from
 *     comparisons (one doesn't want to collide with oneself).
 * @return {boolean} True if the name is legal.
 */
Blockly.Structure.isLegalName = function(name, workspace, opt_exclude) {
  var blocks = workspace.getAllBlocks();
  // Iterate through every block and check the name.
  for (var x = 0; x < blocks.length; x++) {
    if (blocks[x] == opt_exclude) {
      continue;
    }
    var func = blocks[x].getProcedureDef;
    if (func) {
      var procName = func.call(blocks[x]);
      if (Blockly.Names.equals(procName[0], name)) {
        return false;
      }
    }
  }
  return true;
};

/**
 * Rename a procedure.  Called by the editable field.
 * @param {string} text The proposed new name.
 * @return {string} The accepted name.
 * @this {!Blockly.FieldVariable}
 */
Blockly.Structure.rename = function(text) {
  // Strip leading and trailing whitespace.  Beyond this, all names are legal.
  text = text.replace(/^[\s\xa0]+|[\s\xa0]+$/g, '');

  // Ensure two identically-named procedures don't exist.
  text = Blockly.Structure.findLegalName(text, this.sourceBlock_);
  // Rename any callers.
  var blocks = this.sourceBlock_.workspace.getAllBlocks();
  for (var x = 0; x < blocks.length; x++) {
    var func = blocks[x].renameProcedure;
    if (func) {
      func.call(blocks[x], this.text_, text);
    }
  }
  return text;
};

/**
 * Construct the blocks required by the flyout for the procedure category.
 * @param {!Array.<!Blockly.Block>} blocks List of blocks to show.
 * @param {!Array.<number>} gaps List of widths between blocks.
 * @param {number} margin Standard margin width for calculating gaps.
 * @param {!Blockly.Workspace} workspace The flyout's workspace.
 */
Blockly.Structure.flyoutCategory = function(blocks, gaps, margin, workspace) {
  if (Blockly.Blocks['structure_define']) {
    var block = Blockly.Block.obtain(workspace, 'structure_define');
    block.initSvg();
    blocks.push(block);
    gaps.push(margin * 2);
  }
  if (Blockly.Blocks['structure_declare']) {
    var block = Blockly.Block.obtain(workspace, 'structure_declare');
    block.initSvg();
    blocks.push(block);
    gaps.push(margin * 2);
  }
  if (gaps.length) {
    // Add slightly larger gap between system blocks and user calls.
    gaps[gaps.length - 1] = margin * 3;
  }

  function populateStructureSet(structureList, templateName) {
    for (var x = 0; x < structureList.length; x++) {
      var block = Blockly.Block.obtain(workspace, templateName);
      block.setFieldValue(structureList[x][2], 'NAME');
      block.initSvg();
      blocks.push(block);
      gaps.push(margin * 2);
    }
  }
  function populateStructureGet(structureList, templateName) {
    for (var x = 0; x < structureList.length; x++) {
      var block = Blockly.Block.obtain(workspace, templateName);
      block.setFieldValue(structureList[x][2], 'NAME');
      block.initSvg();
      blocks.push(block);
      gaps.push(margin * 2);
    }
  }

  var tuple = Blockly.Structure.allStructure();
  populateStructureSet(tuple[1], 'structure_set');
  populateStructureGet(tuple[1], 'structure_get');
};

/**
 * Find all the callers of a named procedure.
 * @param {string} name Name of procedure.
 * @param {!Blockly.Workspace} workspace The workspace to find callers in.
 * @return {!Array.<!Blockly.Block>} Array of caller blocks.
 */
Blockly.Structure.getCallers = function(name, workspace) {
  var callers = [];
  var blocks = workspace.getAllBlocks();
  // Iterate through every block and check the name.
  for (var x = 0; x < blocks.length; x++) {
    var func = blocks[x].getProcedureCall;
    if (func) {
      var procName = func.call(blocks[x]);
      // Procedure name may be null if the block is only half-built.
      if (procName && Blockly.Names.equals(procName, name)) {
        callers.push(blocks[x]);
      }
    }
  }
  return callers;
};

/**
 * When a procedure definition is disposed of, find and dispose of all its
 *     callers.
 * @param {string} name Name of deleted procedure definition.
 * @param {!Blockly.Workspace} workspace The workspace to delete callers from.
 */
Blockly.Structure.disposeCallers = function(name, workspace) {
  var callers = Blockly.Structure.getCallers(name, workspace);
  for (var x = 0; x < callers.length; x++) {
    callers[x].dispose(true, false);
  }
};

/**
 * When a procedure definition changes its parameters, find and edit all its
 * callers.
 * @param {string} name Name of edited procedure definition.
 * @param {!Blockly.Workspace} workspace The workspace to delete callers from.
 * @param {!Array.<string>} paramNames Array of new parameter names.
 * @param {!Array.<string>} paramIds Array of unique parameter IDs.
 */
Blockly.Structure.mutateCallers = function(name, types, workspace,
  paramNames, paramTypes, paramDist, paramIds) {
  var callers = Blockly.Structure.getCallers(name, workspace);
  for (var x = 0; x < callers.length; x++) {
    callers[x].setProcedureParameters(paramNames, paramTypes, paramDist, paramIds);
  }
};

/**
 * Find the definition block for the named procedure.
 * @param {string} name Name of procedure.
 * @param {!Blockly.Workspace} workspace The workspace to search.
 * @return {Blockly.Block} The procedure definition block, or null not found.
 */
Blockly.Structure.getDefinition = function(name, workspace) {
  var blocks = workspace.getAllBlocks();
  for (var x = 0; x < blocks.length; x++) {
    var func = blocks[x].getProcedureDef;
    if (func) {
      var tuple = func.call(blocks[x]);
      if (tuple && Blockly.Names.equals(tuple[0], name)) {
        return blocks[x];
      }
    }
  }
  return null;
};

Blockly.Structure.typeCheck = function() {
  var type = ['int', 'float', 'double', 'long', 'short', 'long', 'char'];
  var pointer_iteration = ['Normal', 'Double', 'Triple'];
};
/**
 * Check return value is proper type in that function
 * @param {string} returnType Return type of function
 * @param {string, integer, float, double, etc} returnValue Actual return value of function
 */
Blockly.Structure.returnTypeCheck = function(returnType, returnValue) {
  var available = true;

  //if return value is not proper, block show the warning meesage
  if (!available) {
    Blockly.Block.setWarningText('Warning: return value is not proper.\nPlease confirm the return type');
  }
};