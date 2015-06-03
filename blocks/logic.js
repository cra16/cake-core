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
 * @fileoverview Logic blocks for Blockly.
 * @author q.neutron@gmail.com (Quynh Neutron)
 */
'use strict';

goog.provide('Blockly.Blocks.logic');

goog.require('Blockly.Blocks');


Blockly.Blocks['controls_if'] = {
  /**
   * Block for if/elseif/else condition.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(200);
    this.appendValueInput('IF0')
      .setCheck(['Number', 'INT', 'NEGATIVE', 'Variable', 'VAR_INT', 'VAR_UNINT', 'DOUBLE', 'VAR_FLOAT', 'VAR_DOUBLE', 'Aster'])
      .appendField(Blockly.Msg.CONTROLS_IF_MSG_IF);
    this.appendStatementInput('DO0')
      .appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setMutator(new Blockly.Mutator(['controls_if_elseif',
      'controls_if_else'
    ]));
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      if (!thisBlock.elseifCount_ && !thisBlock.elseCount_) {
        return Blockly.Msg.CONTROLS_IF_TOOLTIP_1;
      } else if (!thisBlock.elseifCount_ && thisBlock.elseCount_) {
        return Blockly.Msg.CONTROLS_IF_TOOLTIP_2;
      } else if (thisBlock.elseifCount_ && !thisBlock.elseCount_) {
        return Blockly.Msg.CONTROLS_IF_TOOLTIP_3;
      } else if (thisBlock.elseifCount_ && thisBlock.elseCount_) {
        return Blockly.Msg.CONTROLS_IF_TOOLTIP_4;
      }
      return '';
    });
    this.elseifCount_ = 0;
    this.elseCount_ = 0;
      this.tag = Blockly.Msg.TAG_LOGIC_IF;
  },
  /**
   * Create XML to represent the number of else-if and else inputs.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    if (!this.elseifCount_ && !this.elseCount_) {
      return null;
    }
    var container = document.createElement('mutation');
    if (this.elseifCount_) {
      container.setAttribute('elseif', this.elseifCount_);
    }
    if (this.elseCount_) {
      container.setAttribute('else', 1);
    }
    return container;
  },
  /**
   * Parse XML to restore the else-if and else inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    this.elseifCount_ = parseInt(xmlElement.getAttribute('elseif'), 10);
    this.elseCount_ = parseInt(xmlElement.getAttribute('else'), 10);
    for (var x = 1; x <= this.elseifCount_; x++) {
      this.appendValueInput('IF' + x)
          .setCheck(['Number', 'INT', 'NEGATIVE', 'Variable', 'VAR_INT', 'VAR_UNINT', 'DOUBLE', 'VAR_FLOAT', 'VAR_DOUBLE', 'Aster'])
        .appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSEIF);
      this.appendStatementInput('DO' + x)
        .appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
    }
    if (this.elseCount_) {
      this.appendStatementInput('ELSE')
        .appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSE);
    }
  },
  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this Blockly.Block
   */
  decompose: function(workspace) {
    var containerBlock = Blockly.Block.obtain(workspace, 'controls_if_if');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var x = 1; x <= this.elseifCount_; x++) {
      var elseifBlock = Blockly.Block.obtain(workspace, 'controls_if_elseif');
      elseifBlock.initSvg();
      connection.connect(elseifBlock.previousConnection);
      connection = elseifBlock.nextConnection;
    }
    if (this.elseCount_) {
      var elseBlock = Blockly.Block.obtain(workspace, 'controls_if_else');
      elseBlock.initSvg();
      connection.connect(elseBlock.previousConnection);
    }
    return containerBlock;
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  compose: function(containerBlock) {
    // Disconnect the else input blocks and remove the inputs.
    if (this.elseCount_) {
      this.removeInput('ELSE');
    }
    this.elseCount_ = 0;
    // Disconnect all the elseif input blocks and remove the inputs.
    for (var x = this.elseifCount_; x > 0; x--) {
      this.removeInput('IF' + x);
      this.removeInput('DO' + x);
    }
    this.elseifCount_ = 0;
    // Rebuild the block's optional inputs.
    var clauseBlock = containerBlock.getInputTargetBlock('STACK');
    while (clauseBlock) {
      switch (clauseBlock.type) {
        case 'controls_if_elseif':
          this.elseifCount_++;
          var ifInput = this.appendValueInput('IF' + this.elseifCount_)
            .setCheck(['Boolean', 'Number'])
            .appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSEIF);
          var doInput = this.appendStatementInput('DO' + this.elseifCount_);
          doInput.appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
          // Reconnect any child blocks.
          if (clauseBlock.valueConnection_) {
            ifInput.connection.connect(clauseBlock.valueConnection_);
          }
          if (clauseBlock.statementConnection_) {
            doInput.connection.connect(clauseBlock.statementConnection_);
          }
          break;
        case 'controls_if_else':
          this.elseCount_++;
          var elseInput = this.appendStatementInput('ELSE');
          elseInput.appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSE);
          // Reconnect any child blocks.
          if (clauseBlock.statementConnection_) {
            elseInput.connection.connect(clauseBlock.statementConnection_);
          }
          break;
        default:
          throw 'Unknown block type.';
      }
      clauseBlock = clauseBlock.nextConnection &&
        clauseBlock.nextConnection.targetBlock();
    }
  },
  /**
   * Store pointers to any connected child blocks.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  saveConnections: function(containerBlock) {
    var clauseBlock = containerBlock.getInputTargetBlock('STACK');
    var x = 1;
    while (clauseBlock) {
      switch (clauseBlock.type) {
        case 'controls_if_elseif':
          var inputIf = this.getInput('IF' + x);
          var inputDo = this.getInput('DO' + x);
          clauseBlock.valueConnection_ =
            inputIf && inputIf.connection.targetConnection;
          clauseBlock.statementConnection_ =
            inputDo && inputDo.connection.targetConnection;
          x++;
          break;
        case 'controls_if_else':
          var inputDo = this.getInput('ELSE');
          clauseBlock.statementConnection_ =
            inputDo && inputDo.connection.targetConnection;
          break;
        default:
          throw 'Unknown block type.';
      }
      clauseBlock = clauseBlock.nextConnection &&
        clauseBlock.nextConnection.targetBlock();
    }
  },

  //when the block is changed, 
  onchange: Blockly.Blocks.requireInFunction
};

Blockly.Blocks['controls_if_if'] = {
  /**
   * Mutator block for if container.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(200);
    this.appendDummyInput()
      .appendField(Blockly.Msg.CONTROLS_IF_IF_TITLE_IF);
    this.appendStatementInput('STACK');
    this.setTooltip(Blockly.Msg.CONTROLS_IF_IF_TOOLTIP);
    this.contextMenu = false;
  }
};

Blockly.Blocks['controls_if_elseif'] = {
  /**
   * Mutator bolck for else-if condition.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(200);
    this.appendDummyInput()
      .appendField(Blockly.Msg.CONTROLS_IF_ELSEIF_TITLE_ELSEIF);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.CONTROLS_IF_ELSEIF_TOOLTIP);
    this.contextMenu = false;
  }
};

Blockly.Blocks['controls_if_else'] = {
  /**
   * Mutator block for else condition.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(200);
    this.appendDummyInput()
      .appendField(Blockly.Msg.CONTROLS_IF_ELSE_TITLE_ELSE);
    this.setPreviousStatement(true);
    this.setTooltip(Blockly.Msg.CONTROLS_IF_ELSE_TOOLTIP);
    this.contextMenu = false;
  }
};

Blockly.Blocks['logic_compare'] = {
  /**
   * Block for comparison operator.
   * @this Blockly.Block
   */
  init: function() {
    var OPERATORS = Blockly.RTL ? [
      ['=', 'EQ'],
      ['\u2260', 'NEQ'],
      ['>', 'LT'],
      ['\u2265', 'LTE'],
      ['<', 'GT'],
      ['\u2264', 'GTE']
    ] : [
      ['=', 'EQ'],
      ['\u2260', 'NEQ'],
      ['<', 'LT'],
      ['\u2264', 'LTE'],
      ['>', 'GT'],
      ['\u2265', 'GTE']
    ];
    this.setColour(200);
    this.setOutput(true, 'Boolean');
    this.appendValueInput('A');
    this.appendValueInput('B')
      .appendField(new Blockly.FieldDropdown(OPERATORS), 'OP');
    this.setInputsInline(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      var op = thisBlock.getFieldValue('OP');
      var TOOLTIPS = {
        'EQ': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_EQ,
        'NEQ': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_NEQ,
        'LT': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_LT,
        'LTE': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_LTE,
        'GT': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_GT,
        'GTE': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_GTE
      };
      return TOOLTIPS[op];
    });
      this.tag = Blockly.Msg.TAG_LOGIC_COMPARE;
  },
  //when the block is changed, 
  onchange: Blockly.Blocks.requireInFunction
};

Blockly.Blocks['logic_operation'] = {
  /**
   * Block for logical operations: 'and', 'or'.
   * @this Blockly.Block
   */
  init: function() {
    var OPERATORS =
      [
        [Blockly.Msg.LOGIC_OPERATION_AND, 'AND'],
        [Blockly.Msg.LOGIC_OPERATION_OR, 'OR']
      ];
    this.setColour(200);
    this.setOutput(true, 'Boolean');
    this.appendValueInput('A');
//      .setCheck(['Boolean', 'Number']);
    this.appendValueInput('B')
//      .setCheck(['Boolean', 'Number'])
      .appendField(new Blockly.FieldDropdown(OPERATORS), 'OP');
    this.setInputsInline(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      var op = thisBlock.getFieldValue('OP');
      var TOOLTIPS = {
        'AND': Blockly.Msg.LOGIC_OPERATION_TOOLTIP_AND,
        'OR': Blockly.Msg.LOGIC_OPERATION_TOOLTIP_OR
      };
      return TOOLTIPS[op];
    });
      this.tag = Blockly.Msg.TAG_LOGIC_OPERATION;
  },
  //when the block is changed, 
  onchange: Blockly.Blocks.requireInFunction
};

Blockly.Blocks['logic_negate'] = {
  /**
   * Block for negation.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(200);
    this.setOutput(true, 'Boolean');
    this.interpolateMsg(Blockly.Msg.LOGIC_NEGATE_TITLE, ['BOOL', ['Boolean', 'Number', 'NEGATIVE', 'INT'], Blockly.ALIGN_RIGHT],
      Blockly.ALIGN_RIGHT);
    this.setTooltip(Blockly.Msg.LOGIC_NEGATE_TOOLTIP);
      this.tag = Blockly.Msg.TAG_LOGIC_NEGATE;
  },
  //when the block is changed, 
  onchange: Blockly.Blocks.requireInFunction
};

Blockly.Blocks['logic_boolean'] = {
  /**
   * Block for boolean data type: true and false.
   * @this Blockly.Block
   */
  init: function() {
    var BOOLEANS =
      [
        [Blockly.Msg.LOGIC_BOOLEAN_TRUE, 'TRUE'],
        [Blockly.Msg.LOGIC_BOOLEAN_FALSE, 'FALSE']
      ];
    this.setColour(200);
    this.setOutput(true, 'Boolean');
    this.appendDummyInput()
      .appendField(new Blockly.FieldDropdown(BOOLEANS), 'BOOL');
    this.setTooltip(Blockly.Msg.LOGIC_BOOLEAN_TOOLTIP);
      this.tag = Blockly.Msg.TAG_LOGIC_BOOLEAN;
  },
  //when the block is changed, 
  onchange: Blockly.Blocks.requireInFunction
};

Blockly.Blocks['logic_null'] = {
  /**
   * Block for null data type.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(200);
    this.setOutput(true);
    this.appendDummyInput()
      .appendField(Blockly.Msg.LOGIC_NULL);
    this.setTooltip(Blockly.Msg.LOGIC_NULL_TOOLTIP);
      this.tag = Blockly.Msg.TAG_LOGIC_NULL;
  },
  //when the block is changed, 
  onchange: Blockly.Blocks.requireInFunction
};

Blockly.Blocks['logic_ternary'] = {
  /**
   * Block for ternary operator.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(200);
    this.appendValueInput('IF')
          .appendField(Blockly.Msg.LOGIC_TERNARY_CONDITION);
    this.appendValueInput('THEN')
      .appendField(Blockly.Msg.LOGIC_TERNARY_IF_TRUE);
    this.appendValueInput('ELSE')
      .appendField(Blockly.Msg.LOGIC_TERNARY_IF_FALSE);
    this.setOutput(true);
    this.setTooltip(Blockly.Msg.LOGIC_TERNARY_TOOLTIP);
      this.tag = Blockly.Msg.TAG_LOGIC_TERNARY;
  },
  //when the block is changed, 
  onchange: Blockly.Blocks.requireInFunction
};

Blockly.Blocks['controls_switch'] = {
  init: function() {
    this.setColour(200);
    this.appendValueInput('SWITCH')
      .appendField(Blockly.Msg.CONTROLS_SWITCH);
      this.appendDummyInput()
          .appendField(Blockly.Msg.CONTROLS_SWITCH_DEFAULT);
      this.appendStatementInput('DEFAULT')
          .appendField(Blockly.Msg.CONTROLS_SWITCH_DO);
    this.appendValueInput('CASE0')
        .setCheck(['Number', 'INT', 'Variable', 'VAR_INT', 'Aster', 'NEGATIVE', 'DOUBLE'])
    .appendField(Blockly.Msg.CONTROLS_SWITCH_CASE);
    this.appendStatementInput('DO0')
      .appendField(Blockly.Msg.CONTROLS_SWITCH_DO);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setMutator(new Blockly.Mutator(['controls_switch_case']));
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
      this.tag = Blockly.Msg.TAG_LOGIC_SWITCH;
    this.setTooltip(function() {
      if (!thisBlock.caseCount_) {
        return Blockly.Msg.CONTROLS_SWITCH_TOOLTIP1;
      } else if (!thisBlock.caseCount_) {
        return Blockly.Msg.CONTROLS_SWITCH_TOOLTIP2;
      } else if (thisBlock.caseCount_) {
        return Blockly.Msg.CONTROLS_SWITCH_TOOLTIP3;
      } else if (thisBlock.caseCount_) {
        return Blockly.Msg.CONTROLS_SWITCH_TOOLTIP4;
      }
      return '';
    });
    this.caseCount_ = 0;
  },
  /**
   * Create XML to represent the number of else-if and else inputs.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    if (!this.caseCount_) {
      return null;
    }
    var container = document.createElement('mutation');
    if (this.caseCount_) {
      container.setAttribute('case', this.caseCount_);
    }
    return container;
  },
  /**
   * Parse XML to restore the else-if and else inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    this.caseCount_ = parseInt(xmlElement.getAttribute('case'), 10);
    for (var x = 1; x <= this.caseCount_; x++) {
      this.appendValueInput('CASE' + x)
        .setCheck(['Boolean', 'Number', 'INT', 'Variable', 'VAR_INT', 'NEGATIVE', 'DOUBLE'])
        .appendField(Blockly.Msg.CONTROLS_SWITCH_CASE);
      this.appendStatementInput('DO' + x)
        .appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
    }
  },
  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this Blockly.Block
   */
  decompose: function(workspace) {
    var containerBlock = Blockly.Block.obtain(workspace, 'controls_switch_switch');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var x = 1; x <= this.caseCount_; x++) {
      var caseBlock = Blockly.Block.obtain(workspace, 'controls_switch_case');
      caseBlock.initSvg();
      connection.connect(caseBlock.previousConnection);
      connection = caseBlock.nextConnection;
    }
    return containerBlock;
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  compose: function(containerBlock) {
    
    // Disconnect all the elseif input blocks and remove the inputs.
    for (var x = this.caseCount_; x > 0; x--) {
      this.removeInput('CASE' + x);
      this.removeInput('DO' + x);
    }
    this.caseCount_ = 0;
    // Rebuild the block's optional inputs.
    var clauseBlock = containerBlock.getInputTargetBlock('STACK');
    while (clauseBlock) {
      switch (clauseBlock.type) {
        case 'controls_switch_case':
          this.caseCount_++;
          var ifInput = this.appendValueInput('CASE' + this.caseCount_)
            .setCheck('Number', 'INT', 'Variable', 'VAR_INT')
            .appendField(Blockly.Msg.CONTROLS_SWITCH_CASE);
          var doInput = this.appendStatementInput('DO' + this.caseCount_);
          doInput.appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
          // Reconnect any child blocks.
          if (clauseBlock.valueConnection_) {
            ifInput.connection.connect(clauseBlock.valueConnection_);
          }
          if (clauseBlock.statementConnection_) {
            doInput.connection.connect(clauseBlock.statementConnection_);
          }
          break;
        default:
          throw 'Unknown block type.';
      }
      clauseBlock = clauseBlock.nextConnection &&
        clauseBlock.nextConnection.targetBlock();
    }
  },
  /**
   * Store pointers to any connected child blocks.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  saveConnections: function(containerBlock) {
    var clauseBlock = containerBlock.getInputTargetBlock('STACK');
    var x = 1;
    while (clauseBlock) {
      switch (clauseBlock.type) {
        case 'controls_switch_case':
          var inputIf = this.getInput('CASE' + x);
          var inputDo = this.getInput('DO' + x);
          clauseBlock.valueConnection_ =
            inputIf && inputIf.connection.targetConnection;
          clauseBlock.statementConnection_ =
            inputDo && inputDo.connection.targetConnection;
          x++;
          break;
        default:
          throw 'Unknown block type.';
      }
      clauseBlock = clauseBlock.nextConnection &&
        clauseBlock.nextConnection.targetBlock();
    }
  },

  //when the block is changed, 
  onchange: Blockly.Blocks.requireInFunction
};

Blockly.Blocks['controls_switch_switch'] = {
  init: function() {
    this.setColour(200);
    this.appendDummyInput()
      .appendField(Blockly.Msg.CONTROLS_SWITCH_CASE);
    this.appendStatementInput('STACK');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.CONTROLS_SWITCH_CASE_TOOLTIP);
    this.contextMenu = false;
  }
};

Blockly.Blocks['controls_switch_case'] = {
    init: function() {
        this.setColour(200);
        this.appendDummyInput()
            .appendField(Blockly.Msg.CONTROLS_SWITCH_CASE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip(Blockly.Msg.CONTROLS_SWITCH_CASE_TOOLTIP);
        this.contextMenu = false;
    }
};

Blockly.Blocks['controls_switch_break'] = {
    /**
     * Block for break in the switch block.
     * @this Blockly.Block
     */
    init: function() {
        this.setColour(200);
        this.appendDummyInput()
            .appendField(Blockly.Msg.CONTROLS_SWITCH_BREAK);
        this.setPreviousStatement(true);
        // Assign 'this' to a variable for use in the tooltip closure below.
        this.tag = Blockly.Msg.TAG_LOOP_FLOW;
        this.setTooltip(Blockly.Msg.CONTROLS_SWITCH_BREAK_TOOLTIP);
    },
    /**
     * Called whenever anything on the workspace changes.
     * Add warning if this flow block is not nested inside a loop.
     * @this Blockly.Block
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
            if (block.type == 'controls_switch') {
                legal = true;
                break;
            }
            block = block.getSurroundParent();
        } while (block);
        if (legal) {
            this.setWarningText(null);
        } else {
            this.setWarningText(Blockly.Msg.CONTROLS_SWITCH_BREAK_WARNING);
        }
    }
};