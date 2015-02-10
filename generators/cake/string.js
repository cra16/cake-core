'use strict';

goog.provide('Blockly.cake.string');

goog.require('Blockly.cake');

Blockly.cake['library_string_strlen'] = function(block) {
    var code;
    var arg = Blockly.cake.valueToCode(block, 'VAR',
            Blockly.cake.ORDER_NONE) || '\"\"';
    Blockly.cake.definitions_['include_cake_string'] =
        '#include <string.h>';
    code = 'strlen(' + arg + ')';
    return [code, Blockly.cake.ORDER_NONE];
};

Blockly.cake['library_string_strcat'] = function(block) {
    var code;
    var arg1 = Blockly.cake.valueToCode(block, 'STR1',
            Blockly.cake.ORDER_NONE) || '\"\"';
    var arg2 = Blockly.cake.valueToCode(block, 'STR2',
            Blockly.cake.ORDER_NONE) || '\"\"';
    Blockly.cake.definitions_['include_cake_string'] =
        '#include <string.h>';
    code = 'strcat(' + arg1 + ', '+ arg2 + ')';
    return [code, Blockly.cake.ORDER_NONE];
};

Blockly.cake['library_string_strcpy'] = function(block) {
    var code;
    var arg1 = Blockly.cake.valueToCode(block, 'STR1',
            Blockly.cake.ORDER_NONE) || '\"\"';
    var arg2 = Blockly.cake.valueToCode(block, 'STR2',
            Blockly.cake.ORDER_NONE) || '\"\"';
    Blockly.cake.definitions_['include_cake_string'] =
        '#include <string.h>';
    code = 'strcpy(' + arg2 + ', '+ arg1 + ')';
    return [code, Blockly.cake.ORDER_NONE];
};

Blockly.cake['library_string_strcmp'] = function(block) {
    var code;
    var arg1 = Blockly.cake.valueToCode(block, 'STR1',
            Blockly.cake.ORDER_NONE) || '\"\"';
    var arg2 = Blockly.cake.valueToCode(block, 'STR2',
            Blockly.cake.ORDER_NONE) || '\"\"';
    Blockly.cake.definitions_['include_cake_string'] =
        '#include <string.h>';
    code = 'strcmp(' + arg1 + ', '+ arg2 + ')';
    return [code, Blockly.cake.ORDER_NONE];
};