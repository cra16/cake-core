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
 * @fileoverview Generating cake for logic blocks.
 * @author q.neutron@gmail.com (Quynh Neutron)
 */
'use strict';

goog.provide('Blockly.cake.logic');

goog.require('Blockly.cake');


Blockly.cake['controls_if'] = function(block) {
  // If/elseif/else condition.
  var n = 0;
  var argument = Blockly.cake.valueToCode(block, 'IF' + n,
    Blockly.cake.ORDER_NONE) || '0';
  var branch = Blockly.cake.statementToCode(block, 'DO' + n);
  var code = 'if (' + argument + ') {\n' + branch + '}';
  for (n = 1; n <= block.elseifCount_; n++) {
    argument = Blockly.cake.valueToCode(block, 'IF' + n,
      Blockly.cake.ORDER_NONE) || '0';
    branch = Blockly.cake.statementToCode(block, 'DO' + n);
    code += ' else if (' + argument + ') {\n' + branch + '}';
  }
  if (block.elseCount_) {
    branch = Blockly.cake.statementToCode(block, 'ELSE');
    code += ' else {\n' + branch + '}';
  }
  return code + '\n';
};

Blockly.cake['logic_compare'] = function(block) {
  // Comparison operator.
  var OPERATORS = {
    'EQ': '==',
    'NEQ': '!=',
    'LT': '<',
    'LTE': '<=',
    'GT': '>',
    'GTE': '>='
  };
  var operator = OPERATORS[block.getFieldValue('OP')];
  var order = (operator == '==' || operator == '!=') ?
    Blockly.cake.ORDER_EQUALITY : Blockly.cake.ORDER_RELATIONAL;
  var argument0 = Blockly.cake.valueToCode(block, 'A', order) || '0';
  var argument1 = Blockly.cake.valueToCode(block, 'B', order) || '0';
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

Blockly.cake['logic_operation'] = function(block) {
  // Operations 'and', 'or'.
  var operator = (block.getFieldValue('OP') == 'AND') ? '&&' : '||';
  var order = (operator == '&&') ? Blockly.cake.ORDER_LOGICAL_AND :
    Blockly.cake.ORDER_LOGICAL_OR;
  var argument0 = Blockly.cake.valueToCode(block, 'A', order);
  var argument1 = Blockly.cake.valueToCode(block, 'B', order);
  if (!argument0 && !argument1) {
    // If there are no arguments, then the return value is false.
    argument0 = '0';
    argument1 = '0';
  } else {
    // Single missing arguments have no effect on the return value.
    var defaultArgument = (operator == '&&') ? '1' : '0';
    if (!argument0) {
      argument0 = defaultArgument;
    }
    if (!argument1) {
      argument1 = defaultArgument;
    }
  }
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

Blockly.cake['logic_negate'] = function(block) {
  // Negation.
  var order = Blockly.cake.ORDER_LOGICAL_NOT;
  var argument0 = Blockly.cake.valueToCode(block, 'BOOL', order) ||
    '1';
  var code = '!' + argument0;
  return [code, order];
};

Blockly.cake['logic_boolean'] = function(block) {
  // Boolean values true and false.
  var code = (block.getFieldValue('BOOL') == 'TRUE') ? '1' : '0';
  return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['logic_null'] = function(block) {
  // Null data type.
  return ['null', Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['logic_ternary'] = function(block) {
  // Ternary operator.
  var value_if = Blockly.cake.valueToCode(block, 'IF',
    Blockly.cake.ORDER_CONDITIONAL) || '0';
  var value_then = Blockly.cake.valueToCode(block, 'THEN',
    Blockly.cake.ORDER_CONDITIONAL) || 'null';
  var value_else = Blockly.cake.valueToCode(block, 'ELSE',
    Blockly.cake.ORDER_CONDITIONAL) || 'null';
  var code = value_if + ' ? ' + value_then + ' : ' + value_else;
  return [code, Blockly.cake.ORDER_CONDITIONAL];
};

Blockly.cake['controls_switch'] = function(block) {
  var n = 0;
  var condition = Blockly.cake.valueToCode(block, 'SWITCH', Blockly.cake.ORDER_NONE) || '0';
  var argument = Blockly.cake.valueToCode(block, 'CASE' + n,
    Blockly.cake.ORDER_NONE) || n;
  var branch = Blockly.cake.statementToCode(block, 'DO' + n);
    var defaultBranch = Blockly.cake.statementToCode(block, 'DEFAULT');
  var code = 'switch (' + condition + ') {\ndefault :\n' + defaultBranch +'\ncase ' + argument + ' : \n'+ branch;
  for (n = 1; n <= block.caseCount_; n++) {
    argument = Blockly.cake.valueToCode(block, 'CASE' + n,
      Blockly.cake.ORDER_NONE) || n;
    branch = Blockly.cake.statementToCode(block, 'DO' + n);
    code += '\ncase ' + argument + ' : ' + '\n' + branch;
  }
  return code + '\n';
};

Blockly.cake['controls_switch_break'] = function(block) {
    return 'break;\n';
}