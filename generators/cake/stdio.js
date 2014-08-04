
'use strict';

goog.provide('Blockly.cake.stdio');

goog.require('Blockly.cake');

Blockly.Cake['stdio_printf'] = function(block) {
  // Print statement.
  var argument0 = Blockly.Cake.valueToCode(block, 'TEXT',
      Blockly.Cake.ORDER_NONE) || '\'\'';
  return 'printf(' + argument0 + ');\n';
};