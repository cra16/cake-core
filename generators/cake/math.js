/**
 * @license
 * Visual Blocks Language
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
 * @fileoverview Generating cake for math blocks.
 * @author q.neutron@gmail.com (Quynh Neutron)
 */
'use strict';

goog.provide('Blockly.cake.math');

goog.require('Blockly.cake');


Blockly.cake['math_number'] = function(block) {
  // Numeric value.
  var code = parseFloat(block.getFieldValue('NUM'));
  return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['math_arithmetic'] = function(block) {
  // Basic arithmetic operators, and power.
  var OPERATORS = {
    'ADD': [' + ', Blockly.cake.ORDER_ADDITION],
    'MINUS': [' - ', Blockly.cake.ORDER_SUBTRACTION],
    'MULTIPLY': [' * ', Blockly.cake.ORDER_MULTIPLICATION],
    'DIVIDE': [' / ', Blockly.cake.ORDER_DIVISION]
  };
  var tuple = OPERATORS[block.getFieldValue('OP')];
  var operator = tuple[0];
  var order = tuple[1];
  var argument0 = Blockly.cake.valueToCode(block, 'A', order) || '0';
  var argument1 = Blockly.cake.valueToCode(block, 'B', order) || '0';
  var code;
  // Power in cake requires a special case since it has no operator.
  //if (!operator) {
  //  code = 'Math.pow(' + argument0 + ', ' + argument1 + ')';
  //  return [code, Blockly.cake.ORDER_FUNCTION_CALL];
  //}
  code = "(" + argument0 + operator + argument1 + ")";
  return [code, order];
};

Blockly.cake['math_modulo'] = function(block) {
  // Remainder computation.
  var argument0 = Blockly.cake.valueToCode(block, 'DIVIDEND',
      Blockly.cake.ORDER_MODULUS) || '0';
  var argument1 = Blockly.cake.valueToCode(block, 'DIVISOR',
      Blockly.cake.ORDER_MODULUS) || '0';
  var code = argument0 + ' % ' + argument1;
  return [code, Blockly.cake.ORDER_MODULUS];
};

Blockly.cake['library_math_abs'] = function(block) {
    // Scan statement.
    var argument0 = Blockly.cake.valueToCode(block, 'VAR',
            Blockly.cake.ORDER_NONE) || '\'\'';
    Blockly.cake.definitions_['include_cake_math'] =
        '#include <math.h>';
    var code = 'abs(' + argument0 + ')';
    return  [code, Blockly.cake.ORDER_NONE];
};

Blockly.cake['library_math_trig'] = function(block) {
    // Math operators with single operand.
    var operator = block.getFieldValue('OP');
    var code;
    var arg = Blockly.cake.valueToCode(block, 'NUM',
            Blockly.cake.ORDER_NONE) || '0';
    // First, handle cases which generate values that don't need parentheses
    // wrapping the code.
    switch (operator) {
        case 'SIN':
            code = 'sin(' + arg + ')';
            break;
        case 'COS':
            code = 'cos(' + arg + ')';
            break;
        case 'TAN':
            code = 'tan(' + arg + ')';
            break;
        default:
            throw 'Unknown math operator: ' + operator;
    }
    Blockly.cake.definitions_['include_cake_math'] =
        '#include <math.h>';
    return [code, Blockly.cake.ORDER_NONE];
};

Blockly.cake['library_math_logs'] = function(block) {
    // Math operators with single operand.
    var operator = block.getFieldValue('OP');
    var code;
    var arg = Blockly.cake.valueToCode(block, 'NUM',
            Blockly.cake.ORDER_NONE) || '0';
    // First, handle cases which generate values that don't need parentheses
    // wrapping the code.
    switch (operator) {
        case 'LOG':
            code = 'log(' + arg + ')';
            break;
        case 'LOG10':
            code = 'log10(' + arg + ')';
            break;
        case 'LOG2':
            code = 'log2(' + arg + ')';
            break;
        default:
            throw 'Unknown math operator: ' + operator;
    }
    Blockly.cake.definitions_['include_cake_math'] =
        '#include <math.h>';
    return [code, Blockly.cake.ORDER_NONE];
};

Blockly.cake['library_math_pow'] = function(block) {
    // Scan statement.
    var argument0 = Blockly.cake.valueToCode(block, 'BASE',
            Blockly.cake.ORDER_NONE) || '\'\'';
    var argument1 = Blockly.cake.valueToCode(block, 'EXPO',
            Blockly.cake.ORDER_NONE) || '\'\'';
    Blockly.cake.definitions_['include_cake_math'] =
        '#include <math.h>';
    var code = 'pow(' + argument0 + ',' + argument1 + ')';
    return  [code, Blockly.cake.ORDER_NONE];
};

Blockly.cake['library_math_exp'] = function(block) {
    // Scan statement.
    var argument0 = Blockly.cake.valueToCode(block, 'EXPO',
            Blockly.cake.ORDER_NONE) || '\'\'';
    Blockly.cake.definitions_['include_cake_math'] =
        '#include <math.h>';
    var code = 'exp(' + argument0 + ')';
    return  [code, Blockly.cake.ORDER_NONE];
};

Blockly.cake['library_math_sqrt'] = function(block) {
    // Scan statement.
    var argument0 = Blockly.cake.valueToCode(block, 'VAR',
            Blockly.cake.ORDER_NONE) || '\'\'';
    Blockly.cake.definitions_['include_cake_math'] =
        '#include <math.h>';
    var code = 'sqrt(' + argument0 + ')';
    return  [code, Blockly.cake.ORDER_NONE];
};

Blockly.cake['library_math_round'] = function(block) {
    // Math operators with single operand.
    var operator = block.getFieldValue('OP');
    var code;
    var arg = Blockly.cake.valueToCode(block, 'NUM',
            Blockly.cake.ORDER_NONE) || '\'\'';
    // First, handle cases which generate values that don't need parentheses
    // wrapping the code.
    switch (operator) {
        case 'ROUND':
            code = 'round(' + arg + ')';
            break;
        case 'CEIL':
            code = 'ceil(' + arg + ')';
            break;
        case 'FLOOR':
            code = 'floor(' + arg + ')';
            break;
        case 'TRUNC':
            code = 'trunc(' + arg + ')';
            break;
        default:
            throw 'Unknown math operator: ' + operator;
    }
    Blockly.cake.definitions_['include_cake_math'] =
        '#include <math.h>';
    return [code, Blockly.cake.ORDER_NONE];
};

Blockly.cake['library_math_numcheck'] = function(block) {
    // Math operators with single operand.
    var operator = block.getFieldValue('CONDITIONS');
    var code;
    var arg = Blockly.cake.valueToCode(block, 'VAR',
            Blockly.cake.ORDER_NONE) || '\'\'';
    // First, handle cases which generate values that don't need parentheses
    // wrapping the code.
    switch (operator) {
        case 'ISFINITE':
            code = 'isfinite(' + arg + ')';
            break;
        case 'ISINF':
            code = 'isinf(' + arg + ')';
            break;
        case 'SIGNBIT':
            code = 'signbit(' + arg + ')';
            break;
        case 'ISNAN':
            code = 'isnan(' + arg + ')';
            break;
        default:
            throw 'Unknown math operator: ' + operator;
    }
    Blockly.cake.definitions_['include_cake_math'] =
        '#include <math.h>';
    return [code, Blockly.cake.ORDER_NONE];
};

Blockly.cake['library_math_numcompare'] = function(block) {
    // Math operators with two operand.
    var operator = block.getFieldValue('CONDITIONS');
    var code;
    var arg1 = Blockly.cake.valueToCode(block, 'VAR1',
            Blockly.cake.ORDER_NONE) || '\'\'';
    var arg2 = Blockly.cake.valueToCode(block, 'VAR2',
            Blockly.cake.ORDER_NONE) || '\'\'';
    // First, handle cases which generate values that don't need parentheses
    // wrapping the code.
    switch (operator) {
        case 'ISGREATER':
            code = 'isgreater(' + arg1 + ',' + arg2 + ')';
            break;
        case 'ISLESS':
            code = 'isless(' + arg1 + ',' + arg2 + ')';
            break;
        case 'ISGREQ':
            code = 'isgreaterequal(' + arg1 + ',' + arg2 + ')';
            break;
        case 'ISLEEQ':
            code = 'islessequal(' + arg1 + ',' + arg2 + ')';
            break;
        case 'ISLEGR':
            code = 'islessgreater(' + arg1 + ',' + arg2 + ')';
            break;
        case 'ISUNORDER':
            code = 'isunordered(' + arg1 + ',' + arg2 + ')';
            break;
        default:
            throw 'Unknown math operator: ' + operator;
    }
    Blockly.cake.definitions_['include_cake_math'] =
        '#include <math.h>';
    return [code, Blockly.cake.ORDER_NONE];
};