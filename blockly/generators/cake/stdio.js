
'use strict';

goog.provide('Blockly.cake.stdio');

goog.require('Blockly.cake');

Blockly.cake['library_func_paren'] = function(block) {
  // Text value.
  var code = block.getFieldValue('TEXT');
  return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['library_stdio_printf'] = function(block) {
  // Print statement
  var argument0 = Blockly.cake.valueToCode(block, 'TEXT',
      Blockly.cake.ORDER_NONE) || '\'\'';
  Blockly.cake.definitions_['include_cake_stdio'] =
        '#include <stdio.h>;';
  return 'printf(' + argument0 + ');\n';
};

Blockly.cake['library_stdio_scanf'] = function(block) {
  // Scan statement.
  var argument0 = Blockly.cake.valueToCode(block, 'TEXT',
      Blockly.cake.ORDER_NONE) || '\'\'';
  Blockly.cake.definitions_['include_cake_stdio'] =
        '#include <stdio.h>;';
  return 'scanf(' + argument0 + ');\n';
};

Blockly.cake['library_stdio_fopen'] = function(block) {
  // Print statement
  var argument0 = Blockly.cake.valueToCode(block, 'TEXT',
      Blockly.cake.ORDER_NONE) || '\'\'';
  Blockly.cake.definitions_['include_cake_stdio'] =
        '#include <stdio.h>;';
  return 'fopen(' + argument0 + ');\n';
};

Blockly.cake['library_stdio_fclose'] = function(block) {
  // Scan statement.
  var argument0 = Blockly.cake.valueToCode(block, 'TEXT',
      Blockly.cake.ORDER_NONE) || '\'\'';
  Blockly.cake.definitions_['include_cake_stdio'] =
        '#include <stdio.h>;';
  return 'fclose(' + argument0 + ');\n';
};

Blockly.cake['library_stdio_fprintf'] = function(block) {
  // Scan statement.
  var argument0 = Blockly.cake.valueToCode(block, 'TEXT',
      Blockly.cake.ORDER_NONE) || '\'\'';
  Blockly.cake.definitions_['include_cake_stdio'] =
        '#include <stdio.h>;';
  return 'fprintf(' + argument0 + ');\n';
};

Blockly.cake['library_stdio_fscanf'] = function(block) {
  // Scan statement.
  var argument0 = Blockly.cake.valueToCode(block, 'TEXT',
      Blockly.cake.ORDER_NONE) || '\'\'';
  Blockly.cake.definitions_['include_cake_stdio'] =
        '#include <stdio.h>;';
  return 'fscanf(' + argument0 + ');\n';
};

Blockly.cake['library_stdio_fflush'] = function(block) {
  // Scan statement.
  var argument0 = Blockly.cake.valueToCode(block, 'TEXT',
      Blockly.cake.ORDER_NONE) || '\'\'';
  Blockly.cake.definitions_['include_cake_stdio'] =
        '#include <stdio.h>;';
  return 'fflush(' + argument0 + ');\n';
};

Blockly.cake['library_stdio_fread'] = function(block) {
  // Scan statement.
  var argument0 = Blockly.cake.valueToCode(block, 'TEXT',
      Blockly.cake.ORDER_NONE) || '\'\'';
  Blockly.cake.definitions_['include_cake_stdio'] =
        '#include <stdio.h>;';
  return 'fread(' + argument0 + ');\n';
};

Blockly.cake['library_stdio_fwrite'] = function(block) {
  // Scan statement.
  var argument0 = Blockly.cake.valueToCode(block, 'TEXT',
      Blockly.cake.ORDER_NONE) || '\'\'';
  Blockly.cake.definitions_['include_cake_stdio'] =
        '#include <stdio.h>;';
  return 'fwrite(' + argument0 + ');\n';
};

Blockly.cake['library_stdio_getchar'] = function(block) {
  // Scan statement.
  var argument0 = Blockly.cake.valueToCode(block, 'TEXT',
      Blockly.cake.ORDER_NONE) || '\'\'';
  Blockly.cake.definitions_['include_cake_stdio'] =
        '#include <stdio.h>;';
  return 'getchar(' + argument0 + ');\n';
};

Blockly.cake['library_stdio_putchar'] = function(block) {
  // Scan statement.
  var argument0 = Blockly.cake.valueToCode(block, 'TEXT',
      Blockly.cake.ORDER_NONE) || '\'\'';
  Blockly.cake.definitions_['include_cake_stdio'] =
        '#include <stdio.h>;';
  return 'putchar(' + argument0 + ');\n';
};

Blockly.cake['library_stdio_gets'] = function(block) {
  // Scan statement.
  var argument0 = Blockly.cake.valueToCode(block, 'TEXT',
      Blockly.cake.ORDER_NONE) || '\'\'';
  Blockly.cake.definitions_['include_cake_stdio'] =
        '#include <stdio.h>;';
  return 'gets(' + argument0 + ');\n';
};

Blockly.cake['library_stdio_puts'] = function(block) {
  // Scan statement.
  var argument0 = Blockly.cake.valueToCode(block, 'TEXT',
      Blockly.cake.ORDER_NONE) || '\'\'';
  Blockly.cake.definitions_['include_cake_stdio'] =
        '#include <stdio.h>;';
  return 'puts(' + argument0 + ');\n';
};