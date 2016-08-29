'use strict';

goog.provide('Blockly.Cake.cake.stdlib');

goog.require('Blockly.Cake.cake');

Blockly.Cake.cake['library_stdlib_convert'] = function(block) {
    var operator = block.getFieldValue('OPERATORS');
    var code;
    var arg = Blockly.Cake.cake.valueToCode(block, 'VAR',
            Blockly.Cake.cake.ORDER_NONE) || '\'\'';
    switch (operator) {
        case 'INT':
            code = 'atoi(' + arg + ')';
            break;
        case 'DOUBLE':
            code = 'atof(' + arg + ')';
            break;
        default:
            throw 'Unknown math operator: ' + operator;
    }
    Blockly.Cake.cake.definitions_['include_cake_stdlib'] =
        '#include <stdlib.h>';
    return [code, Blockly.Cake.cake.ORDER_NONE];
};

Blockly.Cake.cake['library_stdlib_rand'] = function(block) {
    var code;
    var arg = Blockly.Cake.cake.valueToCode(block, 'VAR',
            Blockly.Cake.cake.ORDER_NONE) || '';
    Blockly.Cake.cake.definitions_['include_cake_stdlib'] =
        '#include <stdlib.h>';
    Blockly.Cake.cake.definitions_['include_cake_time'] =
        '#include <time.h>';
    code = 'rand()' + arg;

    Blockly.Cake.cake.getUpperLine(block);

    return [code, Blockly.Cake.cake.ORDER_NONE];
};

// for srand(time(NULL))
Blockly.Cake.cake.getUpperLine = function(curBlock) {
    var scope = curBlock.getScope();
    var time = 'srand(time(NULL));';

    Blockly.Cake.cake.times_['cake_time_srand'] = [scope, time];

};

Blockly.Cake.cake['library_stdlib_rand_scope'] = function(block) {
    // Basic arithmetic operators.
    var argument0 = Blockly.Cake.cake.valueToCode(block, 'A', Blockly.Cake.cake.ORDER_NONE) || '0';
    var argument1 = Blockly.Cake.cake.valueToCode(block, 'B', Blockly.Cake.cake.ORDER_NONE) || '0';
    var code;
    // Power in cake requires a special case since it has no operator.
    if (argument0 == 1){
        code = ' % ' + argument1 + ' + ' + argument0;
    } else {
        code = ' % (' + argument1 + '-' + argument0 + '+1) + ' + argument0;
    }
    return [code, Blockly.Cake.cake.ORDER_NONE];
};

Blockly.Cake.cake['library_stdlib_number_forRandScope1'] = function(block) {
    // Numeric value.
    var code = parseFloat(block.getFieldValue('NUM'));
    return [code, Blockly.Cake.cake.ORDER_ATOMIC];
};

Blockly.Cake.cake['library_stdlib_number_forRandScope100'] = function(block) {
    // Numeric value.
    var code = parseFloat(block.getFieldValue('NUM'));
    return [code, Blockly.Cake.cake.ORDER_ATOMIC];
};

Blockly.Cake.cake['library_stdlib_malloc'] = function(block) {
    var code;
    var type = Blockly.Cake.FieldDropdown.prototype.getParentType(block, 'variables_pointer');
    var arg = Blockly.Cake.cake.valueToCode(block, 'VAR',
            Blockly.Cake.cake.ORDER_NONE) || '\'\'';
    Blockly.Cake.cake.definitions_['include_cake_stdlib'] =
        '#include <stdlib.h>';
    code = '(' + type + ' *)malloc(' + arg + ')';
    return [code, Blockly.Cake.cake.ORDER_NONE];
};

Blockly.Cake.cake['library_stdlib_sizeof_forMalloc'] = function(block) {
    var code;
    var arg = Blockly.Cake.cake.valueToCode(block, 'VAR',
            Blockly.Cake.cake.ORDER_NONE) || '\'\'';
    code = 'sizeof(' + arg + ')';
    return [code, Blockly.Cake.cake.ORDER_NONE];
};

Blockly.Cake.cake['library_stdlib_arithmetic_forMalloc'] = function(block) {
    // Basic arithmetic operators.
    var argument0 = Blockly.Cake.cake.valueToCode(block, 'A', Blockly.Cake.cake.ORDER_NONE) || '0';
    var argument1 = Blockly.Cake.cake.valueToCode(block, 'B', Blockly.Cake.cake.ORDER_NONE) || '0';
    var code;
    // Power in cake requires a special case since it has no operator.
    code = argument0 + ' * ' + argument1;
    return [code, Blockly.Cake.cake.ORDER_NONE];
};

Blockly.Cake.cake['library_stdlib_number_forMalloc'] = function(block) {
    // Numeric value.
    var code = parseFloat(block.getFieldValue('NUM'));
    return [code, Blockly.Cake.cake.ORDER_ATOMIC];
};

Blockly.Cake.cake['library_stdlib_free'] = function(block) {
  // Scan statement.
  var arg = Blockly.Cake.cake.valueToCode(block, 'VAR',
      Blockly.Cake.cake.ORDER_NONE) || '\'\'';
  Blockly.Cake.cake.definitions_['include_cake_stdlib'] =
        '#include <stdlib.h>';
  return 'free(' + arg + ');\n';
};

Blockly.Cake.cake['library_stdlib_exit'] = function(block) {
    var operator = block.getFieldValue('OPERATORS');
    var code;
    switch (operator) {
        case 'SUCCESS':
            code = 'exit(0);\n';
            break;
        case 'FAILURE':
            code = 'exit(1);\n';
            break;
        default:
            throw 'Unknown math operator: ' + operator;
    }
    Blockly.Cake.cake.definitions_['include_cake_stdlib'] =
        '#include <stdlib.h>';
  return code;
};