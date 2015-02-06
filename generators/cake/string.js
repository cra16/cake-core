'use strict';

goog.provide('Blockly.cake.string');

goog.require('Blockly.cake');

Blockly.cake['library_string_strlen'] = function(block) {
    var code;
    var arg = Blockly.cake.valueToCode(block, 'VAR',
            Blockly.cake.ORDER_NONE) || '\'\'';
    Blockly.cake.definitions_['include_cake_string'] =
        '#include <string.h>';
    code = 'strlen(' + arg + ')';
    return [code, Blockly.cake.ORDER_NONE];
};