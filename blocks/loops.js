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
 * @fileoverview Loop blocks for Blockly.Cake.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Cake.Blocks.loops');

goog.require('Blockly.Cake.Blocks');


Blockly.Cake.Blocks['controls_whileUntil'] = {
  /**
   * Block for 'do while/until' loop.
   * @this Blockly.Cake.Block
   */
  init: function() {
    var OPERATORS =
        [[Blockly.Cake.Msg.CONTROLS_WHILEUNTIL_OPERATOR_WHILE, 'WHILE'],
         [Blockly.Cake.Msg.CONTROLS_WHILEUNTIL_OPERATOR_UNTIL, 'UNTIL']];
    this.setColour(220);
    this.appendValueInput('BOOL')
        .setCheck(['Boolean', 'Number', 'INT', 'VAR_INT'])
        .appendField(new Blockly.Cake.FieldDropdown(OPERATORS), 'MODE');
    this.appendStatementInput('DO')
        .appendField(Blockly.Cake.Msg.CONTROLS_WHILEUNTIL_INPUT_DO);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
      this.tag = Blockly.Cake.Msg.TAG_LOOP_WHILE;
    this.setTooltip(function() {
      var op = thisBlock.getFieldValue('MODE');
      var TOOLTIPS = {
        'WHILE': Blockly.Cake.Msg.CONTROLS_WHILEUNTIL_TOOLTIP_WHILE,
        'UNTIL': Blockly.Cake.Msg.CONTROLS_WHILEUNTIL_TOOLTIP_UNTIL
      };
      return TOOLTIPS[op];
    });
  },
  //when the block is changed, 
  onchange: Blockly.Cake.Blocks.requireInFunction
};

Blockly.Cake.Blocks['controls_doWhile'] = {
    /**
     * Block for 'do while/until' loop.
     * @this Blockly.Cake.Block
     */
    init: function() {
        var OPERATORS =
            [[Blockly.Cake.Msg.CONTROLS_WHILEUNTIL_OPERATOR_WHILE, 'WHILE'],
                [Blockly.Cake.Msg.CONTROLS_WHILEUNTIL_OPERATOR_UNTIL, 'UNTIL']];
        this.setColour(220);
        this.appendStatementInput('DO')
            .appendField(Blockly.Cake.Msg.CONTROLS_WHILEUNTIL_INPUT_DO);
        this.appendValueInput('BOOL')
            .setCheck(['Boolean', 'Number', 'INT', 'VAR_INT'])
            .appendField(new Blockly.Cake.FieldDropdown(OPERATORS), 'MODE');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        // Assign 'this' to a variable for use in the tooltip closure below.
        var thisBlock = this;
        this.tag = Blockly.Cake.Msg.TAG_LOOP_WHILE;
        this.setTooltip(function() {
            var op = thisBlock.getFieldValue('MODE');
            var TOOLTIPS = {
                'WHILE': Blockly.Cake.Msg.CONTROLS_WHILEUNTIL_TOOLTIP_WHILE,
                'UNTIL': Blockly.Cake.Msg.CONTROLS_WHILEUNTIL_TOOLTIP_UNTIL
            };
            return TOOLTIPS[op];
        });
    },
    //when the block is changed,
    onchange: Blockly.Cake.Blocks.requireInFunction
};

Blockly.Cake.Blocks['controls_for'] = {
  /**
   * Block for 'for' loop.
   * @this Blockly.Cake.Block
   */
  init: function() {
    this.setColour(220);
    this.appendDummyInput()
        .appendField(Blockly.Cake.Msg.CONTROLS_FOR_INPUT_WITH)
        .appendField(new Blockly.Cake.FieldVariable(Blockly.Cake.Msg.SELECT_MENU, null, this), 'VAR');
    this.interpolateMsg(Blockly.Cake.Msg.CONTROLS_FOR_INPUT_FROM_TO_BY,
                        ['FROM', ['Number', 'Variable', 'INT', 'NEGATIVE', 'VAR_INT', 'VAR_UNINT'], Blockly.Cake.ALIGN_RIGHT],
                        ['TO', ['Number', 'Variable', 'INT', 'NEGATIVE', 'VAR_INT', 'VAR_UNINT'], Blockly.Cake.ALIGN_RIGHT],
                        ['BY', ['Number', 'Variable', 'INT', 'NEGATIVE', 'VAR_INT', 'VAR_UNINT'], Blockly.Cake.ALIGN_RIGHT],
                        Blockly.Cake.ALIGN_RIGHT);
    this.appendStatementInput('DO')
        .appendField(Blockly.Cake.Msg.CONTROLS_FOR_INPUT_DO);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setInputsInline(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
      this.tag = Blockly.Cake.Msg.TAG_LOOP_FOR;
    this.setTooltip(function() {
      return Blockly.Cake.Msg.CONTROLS_FOR_TOOLTIP.replace('%1',
          thisBlock.getFieldValue('VAR'));
    });
  },
  /**
   * Return all variables referenced by this block.
   * @return {!Array.<string>} List of variable names.
   * @this Blockly.Cake.Block
   */
  getVars: function() {
    return [this.getFieldValue('VAR')];
  },
  /**
   * Notification that a variable is renaming.
   * If the name matches one of this block's variables, rename it.
   * @param {string} oldName Previous name of variable.
   * @param {string} newName Renamed variable.
   * @this Blockly.Cake.Block
   */
  renameVar: function(oldName, newName) {
    if (Blockly.Cake.Names.equals(oldName, this.getFieldValue('VAR'))) {
      this.setFieldValue(newName, 'VAR');
    }
  },
  /**
   * Add menu option to create getter block for loop variable.
   * @param {!Array} options List of menu options to add to.
   * @this Blockly.Cake.Block
   */
  customContextMenu: function(options) {
    if (!this.isCollapsed()) {
      var option = {enabled: true};
      var name = this.getFieldValue('VAR');
      option.text = Blockly.Cake.Msg.VARIABLES_SET_CREATE_GET.replace('%1', name);
      var xmlField = goog.dom.createDom('field', null, name);
      xmlField.setAttribute('name', 'VAR');
      var xmlBlock = goog.dom.createDom('block', null, xmlField);
      xmlBlock.setAttribute('type', 'variables_get');
      option.callback = Blockly.Cake.ContextMenu.callbackFactory(this, xmlBlock);
      options.push(option);
    }
  },

  //when the block is changed, 
  onchange: Blockly.Cake.Blocks.requireInFunction
};

Blockly.Cake.Blocks['controls_flow_statements'] = {
  /**
   * Block for flow statements: continue, break.
   * @this Blockly.Cake.Block
   */
  init: function() {
    var OPERATORS =
        [[Blockly.Cake.Msg.CONTROLS_FLOW_STATEMENTS_OPERATOR_BREAK, 'BREAK'],
         [Blockly.Cake.Msg.CONTROLS_FLOW_STATEMENTS_OPERATOR_CONTINUE, 'CONTINUE']];
    this.setColour(220);
    this.appendDummyInput()
        .appendField(new Blockly.Cake.FieldDropdown(OPERATORS), 'FLOW');
    this.setPreviousStatement(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
      this.tag = Blockly.Cake.Msg.TAG_LOOP_FLOW;
    this.setTooltip(function() {
      var op = thisBlock.getFieldValue('FLOW');
      var TOOLTIPS = {
        'BREAK': Blockly.Cake.Msg.CONTROLS_FLOW_STATEMENTS_TOOLTIP_BREAK,
        'CONTINUE': Blockly.Cake.Msg.CONTROLS_FLOW_STATEMENTS_TOOLTIP_CONTINUE
      };
      return TOOLTIPS[op];
    });
  },
  /**
   * Called whenever anything on the workspace changes.
   * Add warning if this flow block is not nested inside a loop.
   * @this Blockly.Cake.Block
   */
  onchange: function() {
    if (!this.workspace) {
      // Block has been deleted.
      return;
    }
    var legal = false;
    // Is the block nested in a control statement?
    var block = this;
    do {
      if (block.type == 'controls_for' ||
          block.type == 'controls_whileUntil') {
        legal = true;
        break;
      }
      block = block.getSurroundParent();
    } while (block);
    if (legal) {
      this.setWarningText(null);
    } else {
      this.setWarningText(Blockly.Cake.Msg.CONTROLS_FLOW_STATEMENTS_WARNING);
    }
  }
};
