
'use strict';

goog.provide('Blockly.cake.library');

goog.require('Blockly.cake');

// Blockly.cake['library_func_paren'] = function(block) {
//   // Text value.
//   var code = block.getFieldValue('INTEXT');
//   return [code, Blockly.cake.ORDER_ATOMIC];
// };

// Blockly.cake['library_include'] = function(block) {
//   var text_file = block.getFieldValue('FILE');
//   // TODO: Assemble JavaScript into code variable.
//   var code = '';
//   Blockly.cake.definitions_['include_cake_stdio'] =
//         '#include <stdio.h>;';
//   return code;  
// };

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