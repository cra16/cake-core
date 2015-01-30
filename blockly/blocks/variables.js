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


Blockly.Blocks['define_get'] = {
  init: function() {
    this.setHelpUrl(Blockly.Msg.VARIABLES_GET_HELPURL);
    this.setColour(160);
    this.appendDummyInput()
      .appendField(Blockly.Msg.DEFINE_GET_TITLE)
      .appendField(new Blockly.FieldVariableDefine('--Select--', null, this), 'VAR')
      .appendField(Blockly.Msg.VARIABLES_GET_TAIL);
    this.setOutput(true);
    this.setTooltip(Blockly.Msg.VARIABLES_GET_TOOLTIP);
    this.contextMenuMsg_ = Blockly.Msg.VARIABLES_GET_CREATE_SET;
    this.contextMenuType_ = 'variables_set';
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
    var option = {
      enabled: true
    };
    var name = this.getFieldValue('VAR');
    option.text = this.contextMenuMsg_.replace('%1', name);
    var xmlField = goog.dom.createDom('field', null, name);
    xmlField.setAttribute('name', 'VAR');
    var xmlBlock = goog.dom.createDom('block', null, xmlField);
    xmlBlock.setAttribute('type', this.contextMenuType_);
    option.callback = Blockly.ContextMenu.callbackFactory(this, xmlBlock);
    options.push(option);
  },

  //when the block is changed,
  onchange: Blockly.Blocks.requireInFunction
}

Blockly.Blocks['define_declare'] = {
  init: function() {
    var DEFINE =
      [
        [Blockly.Msg.DEFINE_SET_TYPE_CONSTANT, 'constant'],
        [Blockly.Msg.DEFINE_SET_TYPE_MACRO, 'macro']
      ];
    this.setHelpUrl(Blockly.Msg.VARIABLES_SET_HELPURL);
    this.setColour(160);
    this.interpolateMsg(
      // TODO: Combine these messages instead of using concatenation.
      Blockly.Msg.DEFINE_DECLARE_TITLE + ' %1 ' +
      Blockly.Msg.VARIABLES_DECLARE_NAME + ' %2 ' +
      Blockly.Msg.DEFINE_DECLARE_INIT + ' %3', ['DEFINES', new Blockly.FieldDropdown(DEFINE)], ['VAR', new Blockly.FieldTextInput('myMacro', Blockly.Blocks.CNameValidator)], ['VALUE', null, Blockly.ALIGN_RIGHT],
      Blockly.ALIGN_RIGHT);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.VARIABLES_SET_TOOLTIP);
    this.contextMenuMsg_ = Blockly.Msg.VARIABLES_SET_CREATE_GET;
    this.contextMenuType_ = 'define_get';
  },
  /**
   * Return all variables's types referenced by this block.
   * @return {!Array.<string>} List of variable types.
   * @this Blockly.Block
   */
  getTypes: function() {
    return [this.getFieldValue('DEFINES')];
  },

  getDist: function() {
    return 'd';
  },
    /**
     * Return Variable's Scope
     */
    getScope: function() {
        return this.getSurroundParent().getName();
    },
    /**
     * Return Variable's Scope
     */
    getSpec: function() {
        return null;
    },
    /**
     * Return this block's position
     */
    getPos: function(){
        return this.getRelativeToSurfaceXY().y;
    },
  /*
   * Return Name
   */
  getDeclare: function() {
    return [this.getFieldValue('VAR')];
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
  customContextMenu: Blockly.Blocks['define_get'].customContextMenu,

  //when the block is changed,
  onchange: Blockly.Blocks.requireInFunction
}

Blockly.Blocks['text'] = {
  /**
   * Block for text value.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.TEXT_TEXT_HELPURL);
    this.setColour(160);
    this.appendDummyInput()
      .appendField(new Blockly.FieldTextInput('0'), 'TEXT')
    this.setOutput(true, 'String');
    this.setTooltip(Blockly.Msg.TEXT_TEXT_TOOLTIP);
  }
}

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
      .appendField(new Blockly.FieldVariable('--Select--', null, this), 'VAR')
      .appendField(Blockly.Msg.VARIABLES_GET_TAIL);
    this.setOutput(true);
    this.setTooltip(Blockly.Msg.VARIABLES_GET_TOOLTIP);
    this.contextMenuMsg_ = Blockly.Msg.VARIABLES_GET_CREATE_SET;
    this.contextMenuType_ = 'variables_set';
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
     * Return this block's position
     */
    getPos: function(){
        return this.getRelativeToSurfaceXY().y;
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
    var option = {
      enabled: true
    };
    var name = this.getFieldValue('VAR');
    option.text = this.contextMenuMsg_.replace('%1', name);
    var xmlField = goog.dom.createDom('field', null, name);
    xmlField.setAttribute('name', 'VAR');
    var xmlBlock = goog.dom.createDom('block', null, xmlField);
    xmlBlock.setAttribute('type', this.contextMenuType_);
    option.callback = Blockly.ContextMenu.callbackFactory(this, xmlBlock);
    options.push(option);
  },

  //when the block is changed,
  onchange: Blockly.Blocks.requireInFunction
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
      Blockly.Msg.VARIABLES_SET_TAIL + ' %2', ['VAR', new Blockly.FieldVariable('--Select--', null, this)], ['VALUE', null, Blockly.ALIGN_RIGHT],
      Blockly.ALIGN_RIGHT);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.VARIABLES_SET_TOOLTIP);
    this.contextMenuMsg_ = Blockly.Msg.VARIABLES_SET_CREATE_GET;
    this.contextMenuType_ = 'variables_get';
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
     * Return this block's position
     */
    getPos: function(){
        return this.getRelativeToSurfaceXY().y;
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
  customContextMenu: Blockly.Blocks['variables_get'].customContextMenu,

  //when the block is changed,
  onchange: Blockly.Blocks.requireInFunction
};

Blockly.Blocks['variables_declare'] = {
  init: function() {
    var TYPE =
      [
        [Blockly.Msg.VARIABLES_SET_TYPE_INT, 'int'],
        [Blockly.Msg.VARIABLES_SET_TYPE_UNSIGNED_INT, 'unsigned int'],
        [Blockly.Msg.VARIABLES_SET_TYPE_FLOAT, 'float'],
        [Blockly.Msg.VARIABLES_SET_TYPE_DOUBLE, 'double'],
        [Blockly.Msg.VARIABLES_SET_TYPE_CHAR, 'char']];
      this.setHelpUrl(Blockly.Msg.VARIABLES_SET_HELPURL);
    this.setColour(330);
    this.interpolateMsg(
      // TODO: Combine these messages instead of using concatenation.
      ' %1 ' +Blockly.Msg.VARIABLES_DECLARE_TITLE + ' '+
      Blockly.Msg.VARIABLES_DECLARE_NAME + ' %2 ' +
      Blockly.Msg.VARIABLES_DECLARE_INIT + ' %3', ['TYPES', new Blockly.FieldDropdown(TYPE)], ['VAR', new Blockly.FieldTextInput('myVariable', Blockly.Blocks.CNameValidator)], ['VALUE', null, Blockly.ALIGN_RIGHT],
      Blockly.ALIGN_RIGHT);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.VARIABLES_SET_TOOLTIP);
    this.contextMenuMsg_ = Blockly.Msg.VARIABLES_SET_CREATE_GET;
    this.contextMenuType_ = 'variables_get';
  },
  /**
   * Return 'variables'.
   */
  getDist: function() {
    return 'v';
  },
    /**
     * Return Variable's Scope
     */
    getScope: function() {
        return this.getSurroundParent().getName();
    },
    /**
     * Return Variable's Scope
     */
    getSpec: function() {
        return null;
    },
    /**
     * Return this block's position
     */
    getPos: function(){
        return this.getRelativeToSurfaceXY().y;
    },
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
  customContextMenu: Blockly.Blocks['variables_get'].customContextMenu,

  //when the block is changed,
  onchange: Blockly.Blocks.variablePlaceCheck
};

Blockly.Blocks['variables_pointer_get'] = {
  /**
   * Block for pointer getter.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.VARIABLES_GET_HELPURL);
    this.setColour(45);
    this.appendDummyInput()
      .appendField(Blockly.Msg.POINTER_GET_TITLE)
      .appendField(new Blockly.FieldVariablePointer('--Select--', null, this), 'VAR')
      .appendField(Blockly.Msg.VARIABLES_GET_TAIL);
    this.setOutput(true);
    this.setTooltip(Blockly.Msg.VARIABLES_GET_TOOLTIP);
    this.contextMenuMsg_ = Blockly.Msg.VARIABLES_GET_CREATE_SET;
    this.contextMenuType_ = 'variables_pointer_set';
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
     * Return this block's position
     */
    getPos: function(){
        return this.getRelativeToSurfaceXY().y;
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
    var option = {
      enabled: true
    };
    var name = this.getFieldValue('VAR');
    option.text = this.contextMenuMsg_.replace('%1', name);
    var xmlField = goog.dom.createDom('field', null, name);
    xmlField.setAttribute('name', 'VAR');
    var xmlBlock = goog.dom.createDom('block', null, xmlField);
    xmlBlock.setAttribute('type', this.contextMenuType_);
    option.callback = Blockly.ContextMenu.callbackFactory(this, xmlBlock);
    options.push(option);
  },

  //when the block is changed, 
  onchange: Blockly.Blocks.requireInFunction
};

Blockly.Blocks['variables_pointer_set'] = {
  /**
   * Block for pointer setter.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.VARIABLES_SET_HELPURL);
    this.setColour(45);
    this.interpolateMsg(
      // TODO: Combine these messages instead of using concatenation.
      Blockly.Msg.VARIABLES_SET_TITLE + ' %1 ' +
      Blockly.Msg.VARIABLES_SET_TAIL + ' %2', ['VAR', null, Blockly.ALIGN_RIGHT], ['VALUE', null, Blockly.ALIGN_RIGHT],
      Blockly.ALIGN_RIGHT);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.VARIABLES_SET_TOOLTIP);
    this.contextMenuMsg_ = Blockly.Msg.VARIABLES_SET_CREATE_GET;
    this.contextMenuType_ = 'variables_pointer_get';
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
     * Return this block's position
     */
    getPos: function(){
        return this.getRelativeToSurfaceXY().y;
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
  customContextMenu: Blockly.Blocks['variables_pointer_get'].customContextMenu,

  //when the block is changed, 
  onchange: Blockly.Blocks.requireInFunction
};

Blockly.Blocks['variables_pointer_declare'] = {
  init: function() {
      var TYPE =
          [
              [Blockly.Msg.VARIABLES_SET_TYPE_INT, 'int'],
              [Blockly.Msg.VARIABLES_SET_TYPE_UNSIGNED_INT, 'unsigned int'],
              [Blockly.Msg.VARIABLES_SET_TYPE_FLOAT, 'float'],
              [Blockly.Msg.VARIABLES_SET_TYPE_DOUBLE, 'double'],
              [Blockly.Msg.VARIABLES_SET_TYPE_CHAR, 'char']];
    this.setHelpUrl(Blockly.Msg.VARIABLES_SET_HELPURL);
    this.setColour(45);
    this.interpolateMsg(
      // TODO: Combine these messages instead of using concatenation.
      ' %1 ' + Blockly.Msg.VARIABLES_POINTER_DECLARE_TITLE +
      Blockly.Msg.VARIABLES_POINTER_DECLARE_ITERATION + ' %2 ' +
      Blockly.Msg.VARIABLES_DECLARE_NAME + ' %3 ' +
      Blockly.Msg.VARIABLES_DECLARE_INIT + ' %4', ['TYPES', new Blockly.FieldDropdown(TYPE)], ['ITERATION', new Blockly.FieldTextInput('*')], ['VAR', new Blockly.FieldTextInput('myPointer', Blockly.Blocks.CNameValidator)], ['VALUE', null, Blockly.ALIGN_RIGHT],
      Blockly.ALIGN_RIGHT);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.VARIABLES_SET_TOOLTIP);
    this.contextMenuMsg_ = Blockly.Msg.VARIABLES_SET_CREATE_GET;
    this.contextMenuType_ = 'variables_pointer_get';
  },
    /**
     * Return 'pointer'.
     */
    getDist: function() {
        return 'p';
    },
    /**
     * Return pointer's specfic.
     * specific means their iteration(*, **, or ***)
     */
    getSpec: function() {
        return this.getFieldValue('ITERATION');
    },
    /**
     * Return all variables's types referenced by this block.
     * @return {!Array.<string>} List of variable types.
     * @this Blockly.Block
     */
    getTypes: function() {
        return [this.getFieldValue('TYPES')];
    },
    /**
     * Return Pointer's Scope
     */
    getScope: function() {
        return this.getSurroundParent().getName();
    },
    /**
     * Return this block's position
     */
    getPos: function(){
        return this.getRelativeToSurfaceXY().y;
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
  customContextMenu: Blockly.Blocks['variables_pointer_get'].customContextMenu,

  //when the block is changed, 
  onchange: Blockly.Blocks.variablePlaceCheck
};

Blockly.Blocks['variables_pointer_&'] = {
  init: function() {
    this.setColour(45);
    this.interpolateMsg(
      '&' + ' %1 ', ['VALUE', null, Blockly.ALIGN_RIGHT],
      Blockly.ALIGN_RIGHT);
    this.setOutput(true);
  }
}

Blockly.Blocks['variables_pointer_*'] = {
  init: function() {
    this.setColour(45);
    this.interpolateMsg(
      '*' + ' %1 ', ['VALUE', null, Blockly.ALIGN_RIGHT],
      Blockly.ALIGN_RIGHT);
    this.setOutput(true);
  }
}

Blockly.Blocks['variables_array_get'] = {
  /**
   * Block for array getter.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.VARIABLES_GET_HELPURL);
    this.setColour(90);
    this.appendDummyInput()
      .appendField(Blockly.Msg.ARRAY_GET_TITLE)
      .appendField(new Blockly.FieldVariableArray('--Select--', null, this), 'VAR')
      .appendField(new Blockly.FieldTextInput('0'), 'LENGTH_1')
      .appendField(new Blockly.FieldTextInput(''), 'LENGTH_2')
      .appendField(new Blockly.FieldTextInput(''), 'LENGTH_3')
      .appendField(Blockly.Msg.VARIABLES_GET_TAIL);
    this.setOutput(true);
    this.setTooltip(Blockly.Msg.VARIABLES_GET_TOOLTIP);
    this.contextMenuMsg_ = Blockly.Msg.VARIABLES_GET_CREATE_SET;
    this.contextMenuType_ = 'variables_array_set';
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
     * Return this block's position
     */
    getPos: function(){
        return this.getRelativeToSurfaceXY().y;
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
    var option = {
      enabled: true
    };
    var name = this.getFieldValue('VAR');
    option.text = this.contextMenuMsg_.replace('%1', name);
    var xmlField = goog.dom.createDom('field', null, name);
    xmlField.setAttribute('name', 'VAR');
    var xmlBlock = goog.dom.createDom('block', null, xmlField);
    xmlBlock.setAttribute('type', this.contextMenuType_);
    option.callback = Blockly.ContextMenu.callbackFactory(this, xmlBlock);
    options.push(option);
  },

    /**
     * If index is over, initialize the field of index with 0
     * @param withinIdx1
     * @param withinIdx2
     * @param withinIdx3
     */
    initIdx: function(withinIdx1, withinIdx2, withinIdx3) {
        var initVal = 0;
        if (withinIdx1 == false) {
            this.setFieldValue(initVal, 'LENGTH_1');
        }
        else if (withinIdx2 == false) {
            this.setFieldValue(initVal, 'LENGTH_2');
        }
        else {
            this.setFieldValue(initVal, 'LENGTH_3');
        }

        return;

    },

  //when the block is changed, 
  onchange: Blockly.Blocks.requireInFunction
};

Blockly.Blocks['variables_array_set'] = {
  /**
   * Block for variable setter.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.VARIABLES_SET_HELPURL);
    this.setColour(90);
    this.interpolateMsg(
      // TODO: Combine these messages instead of using concatenation.
      Blockly.Msg.VARIABLES_SET_TITLE + ' %1 ' + ' %2' + '%3' + '%4 ' +
      Blockly.Msg.VARIABLES_SET_TAIL + ' %5', ['VAR', new Blockly.FieldVariableArray('--Select--', null, this)], ['LENGTH_1', new Blockly.FieldTextInput('0')], ['LENGTH_2', new Blockly.FieldTextInput('')], ['LENGTH_3', new Blockly.FieldTextInput('')], ['VALUE', null, Blockly.ALIGN_RIGHT],
      Blockly.ALIGN_RIGHT);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.VARIABLES_SET_TOOLTIP);
    this.contextMenuMsg_ = Blockly.Msg.VARIABLES_SET_CREATE_GET;
    this.contextMenuType_ = 'variables_array_get';
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
     * Return this block's position
     */
    getPos: function(){
        return this.getRelativeToSurfaceXY().y;
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
     * If index is over, initialize the field of index with 0
     * @param withinIdx1
     * @param withinIdx2
     * @param withinIdx3
     */
  initIdx: function(withinIdx1, withinIdx2, withinIdx3) {
      var initVal = 0;
      if (withinIdx1 == false) {
          this.setFieldValue(initVal, 'LENGTH_1');
      }
      else if (withinIdx2 == false) {
          this.setFieldValue(initVal, 'LENGTH_2');
      }
      else {
          this.setFieldValue(initVal, 'LENGTH_3');
      }

      return;

  },
  customContextMenu: Blockly.Blocks['variables_array_get'].customContextMenu,

  //when the block is changed, 
  onchange: Blockly.Blocks.requireInFunction
};

Blockly.Blocks['variables_array_declare'] = {
  init: function() {
      var TYPE =
          [
              [Blockly.Msg.VARIABLES_SET_TYPE_INT, 'int'],
              [Blockly.Msg.VARIABLES_SET_TYPE_UNSIGNED_INT, 'unsigned int'],
              [Blockly.Msg.VARIABLES_SET_TYPE_FLOAT, 'float'],
              [Blockly.Msg.VARIABLES_SET_TYPE_DOUBLE, 'double'],
              [Blockly.Msg.VARIABLES_SET_TYPE_CHAR, 'char']];
    this.setHelpUrl(Blockly.Msg.VARIABLES_SET_HELPURL);
    this.setColour(90);
    this.interpolateMsg(
      // TODO: Combine these messages instead of using concatenation.
      ' %1 ' +Blockly.Msg.VARIABLES_ARRAY_DECLARE_TITLE + ' '+
      Blockly.Msg.VARIABLES_DECLARE_NAME + ' %2 ' +
      Blockly.Msg.VARIABLES_ARRAY_DECLARE_LENGTH + ' %3' + ' %4' + ' %5 ' +
      Blockly.Msg.VARIABLES_DECLARE_INIT + ' %6', ['TYPES', new Blockly.FieldDropdown(TYPE)], ['VAR', new Blockly.FieldTextInput('myArray', Blockly.Blocks.CNameValidator)], ['LENGTH_1', new Blockly.FieldTextInput('1')], ['LENGTH_2', new Blockly.FieldTextInput('')], ['LENGTH_3', new Blockly.FieldTextInput('')], ['VALUE', null, Blockly.ALIGN_RIGHT],
      Blockly.ALIGN_RIGHT);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.VARIABLES_SET_TOOLTIP);
    this.contextMenuMsg_ = Blockly.Msg.VARIABLES_SET_CREATE_GET;
    this.contextMenuType_ = 'variables_array_get';
  },
  /**
   * Return 'array'.
   */
  getDist: function() {
    return 'a';
  },
    /**
     * Return Array's Scope
     */
    getScope: function() {
        return this.getSurroundParent().getName();
    },
    /**
     * Return this block's position
     */
    getPos: function(){
        return this.getRelativeToSurfaceXY().y;
    },
    /**
     * Return array's specfic.
     * specific means their Index
     */
    getSpec: function() {
        var length_1 = this.getFieldValue('LENGTH_1');
        var length_2 = this.getFieldValue('LENGTH_2');
        var length_3 = this.getFieldValue('LENGTH_3');
        length_1 = length_1 * 1;
        length_2 = length_2 * 1;
        length_3 = length_3 * 1;

        if (length_1 != 0 && length_2 == 0 && length_3 == 0)
            return [1, length_1];
        else if (length_1 != 0 && length_2 != 0 && length_3 == 0)
            return [2, length_1, length_2];
        else if (length_1 != 0 && length_2 != 0 && length_3 != 0)
            return [3, length_1, length_2, length_3];
    },
  //when the block is changed, 
  onchange: Blockly.Blocks.variablePlaceCheck,
  //when the block is changed, 
  // onchange: function() {
  //   Blockly.Blocks.requireInFunction();
  //   Blockly.Blocks.arrayTestFunction(this, this.getFieldValue('LENGTH_1'), this.getFieldValue('LENGTH_2'), this.getFieldValue('LENGTH_3'));
  // },
  /**
   * Return all variables's types referenced by this block.
   * @return {!Array.<string>} List of variable types.
   * @this Blockly.Block
   */
  getTypes: function() {
    return [this.getFieldValue('TYPES')];
  },
  getLength: function() {
    return [this.getFieldValue('LENGTH_1')];
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
  customContextMenu: Blockly.Blocks['variables_array_get'].customContextMenu
};