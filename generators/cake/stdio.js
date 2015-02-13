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

        var childBlock = block.inputList[n].connection.targetBlock();
//childBlockType == '' ||
        if(childBlock){
            var childBlockType = childBlock.type;
            console.log(childBlockType);
            if(
                childBlockType == 'math_number' ||
                childBlockType == 'math_arithmetic' ||
                childBlockType == 'math_modulo' ||
                childBlockType == 'library_math_abs' ||
                childBlockType == 'library_math_trig' ||
                childBlockType == 'library_math_logs' ||
                childBlockType == 'library_math_pow' ||
                childBlockType == 'library_math_exp' ||
                childBlockType == 'library_math_sqrt' ||
                childBlockType == 'library_math_round' ||
                childBlockType == 'library_string_strlen' ||
                childBlockType == 'library_stdlib_rand' ||
                childBlockType == 'library_stdlib_number_forRandScope1' ||
                childBlockType == 'library_stdlib_number_forRandScope100' ||
                childBlockType == 'library_stdlib_sizeof_forMalloc' ||
                childBlockType == 'library_stdlib_arithmetic_forMalloc' ||
                childBlockType == 'library_stdlib_number_forMalloc')
            {
                inQutCode += '%d';
                outQutCode += ', ' + argument;
            }
            else if (childBlockType == 'library_string_strcat' ||
                childBlockType == 'library_string_strcpy' ||
                childBlockType == 'library_string_strcmp' )
            {
                inQutCode += '%s';
                outQutCode += ', ' + argument;
            }
            else if (childBlockType == 'library_stdlib_convert')
            {
                if (argument.indexOf('atoi(') != -1) {
                    inQutCode += '%d';
                } else if (argument.indexOf('atof(') != -1){
                    inQutCode += '%f';
                }
                outQutCode += ', ' + argument;
            }
            else if (childBlockType == 'library_math_numcheck' ||
                childBlockType == 'library_math_numcompare' ||
                childBlockType == 'procedures_callreturn' ||
                childBlockType == 'logic_compare' ||
                childBlockType == 'logic_operation' ||
                childBlockType == 'logic_negate' ||
                childBlockType == 'logic_boolean' ||
                childBlockType == 'logic_null' ||
                childBlockType == 'logic_ternary' ||
                childBlockType == 'controls_switch' ||
                childBlockType == 'library_stdlib_rand_scope' ||
                childBlockType == 'library_stdlib_malloc')
            {
                // illegal part.
                //block.setWarningText('Illegal!');
                //block.inputList[n].connection.disconnect();
            }
            else
            {
                typeCode = Blockly.cake.varTypeCheckInPrint(argument);

                if (typeCode == '') {
                    inQutCode += argument;
                } else {
                    inQutCode += typeCode;
                    outQutCode += ', ' + argument;
                }
            }
        }
    } // for loop end

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
    if (block.getParent() && block.getParent().type == 'library_stdio_printf') {
        return [code, Blockly.cake.ORDER_ATOMIC];
    } else if (code.length == 1) {
        code = '\'' + code + '\'';
    } else {
        code = '\"' + code + '\"';
    }
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

Blockly.cake.varTypeCheckInPrint = function(varName) {
    var typeCode = '';
    var varList = Blockly.Variables.allVariables();
    for(var temp = 0 ; temp < varList.length ; temp++) {
        if (varName == varList[temp][2]) {
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
