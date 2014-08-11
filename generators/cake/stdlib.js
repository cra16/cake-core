
'use strict';

goog.provide('Blockly.cake.stdlib');

goog.require('Blockly.cake');

Blockly.cake['library_func_paren'] = function(block) {
  // Text value.
  var code = block.getFieldValue('TEXT');
  return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['library_stdlib_rand'] = function(block) {
  // Scan statement.
  var argument0 = Blockly.cake.valueToCode(block, 'TEXT',
      Blockly.cake.ORDER_NONE) || '\'\'';
  Blockly.cake.definitions_['include_cake_stdlib'] =
        '#include <stdlib.h>;';
  return 'rand(' + argument0 + ');\n';
};

Blockly.cake['library_stdlib_srand'] = function(block) {
  // Scan statement.
  var argument0 = Blockly.cake.valueToCode(block, 'TEXT',
      Blockly.cake.ORDER_NONE) || '\'\'';
  Blockly.cake.definitions_['include_cake_stdlib'] =
        '#include <stdlib.h>;';
  return 'srand(' + argument0 + ');\n';
};
Blockly.cake['library_stdlib_malloc'] = function(block) {
  // Scan statement.
  var argument0 = Blockly.cake.valueToCode(block, 'TEXT',
      Blockly.cake.ORDER_NONE) || '\'\'';
  Blockly.cake.definitions_['include_cake_stdlib'] =
        '#include <stdlib.h>;';
  return 'malloc(' + argument0 + ');\n';
};

Blockly.cake['library_stdlib_free'] = function(block) {
  // Scan statement.
  var argument0 = Blockly.cake.valueToCode(block, 'TEXT',
      Blockly.cake.ORDER_NONE) || '\'\'';
  Blockly.cake.definitions_['include_cake_stdlib'] =
        '#include <stdlib.h>;';
  return 'free(' + argument0 + ');\n';
};

Blockly.cake['library_stdlib_exit'] = function(block) {
  // Scan statement.
  var argument0 = Blockly.cake.valueToCode(block, 'TEXT',
      Blockly.cake.ORDER_NONE) || '\'\'';
  Blockly.cake.definitions_['include_cake_stdlib'] =
        '#include <stdlib.h>;';
  return 'exit(' + argument0 + ');\n';
};