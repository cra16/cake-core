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
 * @fileoverview Math blocks for Blockly.Cake.
 * @author q.neutron@gmail.com (Quynh Neutron)
 */
'use strict';

goog.provide('Blockly.Cake.Blocks.math');

goog.require('Blockly.Cake.Blocks');


Blockly.Cake.Blocks['math_number'] = {
  /**
   * Block for numeric value.
   * @this Blockly.Cake.Block
   */
  init: function() {
    this.setColour(240);
    this.appendDummyInput()
        .appendField(new Blockly.Cake.FieldTextInput('0',
        Blockly.Cake.FieldTextInput.numberValidator), 'NUM');
    this.setOutput(true, 'Number');
    this.setTooltip(Blockly.Cake.Msg.MATH_NUMBER_TOOLTIP);
      this.tag = Blockly.Cake.Msg.TAG_MATH_NUMBER;
  },
  //when the block is changed, setOutput
  // negative number (n<0) : NEGATIVE
  // positivie number
  onchange: function() {
      Blockly.Cake.Blocks.requireInFunction();

      var num = this.getFieldValue('NUM');
      if (num == 0) {
          this.changeOutput('Number');
      }
      else if (num % 1 === 0 || num.match(/-/)) {
          if (num > 0) {
              this.changeOutput('INT');
          }
          else {
              this.changeOutput('NEGATIVE');
          }
      }
      else {
          this.changeOutput('DOUBLE');
      }
  }
};

Blockly.Cake.Blocks['math_arithmetic'] = {
  /**
   * Block for basic arithmetic operator.
   * @this Blockly.Cake.Block
   */
  init: function() {
    var OPERATORS =
        [[Blockly.Cake.Msg.MATH_ADDITION_SYMBOL, 'ADD'],
         [Blockly.Cake.Msg.MATH_SUBTRACTION_SYMBOL, 'MINUS'],
         [Blockly.Cake.Msg.MATH_MULTIPLICATION_SYMBOL, 'MULTIPLY'],
         [Blockly.Cake.Msg.MATH_DIVISION_SYMBOL, 'DIVIDE']];
    this.setColour(240);
    this.setOutput(true, 'Number');
    this.appendValueInput('A')
        .setCheck(['Number', 'INT', 'NEGATIVE', 'Variable', 'VAR_INT', 'VAR_UNINT', 'DOUBLE', 'VAR_FLOAT', 'VAR_DOUBLE', 'Aster']);
    this.appendValueInput('B')
        .setCheck(['Number', 'INT', 'NEGATIVE', 'Variable', 'VAR_INT', 'VAR_UNINT', 'DOUBLE', 'VAR_FLOAT', 'VAR_DOUBLE', 'Aster'])
        .appendField(new Blockly.Cake.FieldDropdown(OPERATORS), 'OP');
    this.setInputsInline(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
      this.tag = Blockly.Cake.Msg.TAG_MATH_ARITHMETIC;
    this.setTooltip(function() {
      var mode = thisBlock.getFieldValue('OP');
      var TOOLTIPS = {
        'ADD': Blockly.Cake.Msg.MATH_ARITHMETIC_TOOLTIP_ADD,
        'MINUS': Blockly.Cake.Msg.MATH_ARITHMETIC_TOOLTIP_MINUS,
        'MULTIPLY': Blockly.Cake.Msg.MATH_ARITHMETIC_TOOLTIP_MULTIPLY,
        'DIVIDE': Blockly.Cake.Msg.MATH_ARITHMETIC_TOOLTIP_DIVIDE
      };
      return TOOLTIPS[mode];
    });
  },
  //when the block is changed, 
  onchange: Blockly.Cake.Blocks.requireInFunction
};

Blockly.Cake.Blocks['math_modulo'] = {
  /**
   * Block for remainder of a division.
   * @this Blockly.Cake.Block
   */
  init: function() {
    this.setColour(240);
    this.setOutput(true, 'Number');
    this.interpolateMsg(Blockly.Cake.Msg.MATH_MODULO_TITLE,
                        ['DIVIDEND', ['Number', 'INT', 'NEGATIVE', 'Variable', 'VAR_INT', 'VAR_UNINT', 'DOUBLE', 'VAR_DOUBLE', 'VAR_FLOAT', 'Aster'], Blockly.Cake.ALIGN_RIGHT],
                        ['DIVISOR', ['Number', 'INT', 'NEGATIVE', 'Variable', 'VAR_INT', 'VAR_UNINT', 'DOUBLE', 'VAR_DOUBLE', 'VAR_FLOAT', 'Aster'], Blockly.Cake.ALIGN_RIGHT],
                        Blockly.Cake.ALIGN_RIGHT);
    this.setInputsInline(true);
    this.setTooltip(Blockly.Cake.Msg.MATH_MODULO_TOOLTIP);
      this.tag = Blockly.Cake.Msg.TAG_MATH_MODULO;
  },
  //when the block is changed, 
  onchange: Blockly.Cake.Blocks.requireInFunction
};

//Down from here, #include math.h 관련 block

Blockly.Cake.Blocks['library_math_abs'] = {
    init: function() {
        this.setColour(320);
        this.setOutput(true, 'Number');
        this.interpolateMsg(Blockly.Cake.Msg.MATH_ABS_TITLE,
            ['VAR', ['Number', 'INT', 'NEGATIVE', 'Variable', 'VAR_INT', 'VAR_UNINT', 'DOUBLE', 'VAR_DOUBLE', 'VAR_FLOAT', 'Aster'], Blockly.Cake.ALIGN_RIGHT],
            Blockly.Cake.ALIGN_RIGHT);
        this.setInputsInline(true);
        this.setTooltip(Blockly.Cake.Msg.MATH_SINGLE_TOOLTIP_ABS);
        this.tag = Blockly.Cake.Msg.TAG_MATH_ABS;
    },
    //when the block is changed,
    onchange: Blockly.Cake.Blocks.requireInFunction
};

Blockly.Cake.Blocks['library_math_trig'] = {
    /**
     * Block for trigonometry operators.
     * @this Blockly.Cake.Block
     */
    init: function() {
        var OPERATORS =
            [[Blockly.Cake.Msg.MATH_TRIG_SIN, 'SIN'],
                [Blockly.Cake.Msg.MATH_TRIG_COS, 'COS'],
                [Blockly.Cake.Msg.MATH_TRIG_TAN, 'TAN']];
        this.setColour(320);
        this.setOutput(true, 'Number');
        this.appendValueInput('NUM')
            .setCheck(['Number', 'INT', 'NEGATIVE', 'Variable', 'VAR_INT', 'VAR_UNINT', 'DOUBLE', 'VAR_DOUBLE', 'VAR_FLOAT', 'Aster'])
            .appendField(new Blockly.Cake.FieldDropdown(OPERATORS), 'OP');
        // Assign 'this' to a variable for use in the tooltip closure below.
        var thisBlock = this;
        this.setTooltip(function() {
            var mode = thisBlock.getFieldValue('OP');
            var TOOLTIPS = {
                'SIN': Blockly.Cake.Msg.MATH_TRIG_TOOLTIP_SIN,
                'COS': Blockly.Cake.Msg.MATH_TRIG_TOOLTIP_COS,
                'TAN': Blockly.Cake.Msg.MATH_TRIG_TOOLTIP_TAN
            };
            return TOOLTIPS[mode];
        });
        this.tag = Blockly.Cake.Msg.TAG_MATH_TRIG;
    },
    //when the block is changed,
    onchange: Blockly.Cake.Blocks.requireInFunction
};

Blockly.Cake.Blocks['library_math_logs'] = {
    /**
     * Block for advanced math operators with single operand.
     * @this Blockly.Cake.Block
     */
    init: function() {
        var OPERATORS =
            [[Blockly.Cake.Msg.MATH_TRIG_LOG, 'LOG'],
                [Blockly.Cake.Msg.MATH_TRIG_LOG10, 'LOG10'],
                [Blockly.Cake.Msg.MATH_TRIG_LOG2, 'LOG2']];
        this.setColour(320);
        this.setOutput(true, 'Number');
        this.appendValueInput('NUM')
            .setCheck(['Number', 'INT', 'NEGATIVE', 'Variable', 'VAR_INT', 'VAR_UNINT', 'DOUBLE', 'VAR_DOUBLE', 'VAR_FLOAT', 'Aster'])
            .appendField(new Blockly.Cake.FieldDropdown(OPERATORS), 'OP');
        // Assign 'this' to a variable for use in the tooltip closure below.
        var thisBlock = this;
        this.setTooltip(function() {
            var mode = thisBlock.getFieldValue('OP');
            var TOOLTIPS = {
                'LOG': Blockly.Cake.Msg.MATH_SINGLE_TOOLTIP_LOG,
                'LOG10': Blockly.Cake.Msg.MATH_SINGLE_TOOLTIP_LOG10,
                'LOG2': Blockly.Cake.Msg.MATH_SINGLE_TOOLTIP_LOG2
            };
            return TOOLTIPS[mode];
        });
        this.tag = Blockly.Cake.Msg.TAG_MATH_LOGS;
    },
    //when the block is changed,
    onchange: Blockly.Cake.Blocks.requireInFunction
};

Blockly.Cake.Blocks['library_math_pow'] = {
    init: function() {
        this.setColour(320);
        this.setOutput(true, 'Number');
        this.interpolateMsg(Blockly.Cake.Msg.MATH_POW_TITLE,
            ['BASE', ['Number', 'INT', 'NEGATIVE', 'Variable', 'VAR_INT', 'VAR_UNINT', 'DOUBLE', 'VAR_DOUBLE', 'VAR_FLOAT', 'Aster'], Blockly.Cake.ALIGN_RIGHT],
            ['EXPO', ['Number', 'INT', 'NEGATIVE', 'Variable', 'VAR_INT', 'VAR_UNINT', 'DOUBLE', 'VAR_DOUBLE', 'VAR_FLOAT', 'Aster'], Blockly.Cake.ALIGN_RIGHT],
            Blockly.Cake.ALIGN_RIGHT);
        this.setInputsInline(true);
        this.setTooltip(Blockly.Cake.Msg.MATH_SINGLE_TOOLTIP_POW);
        this.tag = Blockly.Cake.Msg.TAG_MATH_POW;
    },
    //when the block is changed,
    onchange: Blockly.Cake.Blocks.requireInFunction
};

Blockly.Cake.Blocks['library_math_exp'] = {
    init: function() {
        this.setColour(320);
        this.setOutput(true, 'Number');
        this.interpolateMsg(Blockly.Cake.Msg.MATH_EXP_TITLE,
            ['EXPO', ['Number', 'INT', 'NEGATIVE', 'Variable', 'VAR_INT', 'VAR_UNINT', 'DOUBLE', 'VAR_DOUBLE', 'VAR_FLOAT', 'Aster'], Blockly.Cake.ALIGN_RIGHT],
            Blockly.Cake.ALIGN_RIGHT);
        this.setInputsInline(true);
        this.setTooltip(Blockly.Cake.Msg.MATH_SINGLE_TOOLTIP_EXP);
        this.tag = Blockly.Cake.Msg.TAG_MATH_EXP;
    },
    //when the block is changed,
    onchange: Blockly.Cake.Blocks.requireInFunction
};

Blockly.Cake.Blocks['library_math_sqrt'] = {
    init: function() {
        this.setColour(320);
        this.setOutput(true, 'Number');
        this.interpolateMsg(Blockly.Cake.Msg.MATH_SQRT_TITLE,
            ['VAR', ['Number', 'INT', 'NEGATIVE', 'Variable', 'VAR_INT', 'VAR_UNINT', 'DOUBLE', 'VAR_DOUBLE', 'VAR_FLOAT', 'Aster'], Blockly.Cake.ALIGN_RIGHT],
            Blockly.Cake.ALIGN_RIGHT);
        this.setInputsInline(true);
        this.setTooltip(Blockly.Cake.Msg.MATH_SINGLE_TOOLTIP_ROOT);
        this.tag = Blockly.Cake.Msg.TAG_MATH_SQRT;
    },
    //when the block is changed,
    onchange: Blockly.Cake.Blocks.requireInFunction
};

Blockly.Cake.Blocks['library_math_round'] = {
    /**
     * Block for rounding functions.
     * @this Blockly.Cake.Block
     */
    init: function() {
        var OPERATORS =
            [[Blockly.Cake.Msg.MATH_ROUND_OPERATOR_ROUND, 'ROUND'],
                [Blockly.Cake.Msg.MATH_ROUND_OPERATOR_CEIL, 'CEIL'],
                [Blockly.Cake.Msg.MATH_ROUND_OPERATOR_FLOOR, 'FLOOR'],
                [Blockly.Cake.Msg.MATH_ROUND_OPERATOR_TRUNC, 'TRUNC']];
        this.setColour(320);
        this.setOutput(true, 'Number');
        this.appendValueInput('NUM')
            .setCheck(['Number', 'INT', 'NEGATIVE', 'Variable', 'VAR_INT', 'VAR_UNINT', 'DOUBLE', 'VAR_DOUBLE', 'VAR_FLOAT', 'Aster'])
            .appendField(new Blockly.Cake.FieldDropdown(OPERATORS), 'OP');
        this.setTooltip(Blockly.Cake.Msg.MATH_ROUND_TOOLTIP);
        this.tag = Blockly.Cake.Msg.TAG_MATH_ROUND;
    },
    //when the block is changed,
    onchange: Blockly.Cake.Blocks.requireInFunction
};

Blockly.Cake.Blocks['library_math_numcheck'] = {
    init: function() {
        var CONDITION =
            [
                [Blockly.Cake.Msg.MATH_NUMCHECK_ISFINITE, 'ISFINITE'],
                [Blockly.Cake.Msg.MATH_NUMCHECK_ISINF, 'ISINF'],
                [Blockly.Cake.Msg.MATH_NUMCHECK_SIGNBIT, 'SIGNBIT'],
                [Blockly.Cake.Msg.MATH_NUMCHECK_ISNAN, 'ISNAN']
            ];
        this.setColour(320);
        this.setOutput(true, 'Boolean');
        this.interpolateMsg(Blockly.Cake.Msg.MATH_NUMCHECK_TITLE,
            ['VAR', ['Number', 'INT', 'NEGATIVE', 'Variable', 'VAR_INT', 'VAR_UNINT', 'DOUBLE', 'VAR_DOUBLE', 'VAR_FLOAT', 'Aster'], Blockly.Cake.ALIGN_RIGHT],
            ['CONDITIONS', new Blockly.Cake.FieldDropdown(CONDITION)],
            Blockly.Cake.ALIGN_RIGHT);
        this.setInputsInline(true);
        this.setTooltip(Blockly.Cake.Msg.MATH_NUMCHECK_TOOLTIP);
        this.tag = Blockly.Cake.Msg.TAG_MATH_NUMCHECK;
    },
    //when the block is changed,
    onchange: Blockly.Cake.Blocks.requireInFunction
};

Blockly.Cake.Blocks['library_math_numcompare'] = {
    init: function() {
        var CONDITION =
            [
                [Blockly.Cake.Msg.MATH_NUMCOMPARE_ISGREATER, 'ISGREATER'],
                [Blockly.Cake.Msg.MATH_NUMCOMPARE_ISLESS, 'ISLESS'],
                [Blockly.Cake.Msg.MATH_NUMCOMPARE_ISGREQ, 'ISGREQ'],
                [Blockly.Cake.Msg.MATH_NUMCOMPARE_ISLEEQ, 'ISLEEQ'],
                [Blockly.Cake.Msg.MATH_NUMCOMPARE_ISLEGR, 'ISLEGR'],
                [Blockly.Cake.Msg.MATH_NUMCOMPARE_ISUNORDER, 'ISUNORDER']
            ];
        this.setColour(320);
        this.setOutput(true, 'Boolean');
        this.interpolateMsg(Blockly.Cake.Msg.MATH_NUMCOMPARE_TITLE,
            ['VAR1', ['Number', 'INT', 'NEGATIVE', 'Variable', 'VAR_INT', 'VAR_UNINT', 'DOUBLE', 'VAR_DOUBLE', 'VAR_FLOAT', 'Aster'], Blockly.Cake.ALIGN_RIGHT],
            ['VAR2', ['Number', 'INT', 'NEGATIVE', 'Variable', 'VAR_INT', 'VAR_UNINT', 'DOUBLE', 'VAR_DOUBLE', 'VAR_FLOAT', 'Aster'], Blockly.Cake.ALIGN_RIGHT],
            ['CONDITIONS', new Blockly.Cake.FieldDropdown(CONDITION)],
            Blockly.Cake.ALIGN_RIGHT);
        this.setInputsInline(true);
        this.setTooltip(Blockly.Cake.Msg.MATH_NUMCOMPARE_TOOLTIP);
        this.tag = Blockly.Cake.Msg.TAG_MATH_NUMCOMPARE;
    },
    //when the block is changed,
    onchange: Blockly.Cake.Blocks.requireInFunction
};