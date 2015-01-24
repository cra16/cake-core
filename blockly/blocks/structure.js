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
 * @fileoverview Procedure blocks for Blockly.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Blocks.structure');

goog.require('Blockly.Blocks');

var TYPE =
  [
    [Blockly.Msg.FUNCTION_SET_TYPE_INT, 'int'],
    [Blockly.Msg.FUNCTION_SET_TYPE_FLOAT, 'float'],
    [Blockly.Msg.FUNCTION_SET_TYPE_DOUBLE, 'double'],
    [Blockly.Msg.FUNCTION_SET_TYPE_LONG, 'long'],
    [Blockly.Msg.FUNCTION_SET_TYPE_LONGLONG, 'long long'],
    [Blockly.Msg.FUNCTION_SET_TYPE_SHORT, 'short'],
    [Blockly.Msg.FUNCTION_SET_TYPE_LONGDOUBLE, 'long double']
  ];

Blockly.Blocks['structure_define'] = {
  init: function() {
    this.setHelpUrl(Blockly.Msg.PROCEDURES_DEFRETURN_HELPURL);
    this.setColour(370);
    var name = Blockly.Procedures.findLegalName(
      Blockly.Msg.STRUCTURE_DEFINE_NAME, this);
    this.appendDummyInput()
      .appendField(Blockly.Msg.STRUCTURE_DEFINE_TITLE)
      .appendField(new Blockly.FieldTextInput(name,
        Blockly.Procedures.rename), 'NAME')
      .appendField('', 'PARAMS');
    this.setMutator(new Blockly.Mutator(['structure_mutatormem']));
    this.setTooltip(Blockly.Msg.PROCEDURES_DEFRETURN_TOOLTIP);
    this.members_ = [];
    this.types_ = [];
    this.dist_ = [];
    this.statementConnection_ = null;
    this.setPreviousStatement(true, ["procedures_defnoreturn", "procedures_defreturn"]);
    this.setNextStatement(true, ["procedures_defnoreturn", "procedures_defreturn"]);
  },
  updateParams_: function() {
    // Check for duplicated arguments.
    var badArg = false;
    var hash = {};
    for (var x = 0; x < this.members_.length; x++) {
      if (hash['arg_' + this.members_[x].toLowerCase()]) {
        badArg = true;
        break;
      }
      hash['arg_' + this.members_[x].toLowerCase()] = true;
    }
    if (badArg) {
      this.setWarningText(Blockly.Msg.PROCEDURES_DEF_DUPLICATE_WARNING);
    } else {
      this.setWarningText(null);
    }
    // Merge the arguments into a human-readable list.
    var paramString = '';
    if (this.members_.length) {
      paramString = Blockly.Msg.PROCEDURES_BEFORE_PARAMS;
      for (var x = 0; x < this.members_.length; x++) {
        if (x == 0)
          paramString = paramString + ' ' + this.types_[x] + ' ' + this.members_[x];
        else
          paramString = paramString + ', ' + this.types_[x] + ' ' + this.members_[x];
      }
    }
    this.setFieldValue(paramString, 'PARAMS');
  },
  /**
   * Create XML to represent the argument inputs.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    var container = document.createElement('mutation');
    for (var x = 0; x < this.members_.length; x++) {
      var element = document.createElement('arg');
      element.setAttribute('name', this.members_[x]);
      element.setAttribute('types', this.types_[x]);
      container.appendChild(element);
    }

    // Save whether the statement input is visible.
    return container;
  },
  /**
   * Parse XML to restore the argument inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    this.members_ = [];
    for (var x = 0, childNode; childNode = xmlElement.childNodes[x]; x++) {
      if (childNode.nodeName.toLowerCase() == 'arg') {
        this.members_.push(childNode.getAttribute('name'));
        this.types_.push(childNode.getAttribute('types'));
      }
    }
    this.updateParams_();
  },
  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this Blockly.Block
   */
  decompose: function(workspace) {
    var containerBlock = Blockly.Block.obtain(workspace,
      'structure_mutatorcontainer');
    containerBlock.initSvg();


    // Parameter list.
    var connection = containerBlock.getInput('STACK').connection;
    for (var x = 0; x < this.members_.length; x++) {
      var paramBlock = Blockly.Block.obtain(workspace, 'structure_mutatormem');
      paramBlock.initSvg();
      paramBlock.setFieldValue(this.members_[x], 'NAME');
      paramBlock.setFieldValue(this.types_[x], 'TYPES');

      // Store the old location.
      paramBlock.oldLocation = x;
      connection.connect(paramBlock.previousConnection);
      connection = paramBlock.nextConnection;
    }
    // Initialize procedure's callers with blank IDs.
    Blockly.Procedures.mutateCallers(this.getFieldValue('NAME'), this.getFieldValue('TYPES'),
      this.workspace, this.members_, this.types_, null);
    return containerBlock;
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  compose: function(containerBlock) {
    // Parameter list.
    this.members_ = [];
    this.types_ = [];
    this.paramIds_ = [];
    var paramBlock = containerBlock.getInputTargetBlock('STACK');
    while (paramBlock) {
      this.members_.push(paramBlock.getFieldValue('NAME'));
      this.types_.push(paramBlock.getFieldValue('TYPES'));
      this.paramIds_.push(paramBlock.id);
      paramBlock = paramBlock.nextConnection &&
        paramBlock.nextConnection.targetBlock();
    }
    this.updateParams_();
    Blockly.Procedures.mutateCallers(this.getFieldValue('NAME'), this.getFieldValue('TYPES'),
      this.workspace, this.members_, this.types_, this.paramIds_);

    // Show/hide the statement input.
    var hasStatements = containerBlock.getFieldValue('STATEMENTS');
    if (hasStatements !== null) {
      hasStatements = hasStatements == 'TRUE';
      var stackInput = this.getInput('STACK');
      if (stackInput.isVisible() != hasStatements) {
        if (hasStatements) {
          // Restore the stack, if one was saved.
          if (stackInput.connection.targetConnection ||
            !this.statementConnection_ ||
            this.statementConnection_.targetConnection ||
            this.statementConnection_.sourceBlock_.workspace !=
            this.workspace) {
            // Block no longer exists or has been attached elsewhere.
            this.statementConnection_ = null;
          } else {
            stackInput.connection.connect(this.statementConnection_);
          }
        } else {
          // Save the stack, then disconnect it.
          this.statementConnection_ = stackInput.connection.targetConnection;
          if (this.statementConnection_) {
            var stackBlock = stackInput.connection.targetBlock();
            stackBlock.setParent(null);
            stackBlock.bumpNeighbours_();
          }
        }
        stackInput.setVisible(hasStatements);
      }
    }
  },
  /**
   * Dispose of any callers.
   * @this Blockly.Block
   */
  dispose: function() {
    var name = this.getFieldValue('NAME');
    var type = this.getFieldValue('TYPES');
    Blockly.Procedures.disposeCallers(name, this.workspace);
    // Call parent's destructor.
    Blockly.Block.prototype.dispose.apply(this, arguments);
  },
  /**
   * Return all variables referenced by this block.
   * @return {!Array.<string>} List of variable names.
   * @this Blockly.Block
   */
  getMems: function() {
    return this.members_;
  },
  getTypes: function() {
    return this.types_;
  },
  /**
   * Notification that a variable is renaming.
   * If the name matches one of this block's variables, rename it.
   * @param {string} oldName Previous name of variable.
   * @param {string} newName Renamed variable.
   * @this Blockly.Block
   */
  renameVar: function(oldName, newName) {
    var change = false;
    for (var x = 0; x < this.members_.length; x++) {
      if (Blockly.Names.equals(oldName, this.members_[x])) {
        this.members_[x] = newName;
        change = true;
      }
    }
    if (change) {
      this.updateParams_();
      // Update the mutator's variables if the mutator is open.
      if (this.mutator.isVisible_()) {
        var blocks = this.mutator.workspace_.getAllBlocks();
        for (var x = 0, block; block = blocks[x]; x++) {
          if (block.type == 'structure_mutatormem' &&
            Blockly.Names.equals(oldName, block.getFieldValue('NAME'))) {
            block.setFieldValue(newName, 'NAME');
          }
        }
      }
    }
  },
  getDist: function() {
    return ['sd'];
  },
  getStructDefine: function() {
    return ['sd', this.getFieldValue('NAME'), this.types_, this.members_];
  },
  callType_: 'procedures_callnoreturn'
}

Blockly.Blocks['structure_declare'] = {
  /**
   * Block for pointer setter.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.VARIABLES_SET_HELPURL);
    this.setColour(370);
    var name = Blockly.Procedures.findLegalName(
      Blockly.Msg.STRUCTURE_DECLARE_NAME, this);
    this.interpolateMsg(
      // TODO: Combine these messages instead of using concatenation.
      Blockly.Msg.STRUCTURE_DECLARE_TITLE + ' %1 ' +
      Blockly.Msg.STRUCTURE_DECLARE_TALE + ' %2', ['TYPES', new Blockly.FieldStructure('--Select--', null)], ['NAME', new Blockly.FieldTextInput(name, Blockly.Procedures.rename), Blockly.ALIGN_RIGHT],
      Blockly.ALIGN_RIGHT);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.VARIABLES_SET_TOOLTIP);
    // this.contextMenuMsg_ = Blockly.Msg.VARIABLES_SET_CREATE_GET;
    // this.contextMenuType_ = 'variables_pointer_get';
  },
  /**
   * Return all variables referenced by this block.
   * @return {!Array.<string>} List of variable names.
   * @this Blockly.Block
   */
  getTypes: function() {
    return [this.getFieldValue('TYPES')];
  },
  /**
   * Notification that a variable is renaming.
   * If the name matches one of this block's variables, rename it.
   * @param {string} oldName Previous name of variable.
   * @param {string} newName Renamed variable.
   * @this Blockly.Block
   */
  renameVar: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getFieldValue('NAME'))) {
      this.setFieldValue(newName, 'NAME');
    }
  },
  getDist: function() {
    return ['sn'];
  },
  getStructDeclare: function() {
    return [this.getFieldValue('NAME')];
  },
  //when the block is changed, 
  onchange: Blockly.Blocks.requireInFunction
};

Blockly.Blocks['structure_get'] = {
  /**
   * Block for variable getter.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.VARIABLES_GET_HELPURL);
    this.setColour(370);
    this.appendDummyInput('struct')
      .appendField('', 'NAME')
      .appendField(Blockly.Msg.STRUCTURE_GET_MEMBER)
      .appendField(new Blockly.FieldStructureMember('--Select--', null, this), 'Mem');
    this.setOutput(true);
    this.setTooltip(Blockly.Msg.VARIABLES_GET_TOOLTIP);
  },

  getStructureCall: function() {
    // The NAME field is guaranteed to exist, null will never be returned.
    return /** @type {string} */ (this.getFieldValue('NAME'));
  },
  /**
   * Notification that a procedure is renaming.
   * If the name matches this block's procedure, rename it.
   * @param {string} oldName Previous name of procedure.
   * @param {string} newName Renamed procedure.
   * @this Blockly.Block
   */
  renameProcedure: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getStructureCall())) {
      this.setFieldValue(newName, 'NAME');
      this.setTooltip(
        (this.outputConnection ? Blockly.Msg.PROCEDURES_CALLRETURN_TOOLTIP : Blockly.Msg.PROCEDURES_CALLNORETURN_TOOLTIP)
        .replace('%1', newName));
    }
  },
  /**
   * Create XML to represent the (non-editable) name and arguments.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('name', this.getStructureCall());
    return container;
  },
  /**
   * Parse XML to restore the (non-editable) name and parameters.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    var name = xmlElement.getAttribute('name');
    this.setFieldValue(name, 'NAME');
    this.setTooltip(
      (this.outputConnection ? Blockly.Msg.PROCEDURES_CALLRETURN_TOOLTIP : Blockly.Msg.PROCEDURES_CALLNORETURN_TOOLTIP).replace('%1', name));

  },
  //when the block is changed, 
  onchange: Blockly.Blocks.requireInFunction
};

Blockly.Blocks['structure_set'] = {
  /**
   * Block for variable setter.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.VARIABLES_SET_HELPURL);
    this.setColour(370);
    this.appendDummyInput('struct')
      .appendField('', 'NAME')
      .appendField(Blockly.Msg.STRUCTURE_SET_MEMBER)
      .appendField(new Blockly.FieldStructureMember('--Select--', null, this), 'Mem');
    this.appendValueInput('VALUE');
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.VARIABLES_SET_TOOLTIP);
  },

  getStructureCall: function() {
    // The NAME field is guaranteed to exist, null will never be returned.
    return /** @type {string} */ (this.getFieldValue('NAME'));
  },
  /**
   * Notification that a procedure is renaming.
   * If the name matches this block's procedure, rename it.
   * @param {string} oldName Previous name of procedure.
   * @param {string} newName Renamed procedure.
   * @this Blockly.Block
   */
  renameProcedure: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getStructureCall())) {
      this.setFieldValue(newName, 'NAME');
      this.setTooltip(
        (this.outputConnection ? Blockly.Msg.PROCEDURES_CALLRETURN_TOOLTIP : Blockly.Msg.PROCEDURES_CALLNORETURN_TOOLTIP)
        .replace('%1', newName));
    }
  },
  /**
   * Create XML to represent the (non-editable) name and arguments.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('name', this.getStructureCall());
    return container;
  },
  /**
   * Parse XML to restore the (non-editable) name and parameters.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    var name = xmlElement.getAttribute('name');
    this.setFieldValue(name, 'NAME');
    this.setTooltip(
      (this.outputConnection ? Blockly.Msg.PROCEDURES_CALLRETURN_TOOLTIP : Blockly.Msg.PROCEDURES_CALLNORETURN_TOOLTIP).replace('%1', name));

  },
  //when the block is changed, 
  onchange: Blockly.Blocks.requireInFunction
};

Blockly.Blocks['structure_mutatorcontainer'] = {
  /**
   * Mutator block for procedure container.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(370);
    this.appendDummyInput()
      .appendField(Blockly.Msg.STRUCTURE_MUTATORCONTAINER_TITLE);
    this.appendStatementInput('STACK');
    this.setTooltip(Blockly.Msg.PROCEDURES_MUTATORCONTAINER_TOOLTIP);
    this.contextMenu = false;
  }
};

Blockly.Blocks['structure_mutatormem'] = {
  /**
   * Mutator block for procedure argument.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(370);
    this.appendDummyInput()
      .appendField(Blockly.Msg.STRUCTURE_MUTATORARG_TITLE)
      .appendField(new Blockly.FieldDropdown(TYPE), 'TYPES')
      .appendField(Blockly.Msg.STRUCTURE_MUTATORARG_NAME)
      .appendField(new Blockly.FieldTextInput('x', this.validator_), 'NAME');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.PROCEDURES_MUTATORARG_TOOLTIP);
    this.contextMenu = false;
  },
  /**
   * Obtain a valid name for the procedure.
   * Merge runs of whitespace.  Strip leading and trailing whitespace.
   * Beyond this, all names are legal.
   * @param {string} newVar User-supplied name.
   * @return {?string} Valid name, or null if a name was not specified.
   * @private
   * @this Blockly.Block
   */
  validator_: function(newVar) {
    newVar = newVar.replace(/[\s\xa0]+/g, ' ').replace(/^ | $/g, '');
    return newVar || null;
  },
  getTypes: function() {
    return [this.getFieldValue('TYPES')];
  }
};