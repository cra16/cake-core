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

        var childConnection = block.inputList[n].connection;
        var childBlock = childConnection.targetBlock();

        if(childBlock){
            var childBlockType = childBlock.type;

            if(
                // childBlockType == 'math_number' || // issue #85
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
            else if (childBlockType == 'variables_array_get')
            {
                var tempArgu1 = argument.split('[');

                typeCode = Blockly.cake.varTypeCheckInPrintScan(tempArgu1[0]);

                if (typeCode == '') {
                    inQutCode += argument;
                } else {
                    inQutCode += typeCode;
                    outQutCode += ', ' + argument;
                }
            }
            else if (childBlockType == 'variables_pointer_get')
            {
                inQutCode += '%p';
                outQutCode += ', ' + argument;
            }
            else if (childBlockType == 'variables_pointer_&')
            {
                if(childBlock.inputList[0].connection.targetBlock()){
                    argument = Blockly.cake.valueToCode(childBlock, 'VALUE', Blockly.cake.ORDER_NONE) || '';

                    inQutCode += '%p';
                    outQutCode += ', &' + argument;
                }
            }
            else if (childBlockType == 'variables_pointer_*')
            {
                if(childBlock.inputList[0].connection.targetBlock()){
                    argument = Blockly.cake.valueToCode(childBlock, 'VALUE', Blockly.cake.ORDER_NONE) || '';

                    if(argument.indexOf('*') >= 0 && childBlock.inputList[0].connection.targetBlock().inputList[0].connection.targetBlock()){ // when double pointer
                        var astChild = Blockly.cake.valueToCode(childBlock.inputList[0].connection.targetBlock(), 'VALUE', Blockly.cake.ORDER_NONE) || '';

                        typeCode = Blockly.cake.pointerTypeCheckInPrint(astChild, true);
                        if (typeCode == '') {
                            inQutCode += astChild;
                        } else {
                            inQutCode += typeCode;
                            outQutCode += ', **' + astChild;
                        }
                    } else { // when single pointer(*) or normal pointer block
                        typeCode = Blockly.cake.pointerTypeCheckInPrint(argument, false);
                        if (typeCode == '') {
                            inQutCode += argument;
                        } else {
                            inQutCode += typeCode;
                            outQutCode += ', *' + argument;
                        }
                    }
                }
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
                if (childConnection.isSuperior()) {
                    childConnection.targetBlock().setParent(null);
                } else {
                    childConnection.sourceBlock_.setParent(null);
                }
                // Bump away.
                childConnection.sourceBlock_.bumpNeighbours_();
            }
            else
            {
                typeCode = Blockly.cake.varTypeCheckInPrintScan(argument);

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
    if (block.getParent()
        && (block.getParent().type == 'library_stdio_printf'
        || block.getParent().type == 'define_declare'
        || block.getParent().type == 'comment')) {
        return [code, Blockly.cake.ORDER_ATOMIC];
    } else if (code.length == 1) {
        code = '\'' + code + '\'';
    } else {
        code = '\"' + code + '\"';
    }
    return [code, Blockly.cake.ORDER_ATOMIC];
};

Blockly.cake['library_stdio_newLine'] = function() {
    // new line block for '\n'
    var code = '\\n';
    return [code, Blockly.cake.ORDER_NONE];
};

Blockly.cake['library_stdio_scanf'] = function(block) {
    // Scan statement
    var argument = '';
    var typeCode = '';
    var inQutCode = '';
    var outQutCode = '';
    var code = '';

    for (var n = 0; n <= block.scanAddCount_; n++) {
        argument = Blockly.cake.valueToCode(block, 'VAR' + n,
            Blockly.cake.ORDER_NONE) || '';

        var childConnection = block.inputList[n].connection;
        var childBlock = childConnection.targetBlock();

        if(childBlock){
            var childBlockType = childBlock.type;

            if (childBlockType == 'variables_array_get')
            {
                var tempArgu1 = argument.split('[');

                typeCode = Blockly.cake.arrTypeCheckInScan(tempArgu1[0], childConnection);

                if (typeCode == '%s') {
                    inQutCode += typeCode;
                    outQutCode += ', ' + argument;
                } else {
                    inQutCode += typeCode;
                    outQutCode += ', &' + argument;
                }
            }
            else if (childBlockType == 'variables_pointer_get')
            {
                typeCode = Blockly.cake.varTypeCheckInPrintScan(argument);

                if (typeCode == '%c'){
                    typeCode = '%s';
                }
                inQutCode += typeCode;
                outQutCode += ', ' + argument;
            }
            else if (childBlockType == 'variables_pointer_&')
            {
                if (childConnection.isSuperior()) {
                    childConnection.targetBlock().setParent(null);
                } else {
                    childConnection.sourceBlock_.setParent(null);
                }
                // Bump away.
                childConnection.sourceBlock_.bumpNeighbours_();
            }
            else if (childBlockType == 'variables_pointer_*')
            {
                if(childBlock.inputList[0].connection.targetBlock()){
                    argument = Blockly.cake.valueToCode(childBlock, 'VALUE', Blockly.cake.ORDER_NONE) || '';

                    typeCode = Blockly.cake.varTypeCheckInPrintScan(argument);

                    if (typeCode == '') {
                        inQutCode += argument;
                    } else {
                        inQutCode += typeCode;
                        outQutCode += ', &*' + argument;
                    }
                }
            }
            else // When 'variables_variable_get' block
            {
                typeCode = Blockly.cake.varTypeCheckInPrintScan(argument);

                inQutCode += typeCode;
                outQutCode += ', &' + argument;
            }
        }
    } // for loop end

    if (outQutCode == ''){
        code = 'scanf(\"' + inQutCode + '\");';
    } else {
        code = 'scanf(\"' + inQutCode + '\"' + outQutCode + ');';
    }

    Blockly.cake.definitions_['include_cake_stdio'] =
        '#include <stdio.h>';
    return code + '\n';
};

Blockly.cake.varTypeCheckInPrintScan = function(varName) { // variable type check
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
            } else if (type == 'dbchar') {
                typeCode = '%s';
            }
            return typeCode;
        }
    }
    return typeCode;
};

Blockly.cake.pointerTypeCheckInPrint = function(varName, checkDoubleAst) { // pointer type check
    var typeCode = '';
    var varList = Blockly.Variables.allVariables();

    if (checkDoubleAst == true){ // double pointer
        for(var temp = 0 ; temp < varList.length ; temp++) {
            if (varName == varList[temp][2]) {
                var type = varList[temp][0];
                if (type == 'dbint') {
                    typeCode = '%d';
                } else if (type == 'dbunsigned int') {
                    typeCode = '%u';
                } else if (type == 'dbfloat') {
                    typeCode = '%f';
                } else if (type == 'dbdouble') {
                    typeCode = '%f';
                } else if (type == 'dbchar') {
                    typeCode = '%c';
                }
                return typeCode;
            }
        }
        return typeCode;
    } else { // single pointer(*) or normal pointer block
        for (var temp = 0; temp < varList.length; temp++) {
            if (varName == varList[temp][2]) {
                var type = varList[temp][0];
                if (varList[temp][5] == '*') {
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
                } else {
                    if (type == 'dbchar') {
                        typeCode = '%s';
                    } else {
                        typeCode = '%p';
                    }
                    return typeCode;
                }
            }
        }
    }
};

Blockly.cake.arrTypeCheckInScan = function(varName, childConnection) {
    var typeCode = '';
    var childBlock = childConnection.targetBlock();
    var arrList = Blockly.Blocks.getWantedBlockArray('a');

    for(var temp = 0 ; temp < arrList.length ; temp++) {
        var option = arrList[temp][2];
        var type = Blockly.FieldDropdown.prototype.getTypefromVars(option, 0);

        var arrIdxLength = arrList[temp][5][0];
        var inputLength = childBlock.getInputIdxLength();

        // type: variable
        if (arrIdxLength == inputLength) {
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
            } else if (type == 'dbchar') {
                typeCode = '%s';
            }
            return typeCode;
        }
        // type: pointer
        else if ((arrIdxLength > inputLength) && (arrList[temp][0] == 'char')) {
            typeCode = '%s';
            return typeCode;
        }
        else {
            if (childConnection.isSuperior()) {
                childConnection.targetBlock().setParent(null);
            } else {
                childConnection.sourceBlock_.setParent(null);
            }
            // Bump away.
            childConnection.sourceBlock_.bumpNeighbours_();
        }
    }
    return typeCode;
};

Blockly.cake['comment'] = function(block) {
    // Comment statement
    var argument = '';
    var code = '';
    var numOfLine = 0;

    for (var n = 0; n <= block.commentAddCount_; n++) {
        argument = Blockly.cake.valueToCode(block, 'VAR' + n,
            Blockly.cake.ORDER_NONE) || '';

        var childConnection = block.inputList[n].connection;
        var childBlock = childConnection.targetBlock();

        if(childBlock){
            var childBlockType = childBlock.type;

            if (childBlockType != 'library_stdio_text')
            {
                if (childConnection.isSuperior()) {
                    childConnection.targetBlock().setParent(null);
                } else {
                    childConnection.sourceBlock_.setParent(null);
                }
                // Bump away.
                childConnection.sourceBlock_.bumpNeighbours_();
            }
        }
        if(argument != ''){
            code += argument + '\n';
        }
        numOfLine += 1;
    } // for loop end

    if (numOfLine == 1){
        if(argument != '')
            code = '//' + code;
        else
            code = '//\n';
    } else {
        code = '/*\n' + code + '*/\n';
    }

    return code;
};