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
 * @fileoverview Generating cake for loop blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.cake.loops');

goog.require('Blockly.cake');


Blockly.cake['controls_whileUntil'] = function(block) {
  // Do while/until loop.
  var until = block.getFieldValue('MODE') == 'UNTIL';
  var argument0 = Blockly.cake.valueToCode(block, 'BOOL',
    until ? Blockly.cake.ORDER_LOGICAL_NOT :
    Blockly.cake.ORDER_NONE) || '0';
  var branch = Blockly.cake.statementToCode(block, 'DO');
  branch = Blockly.cake.addLoopTrap(branch, block.id);
  if (until) {
    argument0 = '!' + argument0;
  }
  return 'while (' + argument0 + ') {\n' + branch + '}\n';
};

Blockly.cake['controls_doWhile'] = function(block) {
    // Do while/until loop.
    var until = block.getFieldValue('MODE') == 'UNTIL';
    var argument0 = Blockly.cake.valueToCode(block, 'BOOL',
            until ? Blockly.cake.ORDER_LOGICAL_NOT :
                Blockly.cake.ORDER_NONE) || '0';
    var branch = Blockly.cake.statementToCode(block, 'DO');
    branch = Blockly.cake.addLoopTrap(branch, block.id);
    if (until) {
        argument0 = '!' + argument0;
    }
    return 'do {\n' + branch + '} while (' + argument0 + ');\n';
};

Blockly.cake['controls_for'] = function(block) {
  // For loop.
  var variable0 = Blockly.cake.variableDB_.getName(
    block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
    if(variable0 == '___EC_84_A0_ED_83_9D__' || variable0 == '--Select--'){
        variable0 = 'unselected';
    }
  var argument0 = Blockly.cake.valueToCode(block, 'FROM',
    Blockly.cake.ORDER_ASSIGNMENT) || '0';
  var argument1 = Blockly.cake.valueToCode(block, 'TO',
    Blockly.cake.ORDER_ASSIGNMENT) || '0';
  var increment = Blockly.cake.valueToCode(block, 'BY',
    Blockly.cake.ORDER_ASSIGNMENT) || '1';
  var branch = Blockly.cake.statementToCode(block, 'DO');
  branch = Blockly.cake.addLoopTrap(branch, block.id);
  var code;
    // All arguments are simple numbers.
    code = 'for (' + variable0 + ' = ' + argument0 + '; ' +
      variable0 + '<' + argument1 + '; ' +
      variable0;
    var up = increment >= 0;
    var step = Math.abs(parseFloat(increment));
    if (step == 1) {
      code += up ? '++' : '--';
    } else {
      code += (up ? ' += ' : ' -= ') + step;
    }
    code += ') {\n' + branch + '}\n';

  return code;
};

Blockly.cake['controls_flow_statements'] = function(block) {
  // Flow statements: continue, break.
  switch (block.getFieldValue('FLOW')) {
    case 'BREAK':
      return 'break;\n';
    case 'CONTINUE':
      return 'continue;\n';
  }
  throw 'Unknown flow statement.';
};