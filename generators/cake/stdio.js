'use strict';

goog.provide('Blockly.cake.stdio');

goog.require('Blockly.cake');

Blockly.cake['library_stdio_printf'] = function(block) {
  // Print statement
    var argument = '';
    var typeCode = '';
    var inQutCode = '';
    var outQutCode = '';
    var code = '';

    for (var n = 0; n <= block.printAddCount_; n++) {
        argument = Blockly.cake.valueToCode(block, 'VAR' + n,
            Blockly.cake.ORDER_NONE) || '';

        typeCode = Blockly.cake.varTypeCheckInPrint(argument);

        if (typeCode == '') {
            inQutCode += argument;
        } else {
            inQutCode += typeCode;
            outQutCode += ', ' + argument;
        }
    }

    if (outQutCode == ''){
        code = 'printf(\"' + inQutCode + '\");';
    } else {
        code = 'printf(\"' + inQutCode + '\"' + outQutCode + ');';
    }

    Blockly.cake.definitions_['include_cake_stdio'] =
        '#include <stdio.h>';
    return code + '\n';
};

Blockly.cake['library_stdio_text'] = function(block) {
    // Text value.
    var code = Blockly.cake.quote_(block.getFieldValue('TEXT'));
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['library_stdio_newLine'] = function(block) {
    // new line block for '\n'
    var code = '\\n';
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

Blockly.cake.varTypeCheckInPrint = function(varname) {
    var typeCode = '';
    var varList = Blockly.Variables.allVariables();
    for(var temp = 0 ; temp < varList.length ; temp++) {
        if (varname == varList[temp][2]) {
            var type = varList[temp][0];
            if (type == 'int') {
                typeCode = '%d';
            } else if (type == 'unsigned int') {
                typeCode = '%u';
            } else if (type == 'float') {
                typeCode = '%f';
            } else if (type == 'double') {
                typeCode = '%f';
            } else if (type == 'char') {
                typeCode = '%c';
            }
            return typeCode;
        }
    }
    return typeCode;
};