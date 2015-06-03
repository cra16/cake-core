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

goog.provide('Blockly.Blocks.procedures');

goog.require('Blockly.Blocks');


Blockly.Blocks['main_block'] = {
    init: function() {
        this.setColour(300);
        var name = Blockly.Procedures.findLegalName(
            Blockly.Msg.PROCEDURES_DEFRETURN_PROCEDURE, this);
        this.appendDummyInput()
            .appendField(Blockly.Msg.MAIN_BLOCK);
        this.appendStatementInput('STACK')
            .appendField(Blockly.Msg.PROCEDURES_DEFRETURN_DO);
        this.appendValueInput('RETURN')
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField(Blockly.Msg.MAIN_BLOCK_RETURN);
        this.setTooltip(Blockly.Msg.PROCEDURES_DEFRETURN_TOOLTIP);
        this.arguments_ = [];
        this.types_ = [];
        this.types_[0] = 'int';
        this.types_[1] = 'char**';
        this.arguments_[0] = 'argc';
        this.arguments_[1] = 'argv';
        this.statementConnection_ = null;
        this.setPreviousStatement(true, ["define_declare"]);
        this.setNextStatement(true, ["procedures_defnoreturn", "procedures_defreturn"]);

        Blockly.Blocks.setCheckVariable(this, 'int', 'RETURN');
    },
    getName: function(){
        return ['Main'];
    },
    /**
     * return function's parameter information
     * return type = [type, dist, name, scope, position, specific]
     * */
    getParamInfo: function() {
        var paramList = [
            ['int', 'v', 'argc', 'Main', this.getRelativeToSurfaceXY().y, null],
            ['dbchar', 'p', 'argv', 'Main', this.getRelativeToSurfaceXY().y, '***']
        ];
        return paramList;
    }
};

Blockly.Blocks['procedures_return'] = {
    /**
     * Block for return in function block.
     * @this Blockly.Block
     */
    init: function() {
        this.setColour(300);
        this.appendValueInput('VALUE')
            .appendField(Blockly.Msg.PROCEDURES_RETURN_TITLE);
        this.setTooltip(Blockly.Msg.PROCEDURES_RETURN_TOOLTIP);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
    },
    getType : function() {
        var block = this;
        var typeConfig = false;
        while(block.getSurroundParent()){
            block = this.getSurroundParent();
            if(block.type == 'main_block' || block.type == 'procedures_defreturn'){
                typeConfig = true;
                break;
            }
        }
        if(typeConfig && block.type =='main_block'){
            return 'int';
        }
        else if(typeConfig && block.type == 'procedures_defreturn') {
            return block.getType();
        }
    },

    onchange: function() {
        Blockly.Blocks.requireInFunction();

        if (!this.workspace) {
            // Block has been deleted.
            return;
        }

        var block = this;
        var typeConfig = false;
        while(block.getSurroundParent()){
            block = this.getSurroundParent();
            if(block.type == 'main_block' || block.type == 'procedures_defnoreturn' || block.type == 'procedures_defreturn'){
                typeConfig = true;
                break;
            }
        }
        if(typeConfig && block.type =='main_block'){
            Blockly.Blocks.setCheckVariable(block, 'int', 'RETURN');
        }
        else if(typeConfig && (block.type == 'procedures_defnoreturn' || block.type == 'procedures_defreturn')) {
            block.updateShape();

            var dist = block.getFieldValue('DISTS');
            var type = block.getFieldValue('TYPES');
            if (dist == 'array') {
                dist = 'variable';
                //dist = 'pointer';
            }

            // variable
            if (dist == 'variable') {
                Blockly.Blocks.setCheckVariable(block, type, 'RETURN');
            }
            // pointer
            else {
                Blockly.Blocks.setCheckPointer(block, type, 'RETURN');
            }
        }
    }

};

Blockly.Blocks['procedures_defnoreturn'] = {
    /**
     * Block for defining a procedure with no return value.
     * @this Blockly.Block
     */
    init: function() {
        this.setColour(300);
        var name = Blockly.Procedures.findLegalName(
            Blockly.Msg.PROCEDURES_DEFNORETURN_PROCEDURE, this);
        this.appendDummyInput()
            .appendField(Blockly.Msg.PROCEDURES_DEFNORETURN_TITLE)
            .appendField(new Blockly.FieldTextInput(name,
                Blockly.Procedures.rename), 'NAME')
            .appendField('', 'PARAMS');
        this.appendStatementInput('STACK')
            .appendField(Blockly.Msg.PROCEDURES_DEFNORETURN_DO);
        this.setMutator(new Blockly.Mutator(['procedures_mutatorarg', 'procedures_mutatorarg_pointer', 'procedures_mutatorarg_array']));
        this.setTooltip(Blockly.Msg.PROCEDURES_DEFNORETURN_TOOLTIP);
        this.arguments_ = [];
        this.types_ = [];
        this.dist_ = [];
        this.spec_ =[];
        this.tag = Blockly.Msg.TAG_PROCEDURE_DEFNORETURN;
        this.setPreviousStatement(true, ["procedures_defnoreturn", "procedures_defreturn", "main_block"]);
        this.setNextStatement(true, ["procedures_defnoreturn", "procedures_defreturn"]);
    },
    initName: function() {
        this.setFieldValue('', 'NAME');
    },

    getName: function(){
        return [this.getFieldValue('NAME')];
    },
    onchange: Blockly.Blocks.requireOutFunction,
    /**
     * Update the display of parameters for this procedure definition block.
     * Display a warning if there are duplicately named parameters.
     * @private
     * @this Blockly.Block
     */
    updateParams_: function() {
        // Check for duplicated arguments.
        var badArg = false;
        var hash = {};
        for (var x = 0; x < this.arguments_.length; x++) {
            if (hash['arg_' + this.arguments_[x].toLowerCase()]) {
                badArg = true;
                break;
            }
            hash['arg_' + this.arguments_[x].toLowerCase()] = true;
        }
        if (badArg) {
            this.setWarningText(Blockly.Msg.PROCEDURES_DEF_DUPLICATE_WARNING);
        } else {
            this.setWarningText(null);
        }
        // Merge the arguments into a human-readable list.
        var paramString = '';
        if (this.arguments_.length) {
            paramString = Blockly.Msg.PROCEDURES_BEFORE_PARAMS;
            for (var x = 0; x < this.arguments_.length; x++) {
                if (x == 0) {
                    if(this.dist_[x]=='v'){
                        paramString = paramString + ' ' + this.types_[x] + ' ' + this.arguments_[x];
                    }
                    else if(this.dist_[x]=='a'){
                        if(this.spec_[x][0]==1)
                            paramString = paramString + ' ' + this.types_[x] + ' '+ this.arguments_[x] + '[' + this.spec_[x][1] + ']';
                        else if(this.spec_[x][0]==2)
                            paramString = paramString + ' ' + this.types_[x] + ' '+ this.arguments_[x] + '[' + this.spec_[x][1] + ']' + '[' + this.spec_[x][2] + ']';
                        else if(this.spec_[x][0]==3)
                            paramString = paramString + ' ' + this.types_[x] + ' '+ this.arguments_[x] + '[' + this.spec_[x][1] + ']' + '[' + this.spec_[x][2] + ']' + '[' + this.spec_[x][3] + ']';
                    }
                    else if(this.dist_[x]=='p'){
                        paramString = paramString + ' ' + this.types_[x] + this.spec_[x] + ' ' + this.arguments_[x];
                    }
                }
                else {
                    if(this.dist_[x]=='v'){
                        paramString = paramString + ', ' + this.types_[x] + ' ' + this.arguments_[x];
                    }
                    else if(this.dist_[x]=='a'){
                        if(this.spec_[x][0]==1)
                            paramString = paramString + ' ' + this.types_[x] + ' '+ this.arguments_[x] + '[' + this.spec_[x][1] + ']';
                        else if(this.spec_[x][0]==2)
                            paramString = paramString + ' ' + this.types_[x] + ' '+ this.arguments_[x] + '[' + this.spec_[x][1] + ']' + '[' + this.spec_[x][2] + ']';
                        else if(this.spec_[x][0]==3)
                            paramString = paramString + ' ' + this.types_[x] + ' '+ this.arguments_[x] + '[' + this.spec_[x][1] + ']' + '[' + this.spec_[x][2] + ']' + '[' + this.spec_[x][3] + ']';
                    }
                    else if(this.dist_[x]=='p'){
                        paramString = paramString + ', ' + this.types_[x] + this.spec_[x] + ' ' + this.arguments_[x];
                    }
                }
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
        for (var x = 0; x < this.arguments_.length; x++) {
            var parameter = document.createElement('arg');
            parameter.setAttribute('name', this.arguments_[x]);
            parameter.setAttribute('types', this.types_[x]);
            parameter.setAttribute('dist', this.dist_[x]);
            if(this.dist_[x]=='a'){
                if(this.spec_[x][0] == 1 ){
                    parameter.setAttribute('length_1', this.spec_[x][1]);
                }
                else if(this.spec_[x][0] == 2){
                    parameter.setAttribute('length_1', this.spec_[x][1]);
                    parameter.setAttribute('length_2', this.spec_[x][2]);
                }
                else if(this.spec_[x][0] == 3){
                    parameter.setAttribute('length_1', this.spec_[x][1]);
                    parameter.setAttribute('length_2', this.spec_[x][2]);
                    parameter.setAttribute('length_3', this.spec_[x][3]);
                }
            }
            else if(this.dist_[x]=='p'){
                parameter.setAttribute('iteration', this.spec_[x]);
            }
            container.appendChild(parameter);
        }

        // Save whether the statement input is visible.
        if (!this.getInput('STACK').isVisible()) {
            container.setAttribute('statements', 'false');
        }
        return container;
    },
    /**
     * Parse XML to restore the argument inputs.
     * @param {!Element} xmlElement XML storage element.
     * @this Blockly.Block
     */
    domToMutation: function(xmlElement) {
        this.arguments_ = [];
        for (var x = 0, childNode; childNode = xmlElement.childNodes[x]; x++) {
            if (childNode.nodeName.toLowerCase() == 'arg') {
                this.arguments_.push(childNode.getAttribute('name'));
                this.types_.push(childNode.getAttribute('types'));
                this.dist_.push(childNode.getAttribute('dist'));
                if(childNode.getAttribute('dist')=='v'){
                    this.spec_.push(null);
                }
                else if(childNode.getAttribute('dist')=='a'){
                    var length_1 = childNode.getFieldValue('length_1');
                    var length_2 = childNode.getFieldValue('length_2');
                    var length_3 = childNode.getFieldValue('length_3');
                    length_1 = length_1 * 1;
                    length_2 = length_2 * 1;
                    length_3 = length_3 * 1;

                    if (length_1 != 0 && length_2 == 0 && length_3 == 0)
                        this.spec_.push([1, childNode.getFieldValue('length_1')]);
                    else if (length_1 != 0 && length_2 != 0 && length_3 == 0)
                        this.spec_.push([2, childNode.getFieldValue('length_1'), childNode.getFieldValue('length_2')]);
                    else if (length_1 != 0 && length_2 != 0 && length_3 != 0)
                        this.spec_.push([3, childNode.getFieldValue('length_1'), childNode.getFieldValue('length_2'), childNode.getFieldValue('length_3')]);
                }
                else if(childNode.getAttribute('dist')=='p'){
                    this.spec_.push(childNode.getAttribute('iteration'));
                }
            }
        }
        this.updateParams_();

        // Show or hide the statement input.
        var hasStatements = xmlElement.getAttribute('statements') !== 'false';
        this.getInput('STACK').setVisible(hasStatements);
    },
    /**
     * Populate the mutator's dialog with this block's components.
     * @param {!Blockly.Workspace} workspace Mutator's workspace.
     * @return {!Blockly.Block} Root block in mutator.
     * @this Blockly.Block
     */
    decompose: function(workspace) {
        var containerBlock = Blockly.Block.obtain(workspace,
            'procedures_mutatorcontainer');
        containerBlock.initSvg();

        // Check/uncheck the allow statement box.
        if (this.getInput('RETURN')) {
            var hasStatements = this.getInput('STACK').isVisible();
            containerBlock.setFieldValue(hasStatements ? 'TRUE' : 'FALSE',
                'STATEMENTS');
        } else {
            containerBlock.getInput('STATEMENT_INPUT').setVisible(false);
        }

        // Parameter list.
        var connection = containerBlock.getInput('STACK').connection;
        for (var x = 0; x < this.arguments_.length; x++) {
            var paramBlock;
            if(this.dist_[x]=='v'){
                paramBlock = Blockly.Block.obtain(workspace, 'procedures_mutatorarg');
                paramBlock.initSvg();
                paramBlock.setFieldValue(this.arguments_[x], 'NAME');
                paramBlock.setFieldValue(this.types_[x], 'TYPES');
            }
            else if(this.dist_[x]=='a'){
                paramBlock = Blockly.Block.obtain(workspace, 'procedures_mutatorarg_array');
                paramBlock.initSvg();
                paramBlock.setFieldValue(this.arguments_[x], 'NAME');
                paramBlock.setFieldValue(this.types_[x], 'TYPES');
                if(this.spec_[x][0]==1)
                    paramBlock.setFieldValue(this.spec_[x][1], 'LENGTH_1');
                else if(this.spec_[x][0]==2){
                    paramBlock.setFieldValue(this.spec_[x][1], 'LENGTH_1');
                    paramBlock.setFieldValue(this.spec_[x][2], 'LENGTH_2');
                }
                else if(this.spec_[x][0]==3){
                    paramBlock.setFieldValue(this.spec_[x][1], 'LENGTH_1');
                    paramBlock.setFieldValue(this.spec_[x][2], 'LENGTH_2');
                    paramBlock.setFieldValue(this.spec_[x][3], 'LENGTH_3');
                }
            }
            else if(this.dist_[x]=='p'){
                paramBlock = Blockly.Block.obtain(workspace, 'procedures_mutatorarg_pointer');
                paramBlock.initSvg();
                paramBlock.setFieldValue(this.arguments_[x], 'NAME');
                paramBlock.setFieldValue(this.types_[x], 'TYPES');
                paramBlock.setFieldValue(this.spec_[x], 'ITERATION');
            }
            // Store the old location.
            paramBlock.oldLocation = x;
            connection.connect(paramBlock.previousConnection);
            connection = paramBlock.nextConnection;
        }
        // Initialize procedure's callers with blank IDs.
        Blockly.Procedures.mutateCallers(this.getFieldValue('NAME'), this.getFieldValue('TYPES'),
            this.workspace, this.arguments_, this.types_, this.dist_, this.spec_, null);
        return containerBlock;
    },
    /**
     * Reconfigure this block based on the mutator dialog's components.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
    compose: function(containerBlock) {
        // Parameter list.
        this.arguments_ = [];
        this.types_ = [];
        this.dist_ = [];
        this.spec_ = [];
        this.paramIds_ = [];
        var paramBlock = containerBlock.getInputTargetBlock('STACK');
        while (paramBlock) {
            this.arguments_.push(paramBlock.getFieldValue('NAME'));
            this.types_.push(paramBlock.getFieldValue('TYPES'));
            this.dist_.push(paramBlock.getDist());
            if(paramBlock.getDist()=='v'){
                this.spec_.push(null);
            }
            else if(paramBlock.getDist()=='a') {
                var length_1 = paramBlock.getFieldValue('LENGTH_1');
                var length_2 = paramBlock.getFieldValue('LENGTH_2');
                var length_3 = paramBlock.getFieldValue('LENGTH_3');
                var convert_length_1 = length_1 * 1;
                var convert_length_2 = length_2 * 1;
                var convert_length_3 = length_3 * 1;

                if (convert_length_1 != 0 && convert_length_2 == 0 && convert_length_3 == 0)
                    this.spec_.push([1, length_1]);
                else if (convert_length_1 != 0 && convert_length_2 != 0 && convert_length_3 == 0)
                    this.spec_.push([2, length_1, length_2]);
                else if (convert_length_1 != 0 && convert_length_2 != 0 && convert_length_3 != 0)
                    this.spec_.push([3, length_1, length_2, length_3]);

            }
            else if(paramBlock.getDist()=='p'){
                this.spec_.push(paramBlock.getFieldValue('ITERATION'));
            }
            this.paramIds_.push(paramBlock.id);
            paramBlock = paramBlock.nextConnection &&
            paramBlock.nextConnection.targetBlock();
        }
        this.updateParams_();
        Blockly.Procedures.mutateCallers(this.getFieldValue('NAME'), this.getFieldValue('TYPES'),
            this.workspace, this.arguments_, this.types_, this.dist_, this.spec_, this.paramIds_);

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
     * Return the signature of this procedure definition.
     * @return {!Array} Tuple containing three elements:
     *     - the name of the defined procedure,
     *     - a list of all its arguments,
     *     - that it DOES NOT have a return value.
     * @this Blockly.Block
     */
    getProcedureDef: function() {
        return [false, this.getFieldValue('NAME'), this.getFieldValue('TYPES'), this.arguments_, this.types_, this.dist_, this.spec_];
    },
    /**
     * Return all variables referenced by this block.
     * @return {!Array.<string>} List of variable names.
     * @this Blockly.Block
     */
    getVars: function() {
        return this.arguments_;
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
        for (var x = 0; x < this.arguments_.length; x++) {
            if (Blockly.Names.equals(oldName, this.arguments_[x])) {
                this.arguments_[x] = newName;
                change = true;
            }
        }
        if (change) {
            this.updateParams_();
            // Update the mutator's variables if the mutator is open.
            if (this.mutator.isVisible_()) {
                var blocks = this.mutator.workspace_.getAllBlocks();
                for (var x = 0, block; block = blocks[x]; x++) {
                    if (block.type == 'procedures_mutatorarg' &&
                        Blockly.Names.equals(oldName, block.getFieldValue('NAME'))) {
                        block.setFieldValue(newName, 'NAME');
                    } else if (block.type == 'procedures_mutatorarg_pointer' &&
                        Blockly.Names.equals(oldName, block.getFieldValue('NAME'))) {
                        block.setFieldValue(newName, 'NAME');
                    } else if (block.type == 'procedures_mutatorarg_array' &&
                        Blockly.Names.equals(oldName, block.getFieldValue('NAME'))) {
                        block.setFieldValue(newName, 'NAME');
                    }
                }
            }
        }
    },
    /**
     * Add custom menu options to this block's context menu.
     * @param {!Array} options List of menu options to add to.
     * @this Blockly.Block
     */
    customContextMenu: function(options) {
        // Add option to create caller.
        var option = {
            enabled: true
        };
        var name = this.getFieldValue('NAME');
        option.text = Blockly.Msg.PROCEDURES_CREATE_DO.replace('%1', name);
        var xmlMutation = goog.dom.createDom('mutation');
        xmlMutation.setAttribute('name', name);
        for (var x = 0; x < this.arguments_.length; x++) {
            var xmlArg = goog.dom.createDom('arg');
            xmlArg.setAttribute('name', this.arguments_[x]);
            xmlMutation.appendChild(xmlArg);
        }
        var xmlBlock = goog.dom.createDom('block', null, xmlMutation);
        xmlBlock.setAttribute('type', this.callType_);
        option.callback = Blockly.ContextMenu.callbackFactory(this, xmlBlock);
        options.push(option);

        // Add options to create getters for each parameter.
        if (!this.isCollapsed()) {
            for (var x = 0; x < this.arguments_.length; x++) {
                var option = {
                    enabled: true
                };
                var name = this.arguments_[x];
                option.text = Blockly.Msg.VARIABLES_SET_CREATE_GET.replace('%1', name);
                var xmlField = goog.dom.createDom('field', null, name);
                xmlField.setAttribute('name', 'VAR');
                var xmlBlock = goog.dom.createDom('block', null, xmlField);
                xmlBlock.setAttribute('type', 'variables_declare');
                option.callback = Blockly.ContextMenu.callbackFactory(this, xmlBlock);
                options.push(option);
            }
        }
    },
    callType_: 'procedures_callnoreturn',
    /**
     * return function's parameter information
     * return type = [type, dist, name, scope, position, specific]
     * */
    getParamInfo: function(){
        var paramList = [];
        for(var i = 0; i<this.arguments_.length; i++){
            paramList.push([this.types_[i], this.dist_[i], this.arguments_[i], this.getFieldValue('NAME'), this.getRelativeToSurfaceXY().y, this.spec_[i]]);
        }
        return paramList;
    }
};

Blockly.Blocks['procedures_defreturn'] = {
    /**
     * Block for defining a procedure with a return value.
     * @this Blockly.Block
     */
    init: function() {
        var TYPE =
            [
                [Blockly.Msg.VARIABLES_SET_TYPE_INT, 'int'],
                [Blockly.Msg.VARIABLES_SET_TYPE_UNSIGNED_INT, 'unsigned int'],
                [Blockly.Msg.VARIABLES_SET_TYPE_FLOAT, 'float'],
                [Blockly.Msg.VARIABLES_SET_TYPE_DOUBLE, 'double'],
                [Blockly.Msg.VARIABLES_SET_TYPE_CHAR, 'char']];
        var DIST = [
            [Blockly.Msg.VARIABLES_SET_DIST_VARIABLE, 'variable'],
            [Blockly.Msg.VARIABLES_SET_DIST_POINTER, 'pointer'],
            [Blockly.Msg.VARIABLES_SET_DIST_ARRAY, 'array']
        ];
        this.setColour(300);
        var name = Blockly.Procedures.findLegalName(
            Blockly.Msg.PROCEDURES_DEFRETURN_PROCEDURE, this);
        this.appendDummyInput()
            .appendField(Blockly.Msg.PROCEDURES_DEFRETURN_TITLE)
            .appendField(new Blockly.FieldTextInput(name, Blockly.Procedures.rename), 'NAME')
            .appendField('', 'PARAMS');
        this.appendStatementInput('STACK')
            .appendField(Blockly.Msg.PROCEDURES_DEFRETURN_DO);
        this.appendValueInput('RETURN')
            .appendField(Blockly.Msg.PROCEDURES_DEFRETURN_RETURN)
            .appendField(new Blockly.FieldDropdown(TYPE), 'TYPES')
            .appendField(new Blockly.FieldDropdown(DIST), 'DISTS')
            .setAlign(Blockly.ALIGN_RIGHT);
        this.setMutator(new Blockly.Mutator(['procedures_mutatorarg', 'procedures_mutatorarg_pointer', 'procedures_mutatorarg_array']));
        this.setTooltip(Blockly.Msg.PROCEDURES_DEFRETURN_TOOLTIP);
        this.arguments_ = [];
        this.types_ = [];
        this.dist_ = [];
        this.spec_ = [];
        this.tag = Blockly.Msg.TAG_PROCEDURE_DEFRETURN;
        this.setPreviousStatement(true, ["procedures_defnoreturn", "procedures_defreturn", "main_block"]);
        this.setNextStatement(true, ["procedures_defnoreturn", "procedures_defreturn"]);
    },
    initName: Blockly.Blocks['procedures_defnoreturn'].initName,
    getName: function(){
        return [this.getFieldValue('NAME')];
    },
    updateShape: function(){
        var PSPEC = [
            [Blockly.Msg.VARIABLES_SET_POINTER_SPEC_ONE, '*'],
            [Blockly.Msg.VARIABLES_SET_POINTER_SPEC_TWO, '**']
        ];
        var ASPEC = [
            [Blockly.Msg.VARIABLES_SET_ARRAY_SPEC_ONE, '[]'],
            [Blockly.Msg.VARIABLES_SET_ARRAY_SPEC_TWO, '[][]'],
            [Blockly.Msg.VARIABLES_SET_ARRAY_SPEC_THREE, '[][][]']
        ];
        if(this.getFieldValue('DISTS') == null){
        }
        else if(this.getFieldValue('DISTS') == 'variable'){
            if(this.getField_('PSPECS')){
                this.inputList[2].removeField('PSPECS');
            }
            else if(this.getField_('ASPECS')){
                this.inputList[2].removeField('ASPECS');
            }
        }
        else if(this.getFieldValue('DISTS') == 'pointer'){
            if(!this.getField_('PSPECS')){
                this.inputList[2].appendField(new Blockly.FieldDropdown(PSPEC), 'PSPECS');
            }
            if(this.getField_('ASPECS')){
                this.inputList[2].removeField('ASPECS');
            }
        }
        else if(this.getFieldValue('DISTS') == 'array'){
            if(!this.getField_('ASPECS')){
                this.inputList[2].appendField(new Blockly.FieldDropdown(ASPEC), 'ASPECS');
            }
            if(this.getField_('PSPECS')){
                this.inputList[2].removeField('PSPECS');
            }
        }
    },
    updateParams_: Blockly.Blocks['procedures_defnoreturn'].updateParams_,
    mutationToDom: Blockly.Blocks['procedures_defnoreturn'].mutationToDom,
    domToMutation: Blockly.Blocks['procedures_defnoreturn'].domToMutation,
    decompose: Blockly.Blocks['procedures_defnoreturn'].decompose,
    compose: Blockly.Blocks['procedures_defnoreturn'].compose,
    dispose: Blockly.Blocks['procedures_defnoreturn'].dispose,
    /**
     * Return the signature of this procedure definition.
     * @return {!Array} Tuple containing three elements:
     *     - the name of the defined procedure,
     *     - a list of all its arguments,
     *     - that it DOES have a return value.
     * @this Blockly.Block
     */
    getProcedureDef: function() {
        if(this.getFieldValue('DISTS') == 'variable'){
            return [true, this.getFieldValue('NAME'), this.getFieldValue('TYPES'), this.arguments_, this.types_, this.dist_, this.spec_, this.getFieldValue('DISTS')];
        }
        else if(this.getFieldValue('DISTS') == 'pointer'){
            return [true, this.getFieldValue('NAME'), this.getFieldValue('TYPES'), this.arguments_, this.types_, this.dist_, this.spec_, this.getFieldValue('DISTS'), this.getFieldValue('PSPECS')];
        }
        else if(this.getFieldValue('DISTS') == 'array'){
            return [true, this.getFieldValue('NAME'), this.getFieldValue('TYPES'), this.arguments_, this.types_, this.dist_, this.spec_, this.getFieldValue('DISTS'), this.getFieldValue('ASPECS')];
        }
    },
    getType: function() {
        return [this.getFieldValue('TYPES')];
    },
    getVars: Blockly.Blocks['procedures_defnoreturn'].getVars,
    renameVar: Blockly.Blocks['procedures_defnoreturn'].renameVar,
    customContextMenu: Blockly.Blocks['procedures_defnoreturn'].customContextMenu,
    callType_: 'procedures_callreturn',
    onchange: function(){
        Blockly.Blocks.requireOutFunction();
        this.updateShape();

        var dist = this.getFieldValue('DISTS');
        var type = this.getFieldValue('TYPES');
        if (dist == 'array') {
            dist = 'variable';
        }

        // variable
        if (dist == 'variable' ) {
            Blockly.Blocks.setCheckVariable(this, type, 'RETURN');
        }
        // pointer
        else {
            var spec = this.getFieldValue('PSPECS');
            if (spec == "*") {
                Blockly.Blocks.setCheckPointer(this, type, 'RETURN');
            }
            else if (spec == "**") {
                Blockly.Blocks.setCheckPointer(this, 'db'+type, 'RETURN');

            }
        }


    },

    /**
     * return function's parameter information
     * return type = [type, dist, name, scope, position, specific]
     * */
    getParamInfo: function(){
        var paramList = [];
        if(this.arguments_.length) {
            for (var i = 0; i < this.arguments_.length; i++) {
                paramList.push([this.types_[i], this.dist_[i], this.arguments_[i], this.getFieldValue('NAME'), this.getRelativeToSurfaceXY().y, this.spec_[i]]);
            }
        }
        return paramList;
    }
};

Blockly.Blocks['procedures_mutatorcontainer'] = {
    /**
     * Mutator block for procedure container.
     * @this Blockly.Block
     */
    init: function() {
        this.setColour(300);
        this.appendDummyInput()
            .appendField(Blockly.Msg.PROCEDURES_MUTATORCONTAINER_TITLE);
        this.appendStatementInput('STACK');
        this.appendDummyInput('STATEMENT_INPUT')
            .appendField(Blockly.Msg.PROCEDURES_ALLOW_STATEMENTS)
            .appendField(new Blockly.FieldCheckbox('TRUE'), 'STATEMENTS');
        this.setTooltip(Blockly.Msg.PROCEDURES_MUTATORCONTAINER_TOOLTIP);
        this.contextMenu = false;
    }
};

Blockly.Blocks['procedures_mutatorarg'] = {
    /**
     * Mutator block for procedure argument.
     * @this Blockly.Block
     */
    init: function() {
        var TYPE =
            [
                [Blockly.Msg.VARIABLES_SET_TYPE_INT, 'int'],
                [Blockly.Msg.VARIABLES_SET_TYPE_UNSIGNED_INT, 'unsigned int'],
                [Blockly.Msg.VARIABLES_SET_TYPE_FLOAT, 'float'],
                [Blockly.Msg.VARIABLES_SET_TYPE_DOUBLE, 'double'],
                [Blockly.Msg.VARIABLES_SET_TYPE_CHAR, 'char']];
        this.setColour(300);
        this.appendDummyInput()
            .appendField('variable')
            .appendField(new Blockly.FieldDropdown(TYPE), 'TYPES')
            .appendField(Blockly.Msg.PROCEDURES_MUTATORARG_TITLE)
            .appendField(new Blockly.FieldTextInput('x', Blockly.Blocks.CNameValidator), 'NAME');
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
    },
    getDist: function() {
        return 'v';
    },
    getSpec: function(){
        return null;
    }
};

Blockly.Blocks['procedures_mutatorarg_array'] = {
    /**
     * Mutator block for procedure argument.
     * @this Blockly.Block
     */
    init: function() {
        var TYPE =
            [
                [Blockly.Msg.VARIABLES_SET_TYPE_INT, 'int'],
                [Blockly.Msg.VARIABLES_SET_TYPE_UNSIGNED_INT, 'unsigned int'],
                [Blockly.Msg.VARIABLES_SET_TYPE_FLOAT, 'float'],
                [Blockly.Msg.VARIABLES_SET_TYPE_DOUBLE, 'double'],
                [Blockly.Msg.VARIABLES_SET_TYPE_CHAR, 'char']];
        this.setColour(300);
        this.interpolateMsg(
            // TODO: Combine these messages instead of using concatenation.
            'array %1 ' + Blockly.Msg.VARIABLES_ARRAY_DECLARE_LENGTH + ' %2 ' +' %3 ' +' %4 ' +
            Blockly.Msg.VARIABLES_DECLARE_NAME + ' %5 ', ['TYPES', new Blockly.FieldDropdown(TYPE)], ['LENGTH_1', new Blockly.FieldTextInput('1')], ['LENGTH_2', new Blockly.FieldTextInput(' ')], ['LENGTH_3', new Blockly.FieldTextInput(' ')], ['NAME', new Blockly.FieldTextInput('z', Blockly.Blocks.CNameValidator)],
            Blockly.ALIGN_RIGHT);
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
    },
    getDist: function() {
        return 'a';
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
    }
};

Blockly.Blocks['procedures_mutatorarg_pointer'] = {
    /**
     * Mutator block for procedure argument.
     * @this Blockly.Block
     */
    init: function() {
        var TYPE =
            [
                [Blockly.Msg.VARIABLES_SET_TYPE_INT, 'int'],
                [Blockly.Msg.VARIABLES_SET_TYPE_UNSIGNED_INT, 'unsigned int'],
                [Blockly.Msg.VARIABLES_SET_TYPE_FLOAT, 'float'],
                [Blockly.Msg.VARIABLES_SET_TYPE_DOUBLE, 'double'],
                [Blockly.Msg.VARIABLES_SET_TYPE_CHAR, 'char']];
        var ITERATION =
            [
                [Blockly.Msg.VARIABLES_SET_ITERATION_NORMAL, '*'],
                [Blockly.Msg.VARIABLES_SET_ITERATION_DOUBLE, '**'],
                [Blockly.Msg.VARIABLES_SET_ITERATION_TRIPLE, '***']
            ];
        this.setColour(300);
        this.interpolateMsg(
            // TODO: Combine these messages instead of using concatenation.
            'pointer %1 ' + Blockly.Msg.VARIABLES_POINTER_DECLARE_ITERATION + ' %2 ' +
            Blockly.Msg.VARIABLES_DECLARE_NAME + ' %3 ', ['TYPES', new Blockly.FieldDropdown(TYPE)], ['ITERATION', new Blockly.FieldDropdown(ITERATION)], ['NAME', new Blockly.FieldTextInput('y', Blockly.Blocks.CNameValidator)],
            Blockly.ALIGN_RIGHT);
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
    },
    getDist: function() {
        return 'p';
    },
    getSpec: function(){
        return [this.getFieldValue('ITERATION')];
    }
};

Blockly.Blocks['procedures_callnoreturn'] = {
    /**
     * Block for calling a procedure with no return value.
     * @this Blockly.Block
     */
    init: function() {
        this.setColour(300);
        this.appendDummyInput()
            .appendField(Blockly.Msg.PROCEDURES_CALLNORETURN_CALL)
            .appendField('', 'NAME')
            .appendField(Blockly.Msg.PROCEDURES_CALL_BEFORE_PARAMS, 'WITH');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        // Tooltip is set in domToMutation.
        this.arguments_ = [];
        this.types_ = [];
        this.dist_ = [];
        this.spec_ = [];
        this.quarkConnections_ = null;
        this.quarkArguments_ = null;
    },
    /**
     * Returns the name of the procedure this block calls.
     * @return {string} Procedure name.
     * @this Blockly.Block
     */
    getProcedureCall: function() {
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
        if (Blockly.Names.equals(oldName, this.getProcedureCall())) {
            this.setFieldValue(newName, 'NAME');
            this.setTooltip(
                (this.outputConnection ? Blockly.Msg.PROCEDURES_CALLRETURN_TOOLTIP : Blockly.Msg.PROCEDURES_CALLNORETURN_TOOLTIP)
                    .replace('%1', newName));
        }
    },
    /**
     * Notification that the procedure's parameters have changed.
     * @param {!Array.<string>} paramNames New param names, e.g. ['x', 'y', 'z'].
     * @param {!Array.<string>} paramIds IDs of params (consistent for each
     *     parameter through the life of a mutator, regardless of param renaming),
     *     e.g. ['piua', 'f8b_', 'oi.o'].
     * @this Blockly.Block
     */
    setProcedureParameters: function(paramNames, paramTypes, paramDist, paramSpec, paramIds) {
        // Data structures:
        // this.arguments = ['x', 'y']
        //     Existing param names.
        // this.quarkConnections_ {piua: null, f8b_: Blockly.Connection}
        //     Look-up of paramIds to connections plugged into the call block.
        // this.quarkArguments_ = ['piua', 'f8b_']
        //     Existing param IDs.
        // Note that quarkConnections_ may include IDs that no longer exist, but
        // which might reappear if a param is reattached in the mutator.
        if (!paramIds) {
            // Reset the quarks (a mutator is about to open).
            this.quarkConnections_ = {};
            this.quarkArguments_ = null;
            return;
        }
        if (paramIds.length != paramNames.length) {
            throw 'Error: paramNames and paramIds must be the same length.';
        }
        if (!this.quarkArguments_) {
            // Initialize tracking for this block.
            this.quarkConnections_ = {};
            if (paramNames.join('\n') == this.arguments_.join('\n')) {
                // No change to the parameters, allow quarkConnections_ to be
                // populated with the existing connections.
                this.quarkArguments_ = paramIds;
            } else {
                this.quarkArguments_ = [];
            }
        }
        // Switch off rendering while the block is rebuilt.
        var savedRendered = this.rendered;
        this.rendered = false;
        // Update the quarkConnections_ with existing connections.
        for (var x = this.arguments_.length - 1; x >= 0; x--) {
            var input = this.getInput('ARG' + x);
            if (input) {
                var connection = input.connection.targetConnection;
                this.quarkConnections_[this.quarkArguments_[x]] = connection;
                // Disconnect all argument blocks and remove all inputs.
                this.removeInput('ARG' + x);
            }
        }
        // Rebuild the block's arguments.
        this.arguments_ = [].concat(paramNames);
        this.types_ = [].concat(paramTypes);
        this.dist_ = [].concat(paramDist);
        this.spec_ = [].concat(paramSpec);
        this.quarkArguments_ = paramIds;
        for (var x = 0; x < this.arguments_.length; x++) {
            var input;
            if(this.dist_[x]=='v'){
                input = this.appendValueInput('ARG' + x)
                    .setAlign(Blockly.ALIGN_RIGHT)
                    .appendField(this.types_[x])
                    .appendField(this.arguments_[x]);
              //  Blockly.Blocks.setCheckVariable(this, this.types_[x], 'ARG'+x);
            }
            else if(this.dist_[x]=='a'){
                if(this.spec_[x][0] ==1){
                    input = this.appendValueInput('ARG' + x)
                        .setAlign(Blockly.ALIGN_RIGHT)
                        .appendField(this.types_[x])
                        .appendField(this.arguments_[x]+'[' + this.spec_[x][1] + ']');
                    console.log('types_[x]: '+ this.types_[x]);
                //    Blockly.Blocks.setCheckVariable(this, this.types_[x], 'ARG'+x);
                }
                else if(this.spec_[x][0] ==2){
                    input = this.appendValueInput('ARG' + x)
                        .setAlign(Blockly.ALIGN_RIGHT)
                        .appendField(this.types_[x])
                        .appendField(this.arguments_[x]+'[' + this.spec_[x][1] + ']'+'[' + this.spec_[x][2] + ']');
                //    Blockly.Blocks.setCheckVariable(this, this.types_[x], 'ARG'+x);
                }
                else if(this.spec_[x][0] ==3){
                    input = this.appendValueInput('ARG' + x)
                        .setAlign(Blockly.ALIGN_RIGHT)
                        .appendField(this.types_[x])
                        .appendField(this.arguments_[x]+'[' + this.spec_[x][1] + ']'+'[' + this.spec_[x][2] + ']'+'[' + this.spec_[x][3] + ']');
                //    Blockly.Blocks.setCheckVariable(this, this.types_[x], 'ARG'+x);
                }
            }
            else if(this.dist_[x]=='p'){
                input = this.appendValueInput('ARG' + x)
                    .setAlign(Blockly.ALIGN_RIGHT)
                    .appendField(this.types_[x] + this.spec_[x])
                    .appendField(this.arguments_[x]);
             //   Blockly.Blocks.setCheckPointer(this, this.types_[x], 'ARG'+x);
            }

            if (this.quarkArguments_) {
                // Reconnect any child blocks.
                var quarkName = this.quarkArguments_[x];
                if (quarkName in this.quarkConnections_) {
                    var connection = this.quarkConnections_[quarkName];
                    if (!connection || connection.targetConnection ||
                        connection.sourceBlock_.workspace != this.workspace) {
                        // Block no longer exists or has been attached elsewhere.
                        delete this.quarkConnections_[quarkName];
                    } else {
                        input.connection.connect(connection);
                    }
                }
            }
        }
        // Add 'with:' if there are parameters.
        this.getField_('WITH').setVisible(!!this.arguments_.length);
        // Restore rendering and show the changes.
        this.rendered = savedRendered;
        if (this.rendered) {
            this.render();
        }
    },
    /**
     * Create XML to represent the (non-editable) name and arguments.
     * @return {Element} XML storage element.
     * @this Blockly.Block
     */
    mutationToDom: function() {
        var container = document.createElement('mutation');
        container.setAttribute('name', this.getProcedureCall());
        for (var x = 0; x < this.arguments_.length; x++) {
            var parameter = document.createElement('arg');
            parameter.setAttribute('name', this.arguments_[x]);
            parameter.setAttribute('types', this.types_[x]);
            parameter.setAttribute('dist', this.dist_[x]);
            if(this.dist_[x]=='a'){
                if(this.spec_[x][0] == 1){
                    parameter.setAttribute('length_1', this.spec_[x][1]);
                }
                else if(this.spec_[x][0] == 2){
                    parameter.setAttribute('length_1', this.spec_[x][1]);
                    parameter.setAttribute('length_2', this.spec_[x][2]);
                }
                else if(this.spec_[x][0] == 3){
                    parameter.setAttribute('length_1', this.spec_[x][1]);
                    parameter.setAttribute('length_2', this.spec_[x][2]);
                    parameter.setAttribute('length_3', this.spec_[x][3]);
                }
            }
            else if(this.dist_[x]=='p'){
                parameter.setAttribute('iteration', this.spec_[x]);
            }
            container.appendChild(parameter);
        }
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
        var def = Blockly.Procedures.getDefinition(name, this.workspace);
        if (def && def.mutator.isVisible()) {
            // Initialize caller with the mutator's IDs.
            this.setProcedureParameters(def.arguments_, def.types_, def.dist_, def.spec_, def.paramIds_);
        } else {
            this.arguments_ = [];
            this.types_ = [];
            this.dist_ = [];
            this.spec_ = [];
            for (var x = 0, childNode; childNode = xmlElement.childNodes[x]; x++) {
                if (childNode.nodeName.toLowerCase() == 'arg') {
                    this.arguments_.push(childNode.getAttribute('name'));
                    this.types_.push(childNode.getAttribute('types'));
                    this.dist_.push(childNode.getAttribute('dist'));
                    if(childNode.getAttribute('dist')=='v'){
                        this.spec_.push(null);
                    }
                    else if(childNode.getAttribute('dist')=='a'){
                        var length_1 = childNode.getAttribute('LENGTH_1');
                        var length_2 = childNode.getAttribute('LENGTH_2');
                        var length_3 = childNode.getAttribute('LENGTH_3');
                        length_1 = length_1 * 1;
                        length_2 = length_2 * 1;
                        length_3 = length_3 * 1;

                        if (length_1 != 0 && length_2 == 0 && length_3 == 0)
                            this.spec_.push([1, length_1]);
                        else if (length_1 != 0 && length_2 != 0 && length_3 == 0)
                            this.spec_.push([2, length_1, length_2]);
                        else if (length_1 != 0 && length_2 != 0 && length_3 != 0)
                            this.spec_.push([3, length_1, length_2, length_3]);
                    }
                    else if(childNode.getAttribute('dist')=='p'){
                        this.spec_.push(childNode.getAttribute('iteration'));
                    }
                }
            }
            // For the second argument (paramIds) use the arguments list as a dummy
            // list.
            this.setProcedureParameters(this.arguments_, this.types_, this.dist_, this.spec_, this.arguments_);
        }
    },
    /**
     * Notification that a variable is renaming.
     * If the name matches one of this block's variables, rename it.
     * @param {string} oldName Previous name of variable.
     * @param {string} newName Renamed variable.
     * @this Blockly.Block
     */
    renameVar: function(oldName, newName) {
        for (var x = 0; x < this.arguments_.length; x++) {
            if (Blockly.Names.equals(oldName, this.arguments_[x])) {
                this.arguments_[x] = newName;
                this.getInput('ARG' + x).fieldRow[0].setText(newName);
            }
        }
    },
    /**
     * Add menu option to find the definition block for this call.
     * @param {!Array} options List of menu options to add to.
     * @this Blockly.Block
     */
    customContextMenu: function(options) {
        var option = {
            enabled: true
        };
        option.text = Blockly.Msg.PROCEDURES_HIGHLIGHT_DEF;
        var name = this.getProcedureCall();
        var workspace = this.workspace;
        option.callback = function() {
            var def = Blockly.Procedures.getDefinition(name, workspace);
            def && def.select();
        };
        options.push(option);
    }
};

Blockly.Blocks['procedures_callreturn'] = {
    /**
     * Block for calling a procedure with a return value.
     * @this Blockly.Block
     */
    init: function() {
        this.setColour(300);
        this.appendDummyInput()
            .appendField(Blockly.Msg.PROCEDURES_CALLRETURN_CALL)
            .appendField('', 'NAME')
            .appendField(Blockly.Msg.PROCEDURES_CALL_BEFORE_PARAMS, 'WITH');
        this.setOutput(true);
        // Tooltip is set in domToMutation.
        this.arguments_ = [];
        this.types_ = [];
        this.dist_ = [];
        this.spec_ = [];
        this.quarkConnections_ = null;
        this.quarkArguments_ = null;
    },
    getProcedureCall: Blockly.Blocks['procedures_callnoreturn'].getProcedureCall,
    renameProcedure: Blockly.Blocks['procedures_callnoreturn'].renameProcedure,
    setProcedureParameters: Blockly.Blocks['procedures_callnoreturn'].setProcedureParameters,
    mutationToDom: Blockly.Blocks['procedures_callnoreturn'].mutationToDom,
    domToMutation: Blockly.Blocks['procedures_callnoreturn'].domToMutation,
    renameVar: Blockly.Blocks['procedures_callnoreturn'].renameVar,
    customContextMenu: Blockly.Blocks['procedures_callnoreturn'].customContextMenu,

    onchange: function(){
        var tuple = Blockly.Procedures.allProcedures();
        var procedureList = tuple[1];
        var curProcedure;
        var name = this.getFieldValue('NAME');
        for (var x = 0; x < procedureList.length; x++) {
            if(name == procedureList[x][1]){
                curProcedure = procedureList[x];
                break;
            }
        }
        if(curProcedure) {
            var output;
            if (curProcedure[2] == 'int') {
                output = 'INT';
            }
            else if (curProcedure[2] == 'unsigned int') {
                output = 'UNINT';
            }
            else if (curProcedure[2] == 'float') {
                output = 'FLOAT';
            }
            else if (curProcedure[2] == 'double') {
                output = 'DOUBLE';
            }
            else if (curProcedure[2] == 'char') {
                output = 'CHAR';
            }

            if (curProcedure[7] == 'variable') {
                output = 'VAR_' + output;
            }
            else if (curProcedure[7] == 'pointer') {
                if (curProcedure[8] == '*') {
                    output = 'PTR_' + output;
                }
                else if (curProcedure[8] == '**') {
                    output = 'DBPTR_' + output;
                }
            }
            else if (curProcedure[7] == 'array') {
                var exOutput = output;
                output = ['VAR_' + exOutput, 'PTR_' + exOutput, 'DBPTR_' + exOutput];
            }
            this.changeOutput(output);
        }
    }
};