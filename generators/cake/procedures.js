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
 * @fileoverview Generating JavaScript for procedure blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.cake.procedures');

goog.require('Blockly.cake');


Blockly.cake['procedures_defreturn'] = function(block) {
  // Define a procedure with a return value.
  var funcName = Blockly.cake.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  var branch = Blockly.cake.statementToCode(block, 'STACK');
  var type = block.getFieldValue('TYPE') || 'void';
  var returnValue = Blockly.cake.valueToCode(block, 'RETURN',
      Blockly.cake.ORDER_NONE) || '';
  if (returnValue) {
    returnValue = '  return ' + returnValue + ';\n';
  }
  var code = type + ' ' + funcName + block.getArgString(true) + ' {\n' +
      branch + returnValue + '}';
  code = Blockly.cake.scrub_(block, code);
  return code;
};

// Defining a procedure without a return value uses the same generator as
// a procedure with a return value.
Blockly.cake['procedures_defnoreturn'] =
    Blockly.cake['procedures_defreturn'];

Blockly.cake['procedures_definit'] = function(block) {
  // Define a procedure with a return value.
  var branch = Blockly.cake.statementToCode(block, 'GLOBALS') + Blockly.cake.statementToCode(block, 'STACK');
  var code = 'void init() {\n' +
      branch + '}';
  code = Blockly.cake.scrub_(block, code);
  return code;
};

Blockly.cake['procedures_defloop'] = function(block) {
  // Define a procedure with a return value.
  var branch = Blockly.cake.statementToCode(block, 'STACK');
  var code = 'void loop() {\n' +
      branch + '}';
  code = Blockly.cake.scrub_(block, code);
  return code;
};

Blockly.cake['procedures_callreturn'] = function(block) {
  // Call a procedure with a return value.
  var funcName = Blockly.cake.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  var args = [];
  for (var x = 0; x < block.arguments_.length; x++) {
    args[x] = Blockly.cake.valueToCode(block, 'ARG' + x,
        Blockly.cake.ORDER_COMMA) || 'null';
  }
  var code = funcName + '(' + args.join(', ') + ')';
  return [code, Blockly.cake.ORDER_FUNCTION_CALL];
};

Blockly.cake['procedures_callnoreturn'] = function(block) {
  // Call a procedure with no return value.
  var funcName = Blockly.cake.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  var args = [];
  for (var x = 0; x < block.arguments_.length; x++) {
    args[x] = Blockly.cake.valueToCode(block, 'ARG' + x,
        Blockly.cake.ORDER_COMMA) || 'null';
  }
  var code = funcName + '(' + args.join(', ') + ');\n';
  return code;
};

Blockly.cake['procedures_ifreturn'] = function(block) {
  // Conditionally return value from a procedure.
  var condition = Blockly.cake.valueToCode(block, 'CONDITION',
      Blockly.cake.ORDER_NONE) || 'false';
  var code = 'if (' + condition + ') {\n';
  if (block.hasReturnValue_) {
    var value = Blockly.cake.valueToCode(block, 'VALUE',
        Blockly.cake.ORDER_NONE) || 'null';
    code += '  return ' + value + ';\n';
  } else {
    code += '  return;\n';
  }
  code += '}\n';
  return code;
};
