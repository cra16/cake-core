'use strict';

goog.provide('Blockly.cake.stdlib');

goog.require('Blockly.cake');

Blockly.cake['library_stdlib_convert'] = function(block) {
    var operator = block.getFieldValue('OPERATORS');
    var code;
    var arg = Blockly.cake.valueToCode(block, 'VAR',
            Blockly.cake.ORDER_NONE) || '\'\'';
    switch (operator) {
        case 'INT':
            code = 'atoi(' + arg + ')';
            break;
        case 'DOUBLE':
            code = 'atof(' + arg + ')';
            break;
        default:
            throw 'Unknown math operator: ' + operator;
    }
    Blockly.cake.definitions_['include_cake_stdlib'] =
        '#include <stdlib.h>';
    return [code, Blockly.cake.ORDER_NONE];
};

Blockly.cake['library_stdlib_rand'] = function(block) {
  // Scan statement.
  var argument0 = Blockly.cake.valueToCode(block, 'TEXT',
      Blockly.cake.ORDER_NONE) || '\'\'';
  Blockly.cake.definitions_['include_cake_stdlib'] =
        '#include <stdlib.h>';
  return 'rand(' + argument0 + ');\n';
};

Blockly.cake['library_stdlib_srand'] = function(block) {
  // Scan statement.
  var argument0 = Blockly.cake.valueToCode(block, 'TEXT',
      Blockly.cake.ORDER_NONE) || '\'\'';
  Blockly.cake.definitions_['include_cake_stdlib'] =
        '#include <stdlib.h>';
  return 'srand(' + argument0 + ');\n';
};
Blockly.cake['library_stdlib_malloc'] = function(block) {
  // Scan statement.
  var argument0 = Blockly.cake.valueToCode(block, 'TEXT',
      Blockly.cake.ORDER_NONE) || '\'\'';
  Blockly.cake.definitions_['include_cake_stdlib'] =
        '#include <stdlib.h>';
  return 'malloc(' + argument0 + ');\n';
};

Blockly.cake['library_stdlib_free'] = function(block) {
  // Scan statement.
  var argument0 = Blockly.cake.valueToCode(block, 'TEXT',
      Blockly.cake.ORDER_NONE) || '\'\'';
  Blockly.cake.definitions_['include_cake_stdlib'] =
        '#include <stdlib.h>';
  return 'free(' + argument0 + ');\n';
};

Blockly.cake['library_stdlib_exit'] = function(block) {
    var operator = block.getFieldValue('OPERATORS');
    var code;
    switch (operator) {
        case 'SUCCESS':
            code = 'exit(0);\n';
            break;
        case 'FAILURE':
            code = 'exit(1);\n';
            break;
        default:
            throw 'Unknown math operator: ' + operator;
    }
    Blockly.cake.definitions_['include_cake_stdlib'] =
        '#include <stdlib.h>';
  return code;
};