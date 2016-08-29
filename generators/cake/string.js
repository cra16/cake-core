'use strict';

goog.provide('Blockly.Cake.cake.string');

goog.require('Blockly.Cake.cake');

Blockly.Cake.cake['library_string_strlen'] = function(block) {
    var code;
    var arg = Blockly.Cake.cake.valueToCode(block, 'VAR',
            Blockly.Cake.cake.ORDER_NONE) || '\"\"';
    Blockly.Cake.cake.definitions_['include_cake_string'] =
        '#include <string.h>';
    code = 'strlen(' + arg + ')';
    return [code, Blockly.Cake.cake.ORDER_NONE];
};

Blockly.Cake.cake['library_string_strcat'] = function(block) {
    var code;
    var arg1 = Blockly.Cake.cake.valueToCode(block, 'STR1',
            Blockly.Cake.cake.ORDER_NONE) || '\"\"';
    var arg2 = Blockly.Cake.cake.valueToCode(block, 'STR2',
            Blockly.Cake.cake.ORDER_NONE) || '\"\"';
    Blockly.Cake.cake.definitions_['include_cake_string'] =
        '#include <string.h>';
    code = 'strcat(' + arg1 + ', '+ arg2 + ')';
    return [code, Blockly.Cake.cake.ORDER_NONE];
};

Blockly.Cake.cake['library_string_strcpy'] = function(block) {
    var code;
    var arg1 = Blockly.Cake.cake.valueToCode(block, 'STR1',
            Blockly.Cake.cake.ORDER_NONE) || '\"\"';
    var arg2 = Blockly.Cake.cake.valueToCode(block, 'STR2',
            Blockly.Cake.cake.ORDER_NONE) || '\"\"';
    Blockly.Cake.cake.definitions_['include_cake_string'] =
        '#include <string.h>';
    code = 'strcpy(' + arg2 + ', '+ arg1 + ')';
    return [code, Blockly.Cake.cake.ORDER_NONE];
};

Blockly.Cake.cake['library_string_strcmp'] = function(block) {
    var code;
    var arg1 = Blockly.Cake.cake.valueToCode(block, 'STR1',
            Blockly.Cake.cake.ORDER_NONE) || '\"\"';
    var arg2 = Blockly.Cake.cake.valueToCode(block, 'STR2',
            Blockly.Cake.cake.ORDER_NONE) || '\"\"';
    Blockly.Cake.cake.definitions_['include_cake_string'] =
        '#include <string.h>';
    code = 'strcmp(' + arg1 + ', '+ arg2 + ')';
    return [code, Blockly.Cake.cake.ORDER_NONE];
};