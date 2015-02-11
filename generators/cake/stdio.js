
'use strict';

goog.provide('Blockly.cake.stdio');

goog.require('Blockly.cake');

Blockly.cake['library_stdio_printf'] = function(block) {
  // Print statement
  var argument0 = Blockly.cake.valueToCode(block, 'TEXT',
      Blockly.cake.ORDER_NONE) || '\'\'';
  Blockly.cake.definitions_['include_cake_stdio'] =
        '#include <stdio.h>';
  return 'printf(' + argument0 + ');\n';
};

Blockly.cake['library_stdio_text'] = function(block) {
    // Text value.
    var code = Blockly.cake.quote_(block.getFieldValue('TEXT'));
    if (code.length == 1){
        code = '\'' + code + '\'';
    }
    else {
        code = '\"' + code + '\"';
    }
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['library_stdio_newLine'] = function(block) {
    // new line block for '\n'
    var code = '\\n'
    return [code, Blockly.cake.ORDER_NONE];
};

Blockly.cake['library_stdio_scanf'] = function(block) {
  // Scan statement.
  var argument0 = Blockly.cake.valueToCode(block, 'TEXT',
      Blockly.cake.ORDER_NONE) || '\'\'';
  Blockly.cake.definitions_['include_cake_stdio'] =
        '#include <stdio.h>';
  return 'scanf(' + argument0 + ');\n';
};