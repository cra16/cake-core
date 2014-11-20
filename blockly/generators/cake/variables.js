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
 * @fileoverview Generating cake for variable blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.cake.variables');

goog.require('Blockly.cake');

Blockly.cake['define_get'] = function(block) {
  // Variable getter.
  var code = Blockly.cake.variableDB_.getName(block.getFieldValue('VAR'),
      Blockly.Variables.NAME_TYPE);
  return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['define_declare'] = function(block) {
  // Variable declare.
  var argument0 = Blockly.cake.valueToCode(block, 'VALUE',
      Blockly.cake.ORDER_ASSIGNMENT) || '0';
  var varName = Blockly.cake.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var define = '#define';
  return define + ' ' + varName + ' ' + argument0 + '\n';
};

Blockly.cake['text'] = function(block) {
  // Text value.
  var code = Blockly.cake.quote_(block.getFieldValue('TEXT'));
  return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['variables_get'] = function(block) {
  // Variable getter.
  var code = Blockly.cake.variableDB_.getName(block.getFieldValue('VAR'),
      Blockly.Variables.NAME_TYPE);
  return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['variables_set'] = function(block) {
  // Variable setter.
  var argument0 = Blockly.cake.valueToCode(block, 'VALUE',
      Blockly.cake.ORDER_ASSIGNMENT) || '0';
  var varName = Blockly.cake.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  return varName + ' = ' + argument0 + ';\n';
};

Blockly.cake['variables_declare'] = function(block) {
  // Variable declare.
  var argument0 = Blockly.cake.valueToCode(block, 'VALUE',
      Blockly.cake.ORDER_ASSIGNMENT) || '0';
  var varName = Blockly.cake.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var varType = block.getFieldValue('TYPES');
  return varType + ' ' + varName + ' = ' + argument0 + ';\n';
};

Blockly.cake['variables_pointer_get'] = function(block) {
  // Variable getter.
  var code = Blockly.cake.variableDB_.getName(block.getFieldValue('VAR'),
      Blockly.Variables.NAME_TYPE);
  return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['variables_pointer_set'] = function(block) {
  // Variable setter.
  var argument0 = Blockly.cake.valueToCode(block, 'VALUE',
      Blockly.cake.ORDER_ASSIGNMENT) || '0';
  var varName = Blockly.cake.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  return varName + ' = ' + argument0 + ';\n';
};

Blockly.cake['variables_pointer_declare'] = function(block) {
  // Variable declare.
  var argument0 = Blockly.cake.valueToCode(block, 'VALUE',
      Blockly.cake.ORDER_ASSIGNMENT) || '0';
  var varName = Blockly.cake.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var varType = block.getFieldValue('TYPES');
  var varIteration;
  if(block.getFieldValue('ITERATION') == 'Normal')
    varIteration = '*';
  else if(block.getFieldValue('ITERATION') == 'Double')
    varIteration = '**';
  else if(block.getFieldValue('ITERATION') == 'Triple')
    varIteration = '***';
  else{
    window.alert('Error');
    return 0;
  }    
  return varType + varIteration + ' ' + varName + ' = ' + argument0 + ';\n';
};

Blockly.cake['variables_array_get'] = function(block) {
  // Variable getter.
  var code = Blockly.cake.variableDB_.getName(block.getFieldValue('VAR'),
      Blockly.Variables.NAME_TYPE);
  return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['variables_array_set'] = function(block) {
  // Variable setter.
  var argument0 = Blockly.cake.valueToCode(block, 'VALUE',
      Blockly.cake.ORDER_ASSIGNMENT) || '0';
  var varName = Blockly.cake.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  return varName + ' = ' + argument0 + ';\n';
};

Blockly.cake['variables_array_declare'] = function(block) {
  // Variable declare.
  var argument0 = Blockly.cake.valueToCode(block, 'VALUE',
      Blockly.cake.ORDER_ASSIGNMENT) || '0';
  var varName = Blockly.cake.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var varType = block.getFieldValue('TYPES');
  var Length = block.getFieldValue('LENGTH');
  Length = Length * 1;
  if(isNaN(Length) == true){
    window.alert('Error, you have to enter the number in length');
  }
  else
    return varType + '[' + Length + '] ' + varName + ' = ' + argument0 + ';\n';
};
