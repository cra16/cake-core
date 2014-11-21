'use strict';

goog.provide('Blockly.cake.structure');

goog.require('Blockly.cake');


Blockly.cake['structure_define'] = function(block) {
  // Define a procedure with a return value.
  var funcName = Blockly.cake.variableDB_.getName(
      block.getFieldValue('NAME'), null);
  
  var mems = [];
  var memTypes = [];
  var typePlusMems = [];
  for (var x = 0; x < block.members_.length; x++) {
    mems[x] = Blockly.cake.variableDB_.getName(block.members_[x],
        Blockly.Variables.NAME_TYPE);
    memTypes[x] = block.types_[x];
    typePlusMems[x] = memTypes[x] + ' ' + mems[x] + ';\n';
  }
  var structDef = 'typedef struct\n';
  var code = structDef + '{\n' + typePlusMems.join('') + '} ' + funcName + ';\n';
  return code;
};

Blockly.cake['structure_declare'] = function(block) {
  // Variable setter.
  var type = Blockly.cake.variableDB_.getName(
      block.getFieldValue('TYPES'), null);
  var varName = Blockly.cake.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.Variables.NAME_TYPE);
  return type + ' ' + varName + ';\n';
};