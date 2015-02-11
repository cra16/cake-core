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
        var DEFINE =
            [
                [Blockly.Msg.DEFINE_SET_TYPE_CONSTANT, 'constant'],
                [Blockly.Msg.DEFINE_SET_TYPE_MACRO, 'macro']
            ];
        this.setHelpUrl(Blockly.Msg.VARIABLES_SET_HELPURL);
        this.setColour(160);
        var name = Blockly.Procedures.findLegalName(
            Blockly.Msg.DEFINE_DECLARE_DEFAULT_NAME, this);

        this.interpolateMsg(
            // TODO: Combine these messages instead of using concatenation.
            Blockly.Msg.DEFINE_DECLARE_TITLE + ' %1 ' +
            Blockly.Msg.VARIABLES_DECLARE_NAME + ' %2 ' +
            Blockly.Msg.DEFINE_DECLARE_INIT + ' %3',
            ['DEFINES', new Blockly.FieldDropdown(DEFINE)],
            ['VAR', new Blockly.FieldTextInput(name, Blockly.Procedures.rename)],
            //['VAR', new Blockly.FieldTextInput('myMacro', Blockly.Blocks.CNameValidator)],
            ['VALUE', null, Blockly.ALIGN_RIGHT],
            Blockly.ALIGN_RIGHT);

        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip(Blockly.Msg.VARIABLES_SET_TOOLTIP);
        this.contextMenuMsg_ = Blockly.Msg.VARIABLES_SET_CREATE_GET;
        this.contextMenuType_ = 'define_get';
        this.tag = Blockly.Msg.TAG_DEFINE_DECLARE;
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
    onchange: Blockly.Blocks.requireOutFunction
};

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
        Blockly.Blocks.requireInFunction();
        var varName = this.getFieldValue('VAR');
        var varType = Blockly.FieldDropdown.prototype.getTypefromVars(varName, 0);
        this.setOutputType('VAR', varType);
    },

    setOutputType: function(dist, varType) {
        switch(varType) {
            case ("int"):
                console.log(dist+'_INT');
                this.changeOutput(dist+'_INT');
                break;
            case ("unsigned int"):
                this.changeOutput(dist+'_UNINT');
                break;
            case ("float"):
                this.changeOutput(dist+'_FLOAT');
                break;
            case ("double"):
                console.log(dist+'_DOUBLE');
                this.changeOutput(dist+'_DOUBLE');
                break;
            case ("char"):
                this.changeOutput(dist+'CHAR');
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
        this.setHelpUrl(Blockly.Msg.VARIABLES_SET_HELPURL);
        this.setColour(330);

        var dropdown = new Blockly.FieldVariable('--Select--', function(option) {
            var type = Blockly.FieldDropdown.prototype.getTypefromVars(option, 0);
            this.sourceBlock_.updateShape_(type);
        }, this);

        this.appendDummyInput()
            .appendField(Blockly.Msg.VARIABLES_SET_TITLE)
            .appendField(dropdown, 'VAR')
            .appendField(Blockly.Msg.VARIABLES_SET_TAIL);
        this.setInputsInline(true);

        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip(Blockly.Msg.VARIABLES_SET_TOOLTIP);
        this.contextMenuMsg_ = Blockly.Msg.VARIABLES_SET_CREATE_GET;
        this.contextMenuType_ = 'variables_get';
        this.tag = Blockly.Msg.TAG_VARIABLE_SET;
    },
    /**
     * Create XML to represent whether the 'divisorInput' should be present.
     * @return {Element} XML storage element.
     * @this Blockly.Block
     */
    mutationToDom: function() {
        var container = document.createElement('mutation');
        var InputType = (this.getFieldValue('TYPES') == 'char');
        container.setAttribute('char_type', InputType);
        return container;
    },
    /**
     * Parse XML to restore the 'divisorInput'.
     * @param {!Element} xmlElement XML storage element.
     * @this Blockly.Block
     */
    domToMutation: function(xmlElement) {
        var Input_type = (xmlElement.getAttribute('char_type') == 'true');
        this.updateShape_(Input_type);
    },
    /**
     * change setCheck with variable type
     * @param type
     * @private
     */
    updateShape_:
        function(type) {
            // input == 'char' : isChar = 1
            // else : isChar = 0
            // Add or remove a Value Input.

            var inputExists = this.getInput('VALUE');

            // remove input
            if(inputExists) {
                this.removeInput('VALUE');
            }
            // recreate input
            if (type == 'int') {
                this.appendValueInput('VALUE')
                    .setCheck(['VAR_INT', 'INT', 'NEGATIVE', 'NUMBER',  'Aster', 'Array', 'Boolean', 'Macro', 'Variable']);
            }
            else if (type == 'unsigned int') {
                this.appendValueInput('VALUE')
                    .setCheck(['VAR_UNINT', 'INT', 'NUMBER', 'Aster', 'Array', 'Boolean', 'Macro', 'Variable']);
            }
            else if (type == 'float') {
                this.appendValueInput('VALUE')
                    .setCheck(['VAR_FLOAT', 'DOUBLE', 'NUMBER', 'Aster', 'Array', 'Boolean', 'Macro', 'Variable']);
            }
            else if (type == 'double') {
                this.appendValueInput('VALUE')
                    .setCheck(['VAR_DOUBLE', 'DOUBLE', 'NUMBER', 'Aster', 'Array', 'Boolean', 'Macro', 'Variable']);
            }
            else if(type == 'char') {
                this.appendValueInput('VALUE')
                    .setCheck(['VAR_CHAR', 'String', 'Aster', 'Array', 'Boolean', 'Macro', 'Variable']);
            }
            else {
                this.appendValueInput('VALUE')
                    .setCheck(['Number', 'Aster', 'Array', 'Boolean', 'Macro', 'Variable']);
            }
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
                ['--Select--', false],
                [Blockly.Msg.VARIABLES_SET_TYPE_INT, 'int'],
                [Blockly.Msg.VARIABLES_SET_TYPE_UNSIGNED_INT, 'unsigned int'],
                [Blockly.Msg.VARIABLES_SET_TYPE_FLOAT, 'float'],
                [Blockly.Msg.VARIABLES_SET_TYPE_DOUBLE, 'double'],
                [Blockly.Msg.VARIABLES_SET_TYPE_CHAR, 'char']];
        this.setHelpUrl(Blockly.Msg.VARIABLES_SET_HELPURL);
        this.setColour(330);
        var name = Blockly.Procedures.findLegalName(
            Blockly.Msg.VARIABLES_DECLARE_DEFAULT_NAME, this);

        var dropdown = new Blockly.FieldDropdown(TYPE, function(option) {
            this.sourceBlock_.updateShape_(option);
        });
        this.appendDummyInput().appendField(dropdown, 'TYPES');
        this.interpolateMsg(
            // TODO: Combine these messages instead of using concatenation.
            Blockly.Msg.VARIABLES_DECLARE_TITLE + ' '+
            Blockly.Msg.VARIABLES_DECLARE_NAME + ' %1 ' +
            Blockly.Msg.VARIABLES_DECLARE_INIT,
            ['VAR', new Blockly.FieldTextInput(name, Blockly.Procedures.rename)],
//          ['VAR', new Blockly.FieldTextInput('myVariable', Blockly.Blocks.CNameValidator)],
            Blockly.ALIGN_RIGHT);

        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip(Blockly.Msg.VARIABLES_SET_TOOLTIP);
        this.contextMenuMsg_ = Blockly.Msg.VARIABLES_SET_CREATE_GET;
        this.contextMenuType_ = 'variables_get';
        this.tag = Blockly.Msg.TAG_VARIABLE_DECLARE;
    },
    mutationToDom: Blockly.Blocks['variables_set'].mutationToDom,
    domToMutation: Blockly.Blocks['variables_set'].domToMutation,
    updateShape_: Blockly.Blocks['variables_set'].updateShape_,

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
        Blockly.Blocks.requireInFunction();

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
        this.setHelpUrl(Blockly.Msg.VARIABLES_SET_HELPURL);
        this.setColour(45);

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
        Blockly.Blocks.requireInFunction();

        if(this.getInput('VAR')) {
            var ptrName = this.getInputTargetBlock('VAR').getFieldValue('VAR');
            var ptrType = Blockly.FieldDropdown.prototype.getTypefromVars(ptrName, 0);
            var dimension = Blockly.FieldDropdown.prototype.getTypefromVars(ptrName, 5);

            switch (ptrType) {
                case ('int'):
                    this.getInput('VALUE').setCheck(['PTR_INT', 'Address', 'Pointer']);
                    break;
                case ('unsigned int'):
                    this.getInput('VALUE').setCheck(['PTR_UNINT', 'Address', 'Pointer']);
                    break;
                case ('float'):
                    this.getInput('VALUE').setCheck(['PTR_FLOAT', 'Address', 'Pointer']);
                    break;
                case ('double'):
                    this.getInput('VALUE').setCheck(['PTR_DOUBLE', 'Address', 'Pointer']);
                    break;
                case ('char'):
                    this.getInput('VALUE').setCheck(['PTR_CHAR', 'Address', 'Pointer']);
                    break;
                case ('dbint'):
                    this.getInput('VALUE').setCheck(['DBPTR_INT', 'Address', 'Pointer']);
                    break;
                case ('dbunsigned int'):
                    this.getInput('VALUE').setCheck(['DBPTR_UNINT', 'Address', 'Pointer']);
                    break;
                case ('dbfloat'):
                    this.getInput('VALUE').setCheck(['DBPTR_FLOAT', 'Address', 'Pointer']);
                    break;
                case ('dbdouble'):
                    this.getInput('VALUE').setCheck(['DBPTR_DOUBLE', 'Address', 'Pointer']);
                    break;
                case ('dbchar'):
                    this.getInput('VALUE').setCheck(['DBPTR_CHAR', 'Address', 'Pointer']);
                    break;


            }
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
        this.setHelpUrl(Blockly.Msg.VARIABLES_SET_HELPURL);
        this.setColour(45);
        var name = Blockly.Procedures.findLegalName(
            Blockly.Msg.VARIABLES_POINTER_DECLARE_DEFAULT_NAME, this);

        var dropdown = new Blockly.FieldDropdown(TYPE, function(option) {
            var inputVal;
            if (option == 'char') {
                inputVal = 1;
            }
            else {
                inputVal = 0;
            }
            this.sourceBlock_.updateShape_(inputVal);
        });

        this.appendDummyInput().appendField(dropdown, 'TYPES');
        this.interpolateMsg(
            // TODO: Combine these messages instead of using concatenation.
            Blockly.Msg.VARIABLES_POINTER_DECLARE_TITLE +
            Blockly.Msg.VARIABLES_POINTER_DECLARE_ITERATION + ' %1 ' +
            Blockly.Msg.VARIABLES_DECLARE_NAME + ' %2 ' +
            Blockly.Msg.VARIABLES_DECLARE_INIT,
            ['ITERATION', new Blockly.FieldTextInput('*')],
            ['VAR', new Blockly.FieldTextInput(name, Blockly.Procedures.rename)],
            Blockly.ALIGN_RIGHT);


        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip(Blockly.Msg.VARIABLES_SET_TOOLTIP);
        this.contextMenuMsg_ = Blockly.Msg.VARIABLES_SET_CREATE_GET;
        this.contextMenuType_ = 'variables_pointer_get';
        this.tag = Blockly.Msg.TAG_VARIABLE_POINTER_DECLARE;
    },

    mutationToDom: Blockly.Blocks['variables_set'].mutationToDom,
    domToMutation: Blockly.Blocks['variables_set'].domToMutation,
    /**
     * Modify this block to have (or not have) an input for 'is divisible by'.
     * @param {boolean} divisorInput True if this block has a divisor input.
     * @private
     * @this Blockly.Block
     */
    updateShape_: function(isChar) {
        // input == 'char' : isChar = 1
        // else : isChar = 0
        // Add or remove a Value Input.

        var inputExists = this.getInput('VALUE');

        // remove input
        if(inputExists) {
            this.removeInput('VALUE');
        }
        // recreate input
        if(isChar) {
            this.appendValueInput('VALUE')
                .setCheck(['Address', 'Pointer', 'Array', 'String']);
        }
        else {
            this.appendValueInput('VALUE')
                .setCheck(['Address', 'Pointer', 'Array']);
        }

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
        if (this.getFieldValue('ITERATION') == '**'){
            return ['db'+ this.getFieldValue('TYPES')]
        }else {
            return [this.getFieldValue('TYPES')];
        }
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
            '&' + ' %1 ', ['VALUE',
                ['Variable', 'VAR_INT', 'VAR_UNINT', 'VAR_FLOAT', 'VAR_DOUBLE', 'VAR_CHAR', 'Array',
                    'Pointer', 'PTR_INT', 'PTR_UNINT', 'PTR_FLOAT', 'PTR_DOUBLE', 'PTR_CHAR'], Blockly.ALIGN_RIGHT],
            Blockly.ALIGN_RIGHT);
        this.setOutput(true, 'Address');
        this.tag = Blockly.Msg.TAG_VARIABLE_POINTER_ADDR;
    }
};

Blockly.Blocks['variables_pointer_*'] = {
    init: function() {
        this.setColour(45);
        this.interpolateMsg(
            '*' + ' %1 ', ['VALUE', ['Pointer', 'PTR_INT', 'PTR_UNINT', 'PTR_FLOAT', 'PTR_DOUBLE', 'PTR_CHAR',
                'DBPTR_INT', 'DBPTR_UNINT', 'DBPTR_FLOAT', 'DBPTR_DOUBLE', 'DBPTR_CHAR'], Blockly.ALIGN_RIGHT],
            Blockly.ALIGN_RIGHT);
        this.setOutput(true, 'Aster');
        this.tag = Blockly.Msg.TAG_VARIABLE_POINTER_ASTR;
    }
};

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
            //.appendField(varOutput, 'VAR')
            .appendField(new Blockly.FieldVariableArray('--Select--', null, this), 'VAR')
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
    //when the block is changed,
    onchange: function() {

        Blockly.Blocks.requireInFunction();

        var arrName = this.getFieldValue('VAR');
        var arrIdxLength = Blockly.FieldVariableArray.getBlockIdxLength(arrName);

        var inputLength = 0;
        for ( var temp = 1 ; temp <= 3 ; temp++ ) {
            if(this.getFieldValue('LENGTH_'+temp)) {
                inputLength++;
            }
        }

        // type: variable
        if (arrIdxLength == inputLength) {
            this.changeOutput('Variable');

        }
        // type: pointer
        else if (arrIdxLength > inputLength) {
            this.changeOutput('Pointer');
        }
        else {
            this.changeOutput('Array');
        }
    }

};

Blockly.Blocks['variables_array_set'] = {
    /**
     * Block for variable setter.
     * @this Blockly.Block
     */
    init: function() {
        this.setHelpUrl(Blockly.Msg.VARIABLES_SET_HELPURL);
        this.setColour(90);
        var dropdown = new Blockly.FieldVariableArray('--Select--', function(option) {

            this.sourceBlock_.updateShape_(option);
        }, this);

        this.appendDummyInput()
            .appendField(Blockly.Msg.VARIABLES_SET_TITLE)
            //     .appendField(new Blockly.FieldVariableArray('--Select--', null, this), 'VAR')
            .appendField(dropdown, 'VAR')
            .appendField(new Blockly.FieldTextInput('0'), 'LENGTH_1')
            .appendField(new Blockly.FieldTextInput(''), 'LENGTH_2')
            .appendField(new Blockly.FieldTextInput(''), 'LENGTH_3')
            .appendField(Blockly.Msg.VARIABLES_SET_TAIL);
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip(Blockly.Msg.VARIABLES_SET_TOOLTIP);
        this.contextMenuMsg_ = Blockly.Msg.VARIABLES_SET_CREATE_GET;
        this.contextMenuType_ = 'variables_array_get';
        this.tag = Blockly.Msg.TAG_VARIABLE_ARRAY_SET;
    },
    mutationToDom: Blockly.Blocks['variables_set'].mutationToDom,
    domToMutation: Blockly.Blocks['variables_set'].domToMutation,
    /**
     *
     * @param option
     * @private
     */
    updateShape_: function(option) {
        // input == 'char' : isChar = 1
        // else : isChar = 0
        // Add or remove a Value Input.
        var type = Blockly.FieldDropdown.prototype.getTypefromVars(option, 0);

        var inputExists = this.getInput('VALUE');

        // remove input
        if(inputExists) {
            this.removeInput('VALUE');
        }

//        var arrName = this.getFieldValue('VAR');
        var arrIdxLength = Blockly.FieldVariableArray.getBlockIdxLength(option);

        var inputLength = 0;
        for ( var temp = 1 ; temp <= 3 ; temp++ ) {
            if(this.getFieldValue('LENGTH_'+temp)) {
                inputLength++;
            }
        }

        // type: variable
        if (arrIdxLength == inputLength) {
            // recreate input
            if(type == 'char') {
                this.appendValueInput('VALUE')
                    .setCheck(['String', 'Aster', 'Array', 'Boolean', 'Macro', 'Variable']);
            }
            else {
                this.appendValueInput('VALUE')
                    .setCheck(['Number', 'Aster', 'Array', 'Boolean', 'Macro', 'Variable']);
            }
        }

        // type: pointer
        else {
            this.appendValueInput('VALUE')
                .setCheck(['Address', 'Array', 'Pointer']);
        }
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
        var name = Blockly.Procedures.findLegalName(
            Blockly.Msg.VARIABLES_ARRAY_DECLARE_DEFAULT_NAME, this);

        this.interpolateMsg(
            // TODO: Combine these messages instead of using concatenation.
            ' %1 ' +Blockly.Msg.VARIABLES_ARRAY_DECLARE_TITLE + ' '+
            Blockly.Msg.VARIABLES_DECLARE_NAME + ' %2 ' +
            Blockly.Msg.VARIABLES_ARRAY_DECLARE_LENGTH + ' %3' + ' %4' + ' %5 ',
            ['TYPES', new Blockly.FieldDropdown(TYPE)],
            ['VAR', new Blockly.FieldTextInput(name, Blockly.Procedures.rename)],
            ['LENGTH_1', new Blockly.FieldTextInput('1', Blockly.FieldTextInput.numberValidator)],
            ['LENGTH_2', new Blockly.FieldTextInput('')],
            ['LENGTH_3', new Blockly.FieldTextInput('')],
            Blockly.ALIGN_RIGHT);

        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip(Blockly.Msg.VARIABLES_SET_TOOLTIP);
        this.contextMenuMsg_ = Blockly.Msg.VARIABLES_SET_CREATE_GET;
        this.contextMenuType_ = 'variables_array_get';
        this.tag = Blockly.Msg.TAG_VARIABLE_ARRAY_DECLARE;
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