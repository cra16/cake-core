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
 * @fileoverview Utility functions for handling variables and procedure names.
 * Note that variables and procedures share the same name space, meaning that
 * one can't have a variable and a procedure of the same name.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Variables');

// TODO(scr): Fix circular dependencies
// goog.require('Blockly.Block');
goog.require('Blockly.Toolbox');
goog.require('Blockly.Workspace');


/**
 * Category to separate variable names from procedures and generated functions.
 */
Blockly.Variables.NAME_TYPE = 'VARIABLE';

/**
 * Find all user-created variables.
 * @param {Blockly.Block=} opt_block Optional root block.
 * @return {!Array.<string>} Array of variable names.
 */
Blockly.Variables.allVariables = function(opt_block) {
  var blocks;
  if (opt_block) {
    blocks = opt_block.getDescendants();
  } else {
    blocks = Blockly.mainWorkspace.getAllBlocks();
  }
  var variableHash = Object.create(null);
  // Iterate through every block and add each variable to the hash.
  for (var x = 0; x < blocks.length; x++) {
    var funcVar = blocks[x].getDeclare;
    var funcParamInfo = blocks[x].getParamInfo;
    var funcStructDefine = blocks[x].getStructDefine;
    var funcStructDeclare = blocks[x].getStructDeclare;

    // window.alert(func);
    if (funcVar) {
      var blockVariablesName = funcVar.call(blocks[x]);
      var funcVarType = blocks[x].getTypes;
      var blockVariablesType = funcVarType.call(blocks[x]);
      var funcVarDist = blocks[x].getDist;
      var blockDistribute = funcVarDist.call(blocks[x]);
      // window.alert(blockVariablesName);
      // window.alert(blockVariablesType);
      // window.alert(blockDistribute);
      for (var w = 0; w < blockDistribute.length; w++) {
        var varDist = blockDistribute[w];
      }
      for (var z = 0; z < blockVariablesType.length; z++) {
        var varType = blockVariablesType[z];
      }
      for (var y = 0; y < blockVariablesName.length; y++) {
        var varName = blockVariablesName[y];
      }
      if (varName) {
        variableHash[varName.toLowerCase()] = [varType, varName, varDist];
      }
    } else if (funcParamInfo) {

    } else if (funcStructDefine) {
      var blockStructureType = funcStructDefine.call(blocks[x]);
      var funcStructDist = blocks[x].getDist;
      var blockStructDist = funcStructDist.call(blocks[x]);
      //structure member
      var funcStructMem = blocks[x].getMems;
      var blockStructMem = funcStructMem.call(blocks[x]);
      //structure type
      var funcStructType = blocks[x].getTypes;
      var blockStructMemType = funcStructType.call(blocks[x]);

      for (var w = 0; w < blockStructDist.length; w++) {
        var structDist = blockStructDist[w];
      }
      for (var y = 0; y < blockStructureType.length; y++) {
        var structType = blockStructureType[y];
      }
      for (var z = 0; z < blockStructMemType.length; z++) {
        var structMemType = blockStructMemType[z];
      }
      for (var v = 0; v < blockStructMem.length; v++) {
        var structMem = blockStructMem[v];
      }

      if (structType) {
        variableHash[structType.toLowerCase()] = [
          [structMemType, structMem], structType, structDist
        ];
      }
    } 
    else if (funcStructDeclare) {
      var blockStructName = funcStructDeclare.call(blocks[x]);
      var funcStructType = blocks[x].getTypes;
      var blockStructType = funcStructType.call(blocks[x]);
      var funcStructDist = blocks[x].getDist;
      var blockStructDist = funcStructDist.call(blocks[x]);
      for (var w = 0; w < blockStructDist.length; w++) {
        var structDist = blockStructDist[w];
      }
      for (var z = 0; z < blockStructType.length; z++) {
        var structType = blockStructType[z];
      }
      for (var y = 0; y < blockStructName.length; y++) {
        var structName = blockStructName[y];
      }
      if (structName) {
        variableHash[structName.toLowerCase()] = [structType, structName, structDist];
      }
    }
  }
  // Flatten the hash into a list.
  var variableList = [];
  for (var name in variableHash) {
    variableList.push([variableHash[name][0], variableHash[name][1], variableHash[name][2]]);
  }
  return variableList;
};

/**
 * Find all instances of the specified variable and rename them.
 * @param {string} oldName Variable to rename.
 * @param {string} newName New variable name.
 */
Blockly.Variables.renameVariable = function(oldName, newName) {
  var blocks = Blockly.mainWorkspace.getAllBlocks();
  // Iterate through every block.
  for (var x = 0; x < blocks.length; x++) {
    var func = blocks[x].renameVar;
    if (func) {
      func.call(blocks[x], oldName, newName);
    }
  }
};

/**
 * Construct the blocks required by the flyout for the variable category.
 * @param {!Array.<!Blockly.Block>} blocks List of blocks to show.
 * @param {!Array.<number>} gaps List of widths between blocks.
 * @param {number} margin Standard margin width for calculating gaps.
 * @param {!Blockly.Workspace} workspace The flyout's workspace.
 */
Blockly.Variables.flyoutCategory = function(blocks, gaps, margin, workspace) {
  var variableList = Blockly.Variables.allVariables();
  window.alert(variableList);
  variableList.sort(goog.string.caseInsensitiveCompare);
  // In addition to the user's variables, we also want to display the default
  // variable name at the top.  We also don't want this duplicated if the
  // user has created a variable of the same name.
  variableList.unshift(null);
  var defaultVariable = undefined;
  for (var i = 0; i < variableList.length; i++) {
    if (variableList[i][1] === defaultVariable) {
      continue;
    }
    var getBlock = Blockly.Blocks['variables_get'] ?
      Blockly.Block.obtain(workspace, 'variables_get') : null;
    getBlock && getBlock.initSvg();
    var setBlock = Blockly.Blocks['variables_set'] ?
      Blockly.Block.obtain(workspace, 'variables_set') : null;
    setBlock && setBlock.initSvg();
    if (variableList[i][1] === null) {
      defaultVariable = (getBlock || setBlock).getVars()[0];
    } else {
      getBlock && getBlock.setFieldValue(variableList[i][1], 'VAR');
      setBlock && setBlock.setFieldValue(variableList[i][1], 'VAR');
    }
    setBlock && blocks.push(setBlock);
    getBlock && blocks.push(getBlock);
    if (getBlock && setBlock) {
      gaps.push(margin, margin * 3);
    } else {
      gaps.push(margin * 2);
    }
  }
};

/**
 * Return a new variable name that is not yet being used. This will try to
 * generate single letter variable names in the range 'i' to 'z' to start with.
 * If no unique name is located it will try 'i1' to 'z1', then 'i2' to 'z2' etc.
 * @return {string} New variable name.
 */
Blockly.Variables.generateUniqueName = function() {
  var variableList = Blockly.Variables.allVariables();
  var newName = '';
  if (variableList.length) {
    variableList.sort(goog.string.caseInsensitiveCompare);
    var nameSuffix = 0,
      potName = 'i',
      i = 0,
      inUse = false;
    while (!newName) {
      i = 0;
      inUse = false;
      while (i < variableList.length && !inUse) {
        if (variableList[i][1].toLowerCase() == potName) {
          // This potential name is already used.
          inUse = true;
        }
        i++;
      }
      if (inUse) {
        // Try the next potential name.
        if (potName[0] === 'z') {
          // Reached the end of the character sequence so back to 'a' but with
          // a new suffix.
          nameSuffix++;
          potName = 'a';
        } else {
          potName = String.fromCharCode(potName.charCodeAt(0) + 1);
          if (potName[0] == 'l') {
            // Avoid using variable 'l' because of ambiguity with '1'.
            potName = String.fromCharCode(potName.charCodeAt(0) + 1);
          }
        }
        if (nameSuffix > 0) {
          potName += nameSuffix;
        }
      } else {
        // We can use the current potential name.
        newName = potName;
      }
    }
  } else {
    newName = 'i';
  }
  return newName;
};