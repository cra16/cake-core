/**
 * Created by 최재웅 on 2015-02-11.
 */
'use strict';

goog.provide('Blockly.cake.time');

goog.require('Blockly.cake');


Blockly.cake['library_time_current'] = function(block) {
    var code = 'timer = time(NULL);\n'+
        't = localtime(&timer);\n'+
        'printf("%04d-%02d-%02d %02d:%02d:%02d\\n",t->tm_year + 1900, t->tm_mon + 1, t->tm_mday, t->tm_hour, t->tm_min, t->tm_sec);\n';
    var scope = block.getScope();
    Blockly.cake.times_['time_currentTime'] = [scope, 'struct tm *t;\n'+'time_t timer;'];
    Blockly.cake.definitions_['include_cake_time'] =
        '#include <time.h>';
    return code;
};

Blockly.cake['library_time_requiredTime'] = function(block) {
    var arg = Blockly.cake.valueToCode(block, 'SAVE',
            Blockly.cake.ORDER_NONE) || '';
    var branch = Blockly.cake.statementToCode(block, 'DO');
    var scope = block.getScope();
    Blockly.cake.times_['time_requiredTime'] = [scope, 'time_t start, end;'];
    Blockly.cake.definitions_['include_cake_time'] =
        '#include <time.h>';
    return 'start = time(NULL);\n' + branch + 'end = time(NULL);\n' + arg + ' = ' + 'difftime(end, start);\n';
};
