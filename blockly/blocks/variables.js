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
 * @fileoverview Variable blocks for Blockly.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Blocks.variables');

goog.require('Blockly.Blocks');


var TYPE = 
  [[Blockly.Msg.VARIABLES_SET_TYPE_INT, 'int'],
  [Blockly.Msg.VARIABLES_SET_TYPE_FLOAT, 'float'],
  [Blockly.Msg.VARIABLES_SET_TYPE_DOUBLE, 'double'],
  [Blockly.Msg.VARIABLES_SET_TYPE_LONG, 'long'],
  [Blockly.Msg.VARIABLES_SET_TYPE_LONGLONG, 'long long'],
  [Blockly.Msg.VARIABLES_SET_TYPE_SHORT, 'short'],
  [Blockly.Msg.VARIABLES_SET_TYPE_LONGDOUBLE, 'long double']];

var ITERATION =
  [[Blockly.Msg.VARIABLES_SET_ITERATION_NORMAL, 'Normal'],
  [Blockly.Msg.VARIABLES_SET_ITERATION_DOUBLE, 'Double'],
  [Blockly.Msg.VARIABLES_SET_ITERATION_TRIPLE, 'Triple']];

Blockly.Blocks['variables_get'] = {
  /**
   * Block for variable getter.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.VARIABLES_GET_HELPURL);
    this.setColour(330);
    this.appendDummyInput()
        .appendField(Blockly.Msg.VARIABLES_GET_TITLE)
        .appendField(new Blockly.FieldVariable('--Select--', null), 'VAR')
        .appendField(Blockly.Msg.VARIABLES_GET_TAIL);
    this.setOutput(true);
    this.setTooltip(Blockly.Msg.VARIABLES_GET_TOOLTIP);
    this.contextMenuMsg_ = Blockly.Msg.VARIABLES_GET_CREATE_SET;
    this.contextMenuType_ = 'variables_set';
  },
  //when the block is changed, 
  onchange: Blockly.Blocks.requireInFunction,  
  /**
   * Return all variables referenced by this block.
   * @return {!Array.<string>} List of variable names.
   * @this Blockly.Block
   */
  getVars: function() {
    return [this.getFieldValue('VAR')];
  },
  /**
   * Notification that a variable is renaming.
   * If the name matches one of this block's variables, rename it.
   * @param {string} oldName Previous name of variable.
   * @param {string} newName Renamed variable.
   * @this Blockly.Block
   */
  renameVar: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) {
      this.setFieldValue(newName, 'VAR');
    }
  },
  /**
   * Add menu option to create getter/setter block for this setter/getter.
   * @param {!Array} options List of menu options to add to.
   * @this Blockly.Block
   */
  customContextMenu: function(options) {
    var option = {enabled: true};
    var name = this.getFieldValue('VAR');
    option.text = this.contextMenuMsg_.replace('%1', name);
    var xmlField = goog.dom.createDom('field', null, name);
    xmlField.setAttribute('name', 'VAR');
    var xmlBlock = goog.dom.createDom('block', null, xmlField);
    xmlBlock.setAttribute('type', this.contextMenuType_);
    option.callback = Blockly.ContextMenu.callbackFactory(this, xmlBlock);
    options.push(option);
  }
};

Blockly.Blocks['variables_set'] = {
  /**
   * Block for variable setter.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.VARIABLES_SET_HELPURL);
    this.setColour(330);
    this.interpolateMsg(
        // TODO: Combine these messages instead of using concatenation.
        Blockly.Msg.VARIABLES_SET_TITLE + ' %1 ' +
        Blockly.Msg.VARIABLES_SET_TAIL + ' %2',
        ['VAR', new Blockly.FieldVariable('--Select--', null, false, this)],
        ['VALUE', null, Blockly.ALIGN_RIGHT],
        Blockly.ALIGN_RIGHT);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.VARIABLES_SET_TOOLTIP);
    this.contextMenuMsg_ = Blockly.Msg.VARIABLES_SET_CREATE_GET;
    this.contextMenuType_ = 'variables_get';
  },
  //when the block is changed, 
  onchange: Blockly.Blocks.requireInFunction,
  /**
   * Return all variables referenced by this block.
   * @return {!Array.<string>} List of variable names.
   * @this Blockly.Block
   */
  getVars: function() {
    return [this.getFieldValue('VAR')];
  },
  /**
   * Notification that a variable is renaming.
   * If the name matches one of this block's variables, rename it.
   * @param {string} oldName Previous name of variable.
   * @param {string} newName Renamed variable.
   * @this Blockly.Block
   */
  renameVar: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) {
      this.setFieldValue(newName, 'VAR');
    }
  },
  customContextMenu: Blockly.Blocks['variables_get'].customContextMenu
};

Blockly.Blocks['variables_declare'] = {
  init : function() {
    this.setHelpUrl(Blockly.Msg.VARIABLES_SET_HELPURL);
    this.setColour(330);
    this.interpolateMsg(
        // TODO: Combine these messages instead of using concatenation.
        Blockly.Msg.VARIABLES_DECLARE_TITLE + ' %1 ' +
        Blockly.Msg.VARIABLES_DECLARE_NAME + ' %2 ' +
        Blockly.Msg.VARIABLES_DECLARE_INIT + ' %3',
        ['TYPES', new Blockly.FieldDropdown(TYPE)],
        ['VAR', new Blockly.FieldTextInput('myVariable', Blockly.Blocks.CNameValidator)],
        ['VALUE', null, Blockly.ALIGN_RIGHT],
        Blockly.ALIGN_RIGHT);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.VARIABLES_SET_TOOLTIP);
    this.contextMenuMsg_ = Blockly.Msg.VARIABLES_SET_CREATE_GET;
    this.contextMenuType_ = 'variables_get';
  },
  //when the block is changed, 
  onchange: Blockly.Blocks.requireInFunction,
  /**
   * Return all variables's types referenced by this block.
   * @return {!Array.<string>} List of variable types.
   * @this Blockly.Block
   */
  getTypes: function() {
    return [this.getFieldValue('TYPES')];
  },
  /**
   * Return all variables referenced by this block.
   * @return {!Array.<string>} List of variable names.
   * @this Blockly.Block
   */
  getVars: function() {
    return [this.getFieldValue('VAR')];
  },
  /**
   * Return all variables referenced by this block.
   * @return {!Array.<string>} List of variable names.
   * @this Blockly.Block
   */
  getDeclare: function() {
    return [this.getFieldValue('VAR')];
  },
  /**
   * Notification that a variable is renaming.
   * If the name matches one of this block's variables, rename it.
   * @param {string} oldName Previous name of variable.
   * @param {string} newName Renamed variable.
   * @this Blockly.Block
   */
  renameVar: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) {
      this.setFieldValue(newName, 'VAR');
    }
  },
  customContextMenu: Blockly.Blocks['variables_get'].customContextMenu
};

Blockly.Blocks['variables_pointer_declare'] = {
  init : function() {
    this.setHelpUrl(Blockly.Msg.VARIABLES_SET_HELPURL);
    this.setColour(330);
    this.interpolateMsg(
        // TODO: Combine these messages instead of using concatenation.
        Blockly.Msg.VARIABLES_POINTER_DECLARE_TITLE + ' %1 ' +
        Blockly.Msg.VARIABLES_POINTER_DECLARE_ITERATION + ' %2 ' +
        Blockly.Msg.VARIABLES_DECLARE_NAME + ' %3 ' +
        Blockly.Msg.VARIABLES_DECLARE_INIT + ' %4',
        ['TYPES', new Blockly.FieldDropdown(TYPE)],
        ['ITERATION', new Blockly.FieldDropdown(ITERATION)],
        ['VAR', new Blockly.FieldTextInput('myPointer', Blockly.Blocks.CNameValidator)],
        ['VALUE', null, Blockly.ALIGN_RIGHT],
        Blockly.ALIGN_RIGHT);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.VARIABLES_SET_TOOLTIP);
    this.contextMenuMsg_ = Blockly.Msg.VARIABLES_SET_CREATE_GET;
    this.contextMenuType_ = 'variables_get';
  },
  //when the block is changed, 
  onchange: Blockly.Blocks.requireInFunction,
  /**
   * Return all variables's types referenced by this block.
   * @return {!Array.<string>} List of variable types.
   * @this Blockly.Block
   */
  getTypes: function() {
    return [this.getFieldValue('TYPES')];
  },
  // getIteration: function(){
  //   var num_iteration;
  //   if(this.getFieldValue('ITERATION') = Normal)
  //     return 1;
  //   else if(this.getFieldValue('ITERATION') = Double)
  //     return 2;
  //   else if(getFieldValue('ITERATION') = Triple)
  //     return 3;
  //   else
  //     return 0;    
  // },
  /**
   * Return all variables referenced by this block.
   * @return {!Array.<string>} List of variable names.
   * @this Blockly.Block
   */
  getVars: function() {
    return [this.getFieldValue('VAR')];
  },
  /**
   * Return all variables referenced by this block.
   * @return {!Array.<string>} List of variable names.
   * @this Blockly.Block
   */
  getDeclare: function() {
    return [this.getFieldValue('VAR')];
  },
  /**
   * Notification that a variable is renaming.
   * If the name matches one of this block's variables, rename it.
   * @param {string} oldName Previous name of variable.
   * @param {string} newName Renamed variable.
   * @this Blockly.Block
   */
  renameVar: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) {
      this.setFieldValue(newName, 'VAR');
    }
  },
  customContextMenu: Blockly.Blocks['variables_get'].customContextMenu
};

Blockly.Blocks['variables_array_declare'] = {
  init : function() {
    this.setHelpUrl(Blockly.Msg.VARIABLES_SET_HELPURL);
    this.setColour(330);
    this.interpolateMsg(
        // TODO: Combine these messages instead of using concatenation.
        Blockly.Msg.VARIABLES_ARRAY_DECLARE_TITLE + ' %1 ' +
        Blockly.Msg.VARIABLES_DECLARE_NAME + ' %2 ' +
        Blockly.Msg.VARIABLES_ARRAY_DECLARE_LENGTH + ' %3 ' +
        Blockly.Msg.VARIABLES_DECLARE_INIT + ' %4',
        ['TYPES', new Blockly.FieldDropdown(TYPE)],
        ['VAR', new Blockly.FieldTextInput('myArray', Blockly.Blocks.CNameValidator)],
        ['LENGTH', new Blockly.FieldTextInput('1')],        
        ['VALUE', null, Blockly.ALIGN_RIGHT],
        Blockly.ALIGN_RIGHT);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.VARIABLES_SET_TOOLTIP);
    this.contextMenuMsg_ = Blockly.Msg.VARIABLES_SET_CREATE_GET;
    this.contextMenuType_ = 'variables_get';
  },
  //when the block is changed, 
  onchange: Blockly.Blocks.requireInFunction,
  /**
   * Return all variables's types referenced by this block.
   * @return {!Array.<string>} List of variable types.
   * @this Blockly.Block
   */
  getTypes: function() {
    return [this.getFieldValue('TYPES')];
  },
  getLength: function(){
    return [this.getFieldValue('LENGTH')];
  },
  /**
   * Return all variables referenced by this block.
   * @return {!Array.<string>} List of variable names.
   * @this Blockly.Block
   */
  getVars: function() {
    return [this.getFieldValue('VAR')];
  },
  /**
   * Return all variables referenced by this block.
   * @return {!Array.<string>} List of variable names.
   * @this Blockly.Block
   */
  getDeclare: function() {
    return [this.getFieldValue('VAR')];
  },
  /**
   * Notification that a variable is renaming.
   * If the name matches one of this block's variables, rename it.
   * @param {string} oldName Previous name of variable.
   * @param {string} newName Renamed variable.
   * @this Blockly.Block
   */
  renameVar: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) {
      this.setFieldValue(newName, 'VAR');
    }
  },
  customContextMenu: Blockly.Blocks['variables_get'].customContextMenu
};