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
 * @fileoverview Math blocks for Blockly.
 * @author q.neutron@gmail.com (Quynh Neutron)
 */
'use strict';

goog.provide('Blockly.Blocks.math');

goog.require('Blockly.Blocks');


Blockly.Blocks['math_number'] = {
  /**
   * Block for numeric value.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.MATH_NUMBER_HELPURL);
    this.setColour(230);
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput('0',
        Blockly.FieldTextInput.numberValidator), 'NUM');
    this.setOutput(true, 'Number');
    this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
  },
  //when the block is changed, 
  onchange: Blockly.Blocks.requireInFunction
};

Blockly.Blocks['math_arithmetic'] = {
  /**
   * Block for basic arithmetic operator.
   * @this Blockly.Block
   */
  init: function() {
    var OPERATORS =
        [[Blockly.Msg.MATH_ADDITION_SYMBOL, 'ADD'],
         [Blockly.Msg.MATH_SUBTRACTION_SYMBOL, 'MINUS'],
         [Blockly.Msg.MATH_MULTIPLICATION_SYMBOL, 'MULTIPLY'],
         [Blockly.Msg.MATH_DIVISION_SYMBOL, 'DIVIDE']];
    this.setHelpUrl(Blockly.Msg.MATH_ARITHMETIC_HELPURL);
    this.setColour(230);
    this.setOutput(true, 'Number');
    this.appendValueInput('A')
        .setCheck('Number');
    this.appendValueInput('B')
        .setCheck('Number')
        .appendField(new Blockly.FieldDropdown(OPERATORS), 'OP');
    this.setInputsInline(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      var mode = thisBlock.getFieldValue('OP');
      var TOOLTIPS = {
        'ADD': Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_ADD,
        'MINUS': Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_MINUS,
        'MULTIPLY': Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_MULTIPLY,
        'DIVIDE': Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_DIVIDE
      };
      return TOOLTIPS[mode];
    });
  },
  //when the block is changed, 
  onchange: Blockly.Blocks.requireInFunction
};

Blockly.Blocks['math_modulo'] = {
  /**
   * Block for remainder of a division.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.MATH_MODULO_HELPURL);
    this.setColour(230);
    this.setOutput(true, 'Number');
    this.interpolateMsg(Blockly.Msg.MATH_MODULO_TITLE,
                        ['DIVIDEND', 'Number', Blockly.ALIGN_RIGHT],
                        ['DIVISOR', 'Number', Blockly.ALIGN_RIGHT],
                        Blockly.ALIGN_RIGHT);
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.MATH_MODULO_TOOLTIP);
  },
  //when the block is changed, 
  onchange: Blockly.Blocks.requireInFunction
};

//Down from here, #include math.h 관련 block

Blockly.Blocks['library_math_abs'] = {
    init: function() {
        this.setHelpUrl(Blockly.Msg.TEXT_PRINT_HELPURL);
        this.setColour(300);
        this.setOutput(true, 'Number');
        this.interpolateMsg(Blockly.Msg.MATH_ABS_TITLE,
            ['VAR', null, Blockly.ALIGN_RIGHT],
            Blockly.ALIGN_RIGHT);
        this.setInputsInline(true);
        this.setTooltip(Blockly.Msg.MATH_SINGLE_TOOLTIP_ABS);
    },
    //when the block is changed,
    onchange: Blockly.Blocks.requireInFunction
};

Blockly.Blocks['library_math_trig'] = {
    /**
     * Block for trigonometry operators.
     * @this Blockly.Block
     */
    init: function() {
        var OPERATORS =
            [[Blockly.Msg.MATH_TRIG_SIN, 'SIN'],
                [Blockly.Msg.MATH_TRIG_COS, 'COS'],
                [Blockly.Msg.MATH_TRIG_TAN, 'TAN']];
        this.setHelpUrl(Blockly.Msg.MATH_TRIG_HELPURL);
        this.setColour(300);
        this.setOutput(true, 'Number');
        this.appendValueInput('NUM')
            .setCheck('Number')
            .appendField(new Blockly.FieldDropdown(OPERATORS), 'OP');
        // Assign 'this' to a variable for use in the tooltip closure below.
        var thisBlock = this;
        this.setTooltip(function() {
            var mode = thisBlock.getFieldValue('OP');
            var TOOLTIPS = {
                'SIN': Blockly.Msg.MATH_TRIG_TOOLTIP_SIN,
                'COS': Blockly.Msg.MATH_TRIG_TOOLTIP_COS,
                'TAN': Blockly.Msg.MATH_TRIG_TOOLTIP_TAN
            };
            return TOOLTIPS[mode];
        });
    }
};

Blockly.Blocks['library_math_logs'] = {
    /**
     * Block for advanced math operators with single operand.
     * @this Blockly.Block
     */
    init: function() {
        var OPERATORS =
            [['log', 'LOG'],
                ['log10', 'LOG10'],
                ['log2', 'LOG2']];
        this.setHelpUrl(Blockly.Msg.TEXT_PRINT_HELPURL);
        this.setColour(300);
        this.setOutput(true, 'Number');
        this.appendValueInput('NUM')
            .setCheck('Number')
            .appendField(new Blockly.FieldDropdown(OPERATORS), 'OP');
        // Assign 'this' to a variable for use in the tooltip closure below.
        var thisBlock = this;
        this.setTooltip(function() {
            var mode = thisBlock.getFieldValue('OP');
            var TOOLTIPS = {
                'LOG': Blockly.Msg.MATH_SINGLE_TOOLTIP_LOG,
                'LOG10': Blockly.Msg.MATH_SINGLE_TOOLTIP_LOG10,
                'LOG2': Blockly.Msg.MATH_SINGLE_TOOLTIP_LOG2
            };
            return TOOLTIPS[mode];
        });
    }
};

Blockly.Blocks['library_math_pow'] = {
    init: function() {
        this.setHelpUrl(Blockly.Msg.TEXT_PRINT_HELPURL);
        this.setColour(300);
        this.setOutput(true, 'Number');
        this.interpolateMsg(Blockly.Msg.MATH_POW_TITLE,
            ['BASE', null, Blockly.ALIGN_RIGHT],['EXPO', null, Blockly.ALIGN_RIGHT],
            Blockly.ALIGN_RIGHT);
        this.setInputsInline(true);
        this.setTooltip(Blockly.Msg.MATH_SINGLE_TOOLTIP_POW);
    },
    //when the block is changed,
    onchange: Blockly.Blocks.requireInFunction
};

Blockly.Blocks['library_math_exp'] = {
    init: function() {
        this.setHelpUrl(Blockly.Msg.TEXT_PRINT_HELPURL);
        this.setColour(300);
        this.setOutput(true, 'Number');
        this.interpolateMsg(Blockly.Msg.MATH_EXP_TITLE,
            ['EXPO', null, Blockly.ALIGN_RIGHT],
            Blockly.ALIGN_RIGHT);
        this.setInputsInline(true);
        this.setTooltip(Blockly.Msg.MATH_SINGLE_TOOLTIP_EXP);
    },
    //when the block is changed,
    onchange: Blockly.Blocks.requireInFunction
};

Blockly.Blocks['library_math_sqrt'] = {
    init: function() {
        this.setHelpUrl(Blockly.Msg.TEXT_PRINT_HELPURL);
        this.setColour(300);
        this.setOutput(true, 'Number');
        this.interpolateMsg(Blockly.Msg.MATH_SQRT_TITLE,
            ['VAR', null, Blockly.ALIGN_RIGHT],
            Blockly.ALIGN_RIGHT);
        this.setInputsInline(true);
        this.setTooltip(Blockly.Msg.MATH_SINGLE_TOOLTIP_ROOT);
    },
    //when the block is changed,
    onchange: Blockly.Blocks.requireInFunction
};

Blockly.Blocks['library_math_round'] = {
    /**
     * Block for rounding functions.
     * @this Blockly.Block
     */
    init: function() {
        var OPERATORS =
            [[Blockly.Msg.MATH_ROUND_OPERATOR_ROUND, 'ROUND'],
                [Blockly.Msg.MATH_ROUND_OPERATOR_CEIL, 'CEIL'],
                [Blockly.Msg.MATH_ROUND_OPERATOR_FLOOR, 'FLOOR'],
                [Blockly.Msg.MATH_ROUND_OPERATOR_TRUNC, 'TRUNC']];
        this.setHelpUrl(Blockly.Msg.MATH_ROUND_HELPURL);
        this.setColour(300);
        this.setOutput(true, 'Number');
        this.appendValueInput('NUM')
            .setCheck('Number')
            .appendField(new Blockly.FieldDropdown(OPERATORS), 'OP');
        this.setTooltip(Blockly.Msg.MATH_ROUND_TOOLTIP);
    }
};

Blockly.Blocks['library_math_numcheck'] = {
    init: function() {
        var CONDITION =
            [
                [Blockly.Msg.MATH_NUMCHECK_ISFINITE, 'ISFINITE'],
                [Blockly.Msg.MATH_NUMCHECK_ISINF, 'ISINF'],
                [Blockly.Msg.MATH_NUMCHECK_SIGNBIT, 'SIGNBIT'],
                [Blockly.Msg.MATH_NUMCHECK_ISNAN, 'ISNAN']
            ];
        this.setHelpUrl(Blockly.Msg.TEXT_PRINT_HELPURL);
        this.setColour(300);
        this.setOutput(true, 'Boolean');
        this.interpolateMsg(Blockly.Msg.MATH_NUMCHECK_TITLE,
            ['VAR', null, Blockly.ALIGN_RIGHT],
            ['CONDITIONS', new Blockly.FieldDropdown(CONDITION)],
            Blockly.ALIGN_RIGHT);
        this.setInputsInline(true);
        this.setTooltip(Blockly.Msg.MATH_NUMCHECK_TOOLTIP);
    },
    //when the block is changed,
    onchange: Blockly.Blocks.requireInFunction
};

Blockly.Blocks['library_math_numcompare'] = {
    init: function() {
        var CONDITION =
            [
                [Blockly.Msg.MATH_NUMCOMPARE_ISGREATER, 'ISGREATER'],
                [Blockly.Msg.MATH_NUMCOMPARE_ISLESS, 'ISLESS'],
                [Blockly.Msg.MATH_NUMCOMPARE_ISGREQ, 'ISGREQ'],
                [Blockly.Msg.MATH_NUMCOMPARE_ISLEEQ, 'ISLEEQ'],
                [Blockly.Msg.MATH_NUMCOMPARE_ISLEGR, 'ISLEGR'],
                [Blockly.Msg.MATH_NUMCOMPARE_ISUNORDER, 'ISUNORDER']
            ];
        this.setHelpUrl(Blockly.Msg.TEXT_PRINT_HELPURL);
        this.setColour(300);
        this.setOutput(true, 'Boolean');
        this.interpolateMsg(Blockly.Msg.MATH_NUMCOMPARE_TITLE,
            ['VAR1', null, Blockly.ALIGN_RIGHT],
            ['VAR2', null, Blockly.ALIGN_RIGHT],
            ['CONDITIONS', new Blockly.FieldDropdown(CONDITION)],
            Blockly.ALIGN_RIGHT);
        this.setInputsInline(true);
        this.setTooltip(Blockly.Msg.MATH_NUMCOMPARE_TOOLTIP);
    },
    //when the block is changed,
    onchange: Blockly.Blocks.requireInFunction
};