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


Blockly.Blocks['structure_define'] = {
    init: function() {
        this.setColour(370);
        var name = Blockly.Procedures.findLegalName(
            Blockly.Msg.STRUCTURE_DEFINE_NAME, this);
        this.appendDummyInput()
            .appendField(Blockly.Msg.STRUCTURE_DEFINE_TITLE)
            .appendField(new Blockly.FieldTextInput(name,
                Blockly.Procedures.rename), 'NAME')
            .appendField('', 'PARAMS');
        this.setMutator(new Blockly.Mutator(['structure_mutatormem', 'structure_mutatormem_pointer', 'structure_mutatormem_array']));
        this.setTooltip(Blockly.Msg.STRUCTURE_DEFINE_TOOPTIP);
        this.members_ = [];
        this.types_ = [];
        this.dist_ = [];
        this.spec_ =[];
        this.statementConnection_ = null;
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.tag = Blockly.Msg.TAG_STRUCTURE_DEFINE;
    },
    initName: function() {
        this.setFieldValue('', 'NAME');
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
                if (x == 0) {
                    if(this.dist_[x]=='v'){
                        paramString = paramString + ' ' + this.types_[x] + ' ' + this.members_[x];
                    }
                    else if(this.dist_[x]=='a'){
                        paramString = paramString + ' ' + this.types_[x] + ' '+ this.members_[x] + '[' + this.spec_[x] + ']';
                    }
                    else if(this.dist_[x]=='p'){
                        paramString = paramString + ' ' + this.types_[x] + this.spec_[x] + ' ' + this.members_[x];
                    }
                }
                else {
                    if(this.dist_[x]=='v'){
                        paramString = paramString + ', ' + this.types_[x] + ' ' + this.members_[x];
                    }
                    else if(this.dist_[x]=='a'){
                        paramString = paramString + ', ' + this.types_[x] + ' '+ this.members_[x] + '[' + this.spec_[x] + ']';
                    }
                    else if(this.dist_[x]=='p'){
                        paramString = paramString + ', ' + this.types_[x] + this.spec_[x] + ' ' + this.members_[x];
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
        for (var x = 0; x < this.members_.length; x++) {
            var element = document.createElement('arg');
            element.setAttribute('name', this.members_[x]);
            element.setAttribute('types', this.types_[x]);
            element.setAttribute('dist', this.dist_[x]);
            if(this.dist_[x]=='a'){
                element.setAttribute('length', this.spec_[x]);
            }
            else if(this.dist_[x]=='p'){
                element.setAttribute('iteration', this.spec_[x]);
            }
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
                this.dist_.push(childNode.getAttribute('dist'));
                if(childNode.getAttribute('dist')=='v'){
                    this.spec_.push(null);
                }
                else if(childNode.getAttribute('dist')=='a'){
                    this.spec_.push(childNode.getAttribute('length'));
                }
                else if(childNode.getAttribute('dist')=='p'){
                    this.spec_.push(childNode.getAttribute('iteration'));
                }
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
            var paramBlock;
            if(this.dist_[x]=='v'){
                paramBlock = Blockly.Block.obtain(workspace, 'structure_mutatormem');
                paramBlock.initSvg();
                paramBlock.setFieldValue(this.members_[x], 'NAME');
                paramBlock.setFieldValue(this.types_[x], 'TYPES');
            }
            else if(this.dist_[x]=='a'){
                paramBlock = Blockly.Block.obtain(workspace, 'structure_mutatormem_array');
                paramBlock.initSvg();
                paramBlock.setFieldValue(this.members_[x], 'NAME');
                paramBlock.setFieldValue(this.types_[x], 'TYPES');
                paramBlock.setFieldValue(this.spec_[x], 'LENGTH');
            }
            else if(this.dist_[x]=='p'){
                paramBlock = Blockly.Block.obtain(workspace, 'structure_mutatormem_pointer');
                paramBlock.initSvg();
                paramBlock.setFieldValue(this.members_[x], 'NAME');
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
            this.workspace, this.members_, this.types_, this.dist_, this.spec_, null);
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
        this.dist_ = [];
        this.spec_ = [];
        var paramBlock = containerBlock.getInputTargetBlock('STACK');
        while (paramBlock) {
            this.members_.push(paramBlock.getFieldValue('NAME'));
            this.types_.push(paramBlock.getFieldValue('TYPES'));
            this.dist_.push(paramBlock.getDist());
            if(paramBlock.getDist()=='v'){
                this.spec_.push(paramBlock.getFieldValue());
            }
            else if(paramBlock.getDist()=='a') {
                this.spec_.push(paramBlock.getFieldValue('LENGTH'));
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
            this.workspace, this.members_, this.types_, this.dist_, this.spec_, this.paramIds_);

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
        return ['sd', this.getFieldValue('NAME'), this.types_, this.members_, this.dist_, this.spec_];
    },
    getName: function() {
        return [this.getFieldValue('NAME')];
    },
    callType_: 'procedures_callnoreturn'
};

Blockly.Blocks['structure_declare'] = {
    /**
     * Block for pointer setter.
     * @this Blockly.Block
     */
    init: function() {
        this.setColour(370);
        var name = Blockly.Procedures.findLegalName(
            Blockly.Msg.STRUCTURE_DECLARE_NAME, this);
        this.interpolateMsg(
            // TODO: Combine these messages instead of using concatenation.
            Blockly.Msg.STRUCTURE_DECLARE_TITLE + ' %1 ' +
            Blockly.Msg.STRUCTURE_DECLARE_TALE + ' %2',
            ['TYPES', new Blockly.FieldStructure(Blockly.Msg.SELECT_TYPE, null)],
            ['NAME', new Blockly.FieldTextInput(name, Blockly.Procedures.rename), Blockly.ALIGN_RIGHT],
            Blockly.ALIGN_RIGHT);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip(Blockly.Msg.STRUCTURE_DECLARE_TOOPTIP);
        this.tag = Blockly.Msg.TAG_STRUCTURE_DECLARE;
        // this.contextMenuMsg_ = Blockly.Msg.VARIABLES_SET_CREATE_GET;
        // this.contextMenuType_ = 'variables_pointer_get';
    },
    initName: Blockly.Blocks['structure_define'].initName,
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
    onchange: Blockly.Blocks.variablePlaceCheck
};

Blockly.Blocks['structure_get'] = {
    /**
     * Block for variable getter.
     * @this Blockly.Block
     */
    init: function() {
        this.setColour(370);
        this.appendDummyInput('struct')
            .appendField('', 'NAME')
            .appendField(Blockly.Msg.STRUCTURE_GET_MEMBER)
            .appendField(new Blockly.FieldStructureMember(Blockly.Msg.SELECT_MENU, null, this), 'Mem');
        this.setOutput(true);
        this.setTooltip(Blockly.Msg.STRUCTURE_GET_TOOLTIP);
        this.tag = Blockly.Msg.TAG_STRUCTURE_GET;
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
        this.setColour(370);
        this.appendDummyInput('struct')
            .appendField('', 'NAME')
            .appendField(Blockly.Msg.STRUCTURE_SET_MEMBER)
            .appendField(new Blockly.FieldStructureMember(Blockly.Msg.SELECT_MENU, null, this), 'Mem');
        this.appendValueInput('VALUE');
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip(Blockly.Msg.STRUCTURE_SET_TOOLTIP);
        this.tag = Blockly.Msg.TAG_STRUCTURE_SET;
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
        this.setTooltip(Blockly.Msg.STRUCTURE_MUTATORCONTAINER_TOOLTIP);
        this.contextMenu = false;
    }
};

Blockly.Blocks['structure_mutatormem'] = {
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
        this.setColour(370);
        this.appendDummyInput()
            .appendField(Blockly.Msg.STRUCTURE_MUTATORMEM_VAR)
            .appendField(new Blockly.FieldDropdown(TYPE), 'TYPES')
            .appendField(Blockly.Msg.STRUCTURE_MUTATORARG_NAME)
            .appendField(new Blockly.FieldTextInput('x', this.validator_), 'NAME');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip(Blockly.Msg.STRUCTURE_MUTATORARG_TOOLTIP);
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

Blockly.Blocks['structure_mutatormem_array'] = {
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
        this.setColour(370);
        this.interpolateMsg(
            // TODO: Combine these messages instead of using concatenation.
            Blockly.Msg.STRUCTURE_MUTATORMEM_ARRAY +'%1 ' + Blockly.Msg.VARIABLES_ARRAY_DECLARE_LENGTH + ' %2 ' +
            Blockly.Msg.VARIABLES_DECLARE_NAME + ' %3 ', ['TYPES', new Blockly.FieldDropdown(TYPE)], ['LENGTH', new Blockly.FieldTextInput('1')], ['NAME', new Blockly.FieldTextInput('z', Blockly.Blocks.CNameValidator)],
            Blockly.ALIGN_RIGHT);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip(Blockly.Msg.STRUCTURE_MUTATORARG_TOOLTIP);
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
    getSpec: function(){
        return [this.getFieldValue('LENGTH')];
    }
};

Blockly.Blocks['structure_mutatormem_pointer'] = {
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
        this.setColour(370);
        this.interpolateMsg(
            // TODO: Combine these messages instead of using concatenation.
            Blockly.Msg.STRUCTURE_MUTATORMEM_POINTER+ '%1 ' + Blockly.Msg.VARIABLES_POINTER_DECLARE_ITERATION + ' %2 ' +
            Blockly.Msg.VARIABLES_DECLARE_NAME + ' %3 ', ['TYPES', new Blockly.FieldDropdown(TYPE)], ['ITERATION', new Blockly.FieldDropdown(ITERATION)], ['NAME', new Blockly.FieldTextInput('y', Blockly.Blocks.CNameValidator)],
            Blockly.ALIGN_RIGHT);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip(Blockly.Msg.STRUCTURE_MUTATORARG_TOOLTIP);
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