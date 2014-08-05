
'use strict';

goog.provide('Blockly.cake.library');

goog.require('Blockly.cake');

Blockly.cake['cake_stdio_printf'] = function(block) {
  // Print statement.
  var argument0 = Blockly.cake.valueToCode(block, 'TEXT',
      Blockly.cake.ORDER_NONE) || '\'\'';
  return 'printf("' + argument0 + '");\n';
};

Blockly.cake['cake_stdio_scanf'] = function(block) {
  // Scan statement.
  var argument0 = Blockly.cake.valueToCode(block, 'TEXT',
      Blockly.cake.ORDER_NONE) || '\'\'';
  return 'scanf(' + argument0 + ');\n';
};