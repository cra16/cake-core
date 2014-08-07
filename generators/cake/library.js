
'use strict';

goog.provide('Blockly.cake.library');

goog.require('Blockly.cake');

// Blockly.cake['library_func_paren'] = function(block) {
//   // Text value.
//   var code = block.getFieldValue('INTEXT');
//   return [code, Blockly.cake.ORDER_ATOMIC];
// };

Blockly.cake['library_include'] = function(block) {
  var text_file = block.getFieldValue('FILE');
  // TODO: Assemble JavaScript into code variable.
  var code = '#include ' + text_file;
  return code;
};

Blockly.cake['library_func_paren'] = function(block) {
  // Text value.
  var code = block.getFieldValue('TEXT');
  return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['library_stdio_printf'] = function(block) {
  // Print statement.
  var argument0 = Blockly.cake.valueToCode(block, 'TEXT',
      Blockly.cake.ORDER_NONE) || '\'\'';
  return 'printf(' + argument0 + ');\n';
};

Blockly.cake['library_stdio_scanf'] = function(block) {
  // Scan statement.
  var argument0 = Blockly.cake.valueToCode(block, 'TEXT',
      Blockly.cake.ORDER_NONE) || '\'\'';
  return 'scanf(' + argument0 + ');\n';
};