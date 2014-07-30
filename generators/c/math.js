/**
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * http://blockly.googlecode.com/
 * and 2014 Massachusetts Institute of Technology
 * http://zerorobotics.org/
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
 * @fileoverview Generating C++ for math blocks. Modified from the standard Blockly JavaScript generator.
 * @author q.neutron@gmail.com (Quynh Neutron), dininno@mit.edu (Ethan DiNinno)
 */
'use strict';

goog.provide('Blockly.cake.math');

goog.require('Blockly.cake');

Blockly.cake['math_number'] = function(block) {
  // Numeric value.
  var code = block.getFieldValue('NUM');
  //Validate that the input starts with a number. parseFloat will correctly ignore the trailing f on single-precision floats.
  //TODO: better validation to make sure there isn't other crud after the number
  if(isNaN(parseFloat(code))) {
    code = '0';
  }
  return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['math_arithmetic'] = function(block) {
  // Basic arithmetic operators, and power.
  var OPERATORS = {
    ADD: [' + ', Blockly.cake.ORDER_ADDITION],
    MINUS: [' - ', Blockly.cake.ORDER_SUBTRACTION],
    MULTIPLY: [' * ', Blockly.cake.ORDER_MULTIPLICATION],
    DIVIDE: [' / ', Blockly.cake.ORDER_DIVISION],
    POWER: [null, Blockly.cake.ORDER_COMMA]  // Handle power separately.
  };
  var tuple = OPERATORS[block.getFieldValue('OP')];
  var operator = tuple[0];
  var order = tuple[1];
  var argument0 = Blockly.cake.valueToCode(block, 'A', order) || '0';
  var argument1 = Blockly.cake.valueToCode(block, 'B', order) || '0';
  var code;
  // Power requires a special case since it has no operator. The ZR libraries use all single-precision floats. 
  if (!operator) {
    code = 'powf(' + argument0 + ', ' + argument1 + ')';
    return [code, Blockly.cake.ORDER_FUNCTION_CALL];
  }
  code = argument0 + operator + argument1;
  return [code, order];
};

Blockly.cake['math_single'] = function(block) {
  // Math operators with single operand.
  var operator = block.getFieldValue('OP');
  var code;
  var arg;
  if (operator == '-') {
    // Negation is a special case given its different operator precedence.
    arg = Blockly.cake.valueToCode(block, 'NUM',
        Blockly.cake.ORDER_UNARY_NEGATION) || '0';
    if (arg[0] == '-') {
      // --3 is not legal
      arg = ' ' + arg;
    }
    code = '-' + arg;
    return [code, Blockly.cake.ORDER_UNARY_NEGATION];
  }
  arg = Blockly.cake.valueToCode(block, 'NUM',
      Blockly.cake.ORDER_NONE) || '0';
  // All ZR trig functions are single-precision and handled in radians, which makes most of the JS version of this unnecessary
  code = operator + '(' + arg + ')';
  return [code, Blockly.cake.ORDER_FUNCTION_CALL];
};

Blockly.cake['math_constant'] = function(block) {
  return [block.getFieldValue('CONSTANT'), Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['math_change'] = function(block) {
  // Add to a variable in place.
  var argument0 = Blockly.cake.valueToCode(block, 'DELTA',
      Blockly.cake.ORDER_ADDITION) || '0';
  var varName = Blockly.cake.valueToCode(block, 'VAR',
      Blockly.cake.ORDER_ADDITION) || '0';
  return varName + ' += ' + argument0 + ';\n';
};

// Rounding functions have a single operand.
Blockly.cake['math_round'] = Blockly.cake['math_single'];
// Trigonometry functions have a single operand.
Blockly.cake['math_trig'] = Blockly.cake['math_single'];


Blockly.cake['math_modulo'] = function(block) {
  // Remainder computation.
  var argument0 = Blockly.cake.valueToCode(block, 'DIVIDEND',
      Blockly.cake.ORDER_MODULUS) || '0';
  var argument1 = Blockly.cake.valueToCode(block, 'DIVISOR',
      Blockly.cake.ORDER_MODULUS) || '0';
  var code = argument0 + ' % ' + argument1;
  return [code, Blockly.cake.ORDER_MODULUS];
};
