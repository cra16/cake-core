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
        this.setColour(160);
        this.appendDummyInput()
            .appendField(Blockly.Msg.DEFINE_GET_TITLE)
            .appendField(new Blockly.FieldVariableDefine(Blockly.Msg.SELECT_MENU, null, this), 'VAR')
            .appendField(Blockly.Msg.VARIABLES_GET_TAIL);
        this.setOutput(true, 'Macro');
        this.setTooltip(Blockly.Msg.VARIABLES_GET_TOOLTIP);
        this.contextMenuMsg_ = Blockly.Msg.VARIABLES_GET_CREATE_SET;
        this.contextMenuType_ = 'variables_set';
        this.tag = Blockly.Msg.TAG_DEFINE_GET;
    },
    /**
     * Return this block's tags.
     * @returns {Array} List of block tag.
     */
    getTags: function(){
        return this.tag;
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
};

Blockly.Blocks['define_declare'] = {
    init: function() {
       /* var DEFINE =
            [
                [Blockly.Msg.DEFINE_SET_TYPE_CONSTANT, 'constant'],
                [Blockly.Msg.DEFINE_SET_TYPE_MACRO, 'macro']
            ];*/
        this.setColour(160);
        var name = Blockly.Procedures.findLegalName(
            Blockly.Msg.DEFINE_DECLARE_DEFAULT_NAME, this);

        this.interpolateMsg(
            // TODO: Combine these messages instead of using concatenation.
            Blockly.Msg.DEFINE_DECLARE_TITLE  + ' ' +
            Blockly.Msg.VARIABLES_DECLARE_NAME + ' %1 ' +
            Blockly.Msg.DEFINE_DECLARE_INIT + ' %2',
            ['VAR', new Blockly.FieldTextInput(name, Blockly.Procedures.rename)],
            ['VALUE', null, Blockly.ALIGN_RIGHT],
            Blockly.ALIGN_RIGHT);

        this.setPreviousStatement(true, ['define_declare']);
        this.setNextStatement(true, ['define_declare', 'main_block']);
        this.setTooltip(Blockly.Msg.VARIABLES_DECLARE_TOOLTIP);
        this.contextMenuMsg_ = Blockly.Msg.VARIABLES_SET_CREATE_GET;
        this.contextMenuType_ = 'define_get';
        this.tag = Blockly.Msg.TAG_DEFINE_DECLARE;
        this.macroType_ = 'Macro';
    },

    initVar: function() {
        this.setFieldValue('', 'VAR');
    },
    /**
     * Return all variables's types referenced by this block.
     * @return {!Array.<string>} List of variable types.
     * @this Blockly.Block
     */
    getTypes: function() {
        return [this.macroType_];
    },

    getDist: function() {
        return 'd';
    },
    /**
     * Return Variable's Scope
     */
    getScope: function() {
        return ['Global'];
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
    onchange: function() {
        Blockly.Blocks.requireOutFunction();
        if (this.getInputTargetBlock('VALUE')) {
            var targetBlock = this.getInputTargetBlock('VALUE');

            if (targetBlock.type.match('math')) {
                //this.setFieldValue('int', 'DEFINES');
                this.macroType_ = 'int';
            }
            else if (targetBlock.type.match('text')) {
                if (targetBlock.getFieldValue('TEXT').length == 1) {
                    //this.setFieldValue('char', 'DEFINES');
                    this.macroType_ = 'char';
                }
                else {
                    //this.setFieldValue('dbchar', 'DEFINES');
                    this.macroType_ = 'dbchar';
                }
            }
        }
    }
};

Blockly.Blocks['variables_get'] = {
    /**
     * Block for variable getter.
     * @this Blockly.Block
     */
    init: function() {
        this.setColour(350);
        this.appendDummyInput()
            .appendField(Blockly.Msg.VARIABLES_GET_TITLE)
            .appendField(new Blockly.FieldVariable(Blockly.Msg.SELECT_MENU, null, this), 'VAR')
            .appendField(Blockly.Msg.VARIABLES_GET_TAIL);
        this.setOutput(true, 'Variable');
        this.setTooltip(Blockly.Msg.VARIABLES_GET_TOOLTIP);
        this.contextMenuMsg_ = Blockly.Msg.VARIABLES_GET_CREATE_SET;
        this.contextMenuType_ = 'variables_set';
        this.tag = Blockly.Msg.TAG_VARIABLE_GET;
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
    onchange: function() {
        Blockly.Blocks.requireInFunction(this);
        var varName = this.getFieldValue('VAR');
        var varType = Blockly.FieldDropdown.prototype.getTypefromVars(varName, 0);
        this.setOutputType('VAR', varType);
    },

    setOutputType: function(dist, varType) {
        switch(varType) {
            case ("int"):
                this.changeOutput(dist+'_INT');
                break;
            case ("unsigned int"):
                this.changeOutput(dist+'_UNINT');
                break;
            case ("float"):
                this.changeOutput(dist+'_FLOAT');
                break;
            case ("double"):
                this.changeOutput(dist+'_DOUBLE');
                break;
            case ("char"):
                this.changeOutput(dist+'_CHAR');
                break;
        }
    }
};

Blockly.Blocks['variables_set'] = {
    /**
     * Block for variable setter.
     * @this Blockly.Block
     */
    init: function() {
        this.setColour(350);

        this.interpolateMsg(
            // TODO: Combine these messages instead of using concatenation.
            Blockly.Msg.VARIABLES_SET_TITLE + ' %1 ' +
            Blockly.Msg.VARIABLES_SET_TAIL + ' %2',
            ['VAR', new Blockly.FieldVariable(Blockly.Msg.SELECT_MENU, null, this)],
            ['VALUE', null, Blockly.ALIGN_RIGHT],
            Blockly.ALIGN_RIGHT);

        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip(Blockly.Msg.VARIABLES_SET_TOOLTIP);
        this.contextMenuMsg_ = Blockly.Msg.VARIABLES_SET_CREATE_GET;
        this.contextMenuType_ = 'variables_get';
        this.tag = Blockly.Msg.TAG_VARIABLE_SET;
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
    onchange: function() {
        Blockly.Blocks.requireInFunction(this);
        var varName = this.getFieldValue('VAR');
        var type = Blockly.FieldDropdown.prototype.getTypefromVars(varName, 0);

        if (type == false) {
            type = 'int';
        }
        if (this.getInputTargetBlock('VALUE')) {
            Blockly.Blocks.setCheckVariable(this, type, 'VALUE');
        }
    }
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
        this.setColour(350);
        var name = Blockly.Procedures.findLegalName(
            Blockly.Msg.VARIABLES_DECLARE_DEFAULT_NAME, this);

        this.interpolateMsg(
            // TODO: Combine these messages instead of using concatenation.
            '%1 ' + Blockly.Msg.VARIABLES_DECLARE_TITLE +
            Blockly.Msg.VARIABLES_DECLARE_NAME + ' %2 ' +
            Blockly.Msg.VARIABLES_DECLARE_INIT + ' %3 ',
            ['TYPES', new Blockly.FieldDropdown(TYPE, null, this)],
            ['VAR', new Blockly.FieldTextInput(name, Blockly.Procedures.rename)],
            ['VALUE', null, Blockly.ALIGN_RIGHT],
            Blockly.ALIGN_RIGHT);

        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip(Blockly.Msg.VARIABLES_DECLARE_TOOLTIP);
        this.contextMenuMsg_ = Blockly.Msg.VARIABLES_SET_CREATE_GET;
        this.contextMenuType_ = 'variables_get';
        this.tag = Blockly.Msg.TAG_VARIABLE_DECLARE;
    },

    initVar: Blockly.Blocks['define_declare'].initVar,

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
        if (this.getSurroundParent()) {
            return this.getSurroundParent().getName();
        }
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
    onchange: function() {
        Blockly.Blocks.variablePlaceCheck(this);
        var type = this.getFieldValue('TYPES');
        if (type == false) {
            type = 'int';
        }

        //if (this.getInputTargetBlock('VALUE')) {
            Blockly.Blocks.setCheckVariable(this, type, 'VALUE');
        //}

    }
};

Blockly.Blocks['variables_pointer_get'] = {
    /**
     * Block for pointer getter.
     * @this Blockly.Block
     */
    init: function() {
        this.setColour(25);
        this.appendDummyInput()
            .appendField(Blockly.Msg.POINTER_GET_TITLE)
            .appendField(new Blockly.FieldVariablePointer(Blockly.Msg.SELECT_MENU, null, this), 'VAR')
            .appendField(Blockly.Msg.VARIABLES_GET_TAIL);
        this.setOutput(true, 'Pointer');
        this.setTooltip(Blockly.Msg.VARIABLES_GET_TOOLTIP);
        this.contextMenuMsg_ = Blockly.Msg.VARIABLES_GET_CREATE_SET;
        this.contextMenuType_ = 'variables_pointer_set';
        this.tag = Blockly.Msg.TAG_VARIABLE_POINTER_GET;
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
    onchange: function() {
        Blockly.Blocks.requireInFunction(this);

        var varName = this.getFieldValue('VAR');
        var varType = Blockly.FieldDropdown.prototype.getTypefromVars(varName, 0);
        var dimension = Blockly.FieldDropdown.prototype.getTypefromVars(varName, 5);
        if (dimension == '*') {
            this.setOutputType('PTR', varType);
        }
        else if(dimension == '**') {
            this.setOutputType('DBPTR', varType);
        }
    },
    setOutputType: Blockly.Blocks['variables_get'].setOutputType
};

Blockly.Blocks['variables_pointer_set'] = {
    /**
     * Block for pointer setter.
     * @this Blockly.Block
     */
    init: function() {
        this.setColour(25);
        this.interpolateMsg(
            // TODO: Combine these messages instead of using concatenation.
            Blockly.Msg.VARIABLES_SET_TITLE + ' %1 ' +
            Blockly.Msg.VARIABLES_SET_TAIL + ' %2',
            ['VAR', null, Blockly.ALIGN_RIGHT],
            ['VALUE', null, Blockly.ALIGN_RIGHT],
            Blockly.ALIGN_RIGHT);
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip(Blockly.Msg.VARIABLES_SET_TOOLTIP);
        this.contextMenuMsg_ = Blockly.Msg.VARIABLES_SET_CREATE_GET;
        this.contextMenuType_ = 'variables_pointer_get';
        this.tag = Blockly.Msg.TAG_VARIABLE_POINTER_SET;
    },

    /**
     * Return all variables referenced by this block.
     * @return {!Array.<string>} List of variable names.
     * @this Blockly.Block
     */
    getVars: function() {
        return [this.getInputTargetBlock('VAR')];
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
    onchange: //Blockly.Blocks.requireInFunction
        function() {
            Blockly.Blocks.requireInFunction(this);

            if(this.getInput('VAR')) {
                var ptrName = this.getInputTargetBlock('VAR').getFieldValue('VAR');
                var ptrType = Blockly.FieldDropdown.prototype.getTypefromVars(ptrName, 0);
                Blockly.Blocks.setCheckPointer(this, ptrType, 'VALUE');
            }
        }
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
        this.setColour(25);
        var name = Blockly.Procedures.findLegalName(
            Blockly.Msg.VARIABLES_POINTER_DECLARE_DEFAULT_NAME, this);

        this.interpolateMsg(
            // TODO: Combine these messages instead of using concatenation.
            '%1 ' + Blockly.Msg.VARIABLES_POINTER_DECLARE_TITLE +
            Blockly.Msg.VARIABLES_POINTER_DECLARE_ITERATION + ' %2 ' +
            Blockly.Msg.VARIABLES_DECLARE_NAME + ' %3 ' +
            Blockly.Msg.VARIABLES_DECLARE_INIT + ' %4 ',
            ['TYPES', new Blockly.FieldDropdown(TYPE, null, this)],
            ['ITERATION', new Blockly.FieldTextInput('*')],
            ['VAR', new Blockly.FieldTextInput(name, Blockly.Procedures.rename)],
            ['VALUE', null, Blockly.ALIGN_RIGHT],
            Blockly.ALIGN_RIGHT);

        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip(Blockly.Msg.VARIABLES_DECLARE_TOOLTIP);
        this.contextMenuMsg_ = Blockly.Msg.VARIABLES_SET_CREATE_GET;
        this.contextMenuType_ = 'variables_pointer_get';
        this.tag = Blockly.Msg.TAG_VARIABLE_POINTER_DECLARE;
    },

    initVar: Blockly.Blocks['define_declare'].initVar,

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
    getType: function() {
        return this.getFieldValue('TYPES');
    },

    /**
     * Return all variables's types referenced by this block.
     * @return {!Array.<string>} List of variable types.
     * @this Blockly.Block
     */
    getTypes: function() {
        if (this.getFieldValue('ITERATION') == '**'){
            return ['db'+ this.getFieldValue('TYPES')]
        }else {
            return [this.getFieldValue('TYPES')];
        }
    },
    /**
     * Return Pointer's Scope
     */
    getScope: Blockly.Blocks['variables_declare'].getScope,
    //    function() {
    //    return this.getSurroundParent().getName();
    //},
    /**
     * Return this block's position
     */
    getPos: function(){
        return this.getRelativeToSurfaceXY().y;
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
    customContextMenu: Blockly.Blocks['variables_pointer_get'].customContextMenu,

    //when the block is changed,
    onchange: function() {
        Blockly.Blocks.variablePlaceCheck(this);
        var type = this.getFieldValue('TYPES');

        if (type == false) {
            type = 'int';
        }
        if (this.getFieldValue('ITERATION') == '*') {
            Blockly.Blocks.setCheckPointer(this, type, 'VALUE');
        }
        else if (this.getFieldValue('ITERATION') == '**') {
            Blockly.Blocks.setCheckPointer(this, 'db' + type, 'VALUE');
        }

    }
};

Blockly.Blocks['variables_array_get'] = {
    /**
     * Block for array getter.
     * @this Blockly.Block
     */
    init: function() {
        this.setColour(48);
        this.appendDummyInput()
            .appendField(Blockly.Msg.ARRAY_GET_TITLE)
            .appendField(new Blockly.FieldVariableArray(Blockly.Msg.SELECT_MENU, null, this), 'VAR')
            .appendField(new Blockly.FieldTextInput('0'), 'LENGTH_1')
            .appendField(new Blockly.FieldTextInput(''), 'LENGTH_2')
            .appendField(new Blockly.FieldTextInput(''), 'LENGTH_3')
            .appendField(Blockly.Msg.VARIABLES_GET_TAIL);

        this.setOutput(true, 'Array');

        this.setTooltip(Blockly.Msg.VARIABLES_GET_TOOLTIP);
        this.contextMenuMsg_ = Blockly.Msg.VARIABLES_GET_CREATE_SET;
        this.contextMenuType_ = 'variables_array_set';
        this.tag = Blockly.Msg.TAG_VARIABLE_ARRAY_GET;
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

    getInputIdxLength: function() {
        var inputLength = 0;

        for ( var temp = 1 ; temp <= 3 ; temp++ ) {
            if(this.getFieldValue('LENGTH_'+temp)) {
                inputLength++;
            }
        }
        return inputLength;
    },
    //when the block is changed,
    onchange: function() {
        Blockly.Blocks.requireInFunction(this);

        var arrName = this.getFieldValue('VAR');
        var arrIdxLength = Blockly.FieldVariableArray.getBlockIdxLength(arrName);
        var arrType = Blockly.FieldDropdown.prototype.getTypefromVars(arrName, 0);

        var inputLength = this.getInputIdxLength();

        // type: variable
        if (arrIdxLength == inputLength) {
            this.setOutputType('VAR', arrType);
        }
        // type: pointer
        else if (arrIdxLength > inputLength) {
            this.setOutputType('PTR', arrType);
        }
        else {
            this.changeOutput('Array');
        }
    },
    setOutputType: Blockly.Blocks['variables_get'].setOutputType
};

Blockly.Blocks['variables_array_set'] = {
    /**
     * Block for variable setter.
     * @this Blockly.Block
     */
    init: function() {
        this.setColour(48);
        this.appendDummyInput()
            .appendField(Blockly.Msg.VARIABLES_SET_TITLE)
            .appendField(new Blockly.FieldVariableArray(Blockly.Msg.SELECT_MENU, null, this), 'VAR')
            .appendField(new Blockly.FieldTextInput('0'), 'LENGTH_1')
            .appendField(new Blockly.FieldTextInput(''), 'LENGTH_2')
            .appendField(new Blockly.FieldTextInput(''), 'LENGTH_3')
            .appendField(Blockly.Msg.VARIABLES_SET_TAIL);
        this.appendValueInput('VALUE');

        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip(Blockly.Msg.VARIABLES_SET_TOOLTIP);
        this.contextMenuMsg_ = Blockly.Msg.VARIABLES_SET_CREATE_GET;
        this.contextMenuType_ = 'variables_array_get';
        this.tag = Blockly.Msg.TAG_VARIABLE_ARRAY_SET;
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
    initIdx: Blockly.Blocks['variables_array_get'].initIdx,
    customContextMenu: Blockly.Blocks['variables_array_get'].customContextMenu,
    getInputIdxLength: Blockly.Blocks['variables_array_get'].getInputIdxLength,
    //when the block is changed,
    onchange: function() {
        Blockly.Blocks.requireInFunction(this);

        if (this.getFieldValue('VAR')) {
            var option = this.getFieldValue('VAR');
            var type = Blockly.FieldDropdown.prototype.getTypefromVars(option, 0);
            var arrIdxLength = Blockly.FieldVariableArray.getBlockIdxLength(option);

            var inputLength = this.getInputIdxLength();
            // type: variable
            if (arrIdxLength == inputLength) {
                Blockly.Blocks.setCheckVariable(this, type, 'VALUE');
            }
            // type: pointer
            else {
                Blockly.Blocks.setCheckPointer(this, type, 'VALUE');
            }
        }
    }
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
        this.setColour(48);
        var name = Blockly.Procedures.findLegalName(
            Blockly.Msg.VARIABLES_ARRAY_DECLARE_DEFAULT_NAME, this);

        this.interpolateMsg(
            // TODO: Combine these messages instead of using concatenation.
            ' %1 ' +Blockly.Msg.VARIABLES_ARRAY_DECLARE_TITLE + ' '+
            Blockly.Msg.VARIABLES_DECLARE_NAME + ' %2 ' +
            Blockly.Msg.VARIABLES_ARRAY_DECLARE_LENGTH + ' %3' + ' %4' + ' %5 ',
            ['TYPES', new Blockly.FieldDropdown(TYPE)],
            ['VAR', new Blockly.FieldTextInput(name, Blockly.Procedures.rename)],
            ['LENGTH_1', new Blockly.FieldTextInput('1')],
            ['LENGTH_2', new Blockly.FieldTextInput('')],
            ['LENGTH_3', new Blockly.FieldTextInput('')],
            Blockly.ALIGN_RIGHT);

        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip(Blockly.Msg.VARIABLES_DECLARE_TOOLTIP);
        this.contextMenuMsg_ = Blockly.Msg.VARIABLES_SET_CREATE_GET;
        this.contextMenuType_ = 'variables_array_get';
        this.tag = Blockly.Msg.TAG_VARIABLE_ARRAY_DECLARE;
    },

    initVar: Blockly.Blocks['define_declare'].initVar,

    /**
     * Return 'array'.
     */
    getDist: function() {
        return 'a';
    },
    /**
     * Return Array's Scope
     */
    getScope: Blockly.Blocks['variables_declare'].getScope,
    //    function() {
    //    return this.getSurroundParent().getName();
    //},
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

Blockly.Blocks['variables_pointer_&'] = {
    init: function() {
        this.setColour(25);
        this.interpolateMsg(
            '&' + ' %1 ', ['VALUE',
                ['Variable', 'VAR_INT', 'VAR_UNINT', 'VAR_FLOAT', 'VAR_DOUBLE', 'VAR_CHAR', 'Array',
                    'Pointer', 'PTR_INT', 'PTR_UNINT', 'PTR_FLOAT', 'PTR_DOUBLE', 'PTR_CHAR'], Blockly.ALIGN_RIGHT],
            Blockly.ALIGN_RIGHT);
        this.setOutput(true, 'Address');
        this.tag = Blockly.Msg.TAG_VARIABLE_POINTER_ADDR;
    },

    onchange: function() {
        if (this.getInputTargetBlock('VALUE'))
        {
            var nextblock = this.getInputTargetBlock('VALUE');
            var varName = nextblock.getVars();
            var varType = Blockly.FieldDropdown.prototype.getTypefromVars(varName, 0);

            if(nextblock.type.search('variables') ==  0) {
                // & POINTER -> Double Pointer
                if (nextblock.type.search('pointer') > 0) {
                    this.setOutputType('DBPTR', varType);
                }
                // & ARRAY (variable) -> Pointer , & ARRAY (pointer) -> Double Pointer
                else if (nextblock.type.search('array') > 0) {
                    var arrIdxLength = Blockly.FieldVariableArray.getBlockIdxLength(varName);
                    var inputIdxLength = nextblock.getInputIdxLength();

                    // type: variable
                    if (arrIdxLength == inputIdxLength) {
                        this.setOutputType('PTR', varType);
                    }
                    // type: pointer
                    else {
                        this.setOutputType('DBPTR', varType);
                    }
                }
                // & VARIABLE -> Pointer
                else {
                    this.setOutputType('PTR', varType);
                }
            }
        }
    },
    setOutputType: Blockly.Blocks['variables_get'].setOutputType
};

Blockly.Blocks['variables_pointer_*'] = {
    init: function() {
        this.setColour(25);
        this.interpolateMsg(
            '*' + ' %1 ', ['VALUE', ['Pointer', 'PTR_INT', 'PTR_UNINT', 'PTR_FLOAT', 'PTR_DOUBLE', 'PTR_CHAR',
                'DBPTR_INT', 'DBPTR_UNINT', 'DBPTR_FLOAT', 'DBPTR_DOUBLE', 'DBPTR_CHAR', 'Array', 'Aster'], Blockly.ALIGN_RIGHT],
            Blockly.ALIGN_RIGHT);
        this.setOutput(true, 'Aster');
        this.tag = Blockly.Msg.TAG_VARIABLE_POINTER_ASTR;
    },

    onchange: function() {
        if (this.getInputTargetBlock('VALUE'))
        {
            var nextblock = this.getInputTargetBlock('VALUE');


             // ** variables
             if (nextblock.type.search('variables_pointer_*') == 0) {
                 if (nextblock.getInputTargetBlock('VALUE')) {
                     nextblock = nextblock.getInputTargetBlock('VALUE');
                     // DOUBLE POINTER
                     if (nextblock.type.search('variables') == 0) {
                         if (nextblock.type.search('pointer') > 0) {
                             var varName = nextblock.getVars();
                             var varType = Blockly.FieldDropdown.prototype.getTypefromVars(varName, 0);
                             var dimension = Blockly.FieldDropdown.prototype.getTypefromVars(varName, 5);
                             // **DOUBLE POINTER -> Variable
                             if (dimension == '**') {
                                 this.setOutputType('VAR', varType);
                             }
                         }
                     }
                 }
            }

            // * variables
            else if (nextblock.type.search('variables') == 0) {
                var varName = nextblock.getVars();
                var varType = Blockly.FieldDropdown.prototype.getTypefromVars(varName, 0);

                // POINTER
                if (nextblock.type.search('pointer') > 0) {
                    var dimension = Blockly.FieldDropdown.prototype.getTypefromVars(varName, 5);
                    // *POINTER -> Variable
                    if (dimension == '*') {
                        this.setOutputType('VAR', varType);
                    }
                    // *DOUBLE POINTER -> Pointer
                    else if (dimension == '**') {
                        this.setOutputType('PTR', varType);
                    }
                }
                // ARRAY
                else if (nextblock.type.search('array') > 0) {
                    var arrIdxLength = Blockly.FieldVariableArray.getBlockIdxLength(varName);
                    var inputIdxLength = nextblock.getInputIdxLength();
                    // *ARRAY(pointer) -> Variable
                    if (arrIdxLength > inputIdxLength) {
                        this.setOutputType('VAR', varType);
                    }

                }

            }

        }

    },
    setOutputType: Blockly.Blocks['variables_get'].setOutputType

};