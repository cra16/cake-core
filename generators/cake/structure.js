'use strict';

goog.provide('Blockly.Cake.cake.structure');

goog.require('Blockly.Cake.cake');


Blockly.Cake.cake['structure_define'] = function(block) {
  var structName = Blockly.Cake.cake.variableDB_.getName(
    block.getFieldValue('NAME'), null);

  var mems = [];
  var memTypes = [];
    var memDist = [];
    var memSpec = [];
  var typePlusMems = [];
  for (var x = 0; x < block.members_.length; x++) {
    mems[x] = Blockly.Cake.cake.variableDB_.getName(block.members_[x],
      Blockly.Cake.Variables.NAME_TYPE);
      memTypes[x] = block.types_[x];
      memDist[x] = block.dist_[x];
      memSpec[x] = block.spec_[x];
      if(memDist[x] == 'v'){
          typePlusMems[x] = memTypes[x] + ' ' + mems[x] + ';\n';
      }
      else if(memDist[x] =='a'){
          typePlusMems[x] = memTypes[x] + ' ' + mems[x] + '[' + memSpec[x] + '];\n';
      }
      else if(memDist[x] =='p'){
          typePlusMems[x] = memTypes[x] + memSpec[x] + ' ' + mems[x] + ';\n';
      }
  }
  var structDef = 'typedef struct\n';
  var code = structDef + '{\n' + typePlusMems.join('') + '} ' + structName + ';\n';
    if (Blockly.Cake.Blocks.checkLegalName(Blockly.Cake.Msg.STRUCTURE_ILLEGALNAME, structName) == -1){
        this.initName();
    }
  return code;
};

Blockly.Cake.cake['structure_declare'] = function(block) {
  var type = Blockly.Cake.cake.variableDB_.getName(
    block.getFieldValue('TYPES'), null);
    type = Blockly.Cake.Blocks.checkUnselect(type);
  var structName = Blockly.Cake.cake.variableDB_.getName(
    block.getFieldValue('NAME'), Blockly.Cake.Variables.NAME_TYPE);
    if (Blockly.Cake.Blocks.checkLegalName(Blockly.Cake.Msg.STRUCTURE_ILLEGALNAME, structName) == -1){
        this.initName();
    }
  return type + ' ' + structName + ';\n';
};

Blockly.Cake.cake['structure_get'] = function(block) {
  var name = Blockly.Cake.cake.variableDB_.getName(
    block.getFieldValue('NAME'), null);
  var structMem = Blockly.Cake.cake.variableDB_.getName(
    block.getFieldValue('Mem'), Blockly.Cake.Variables.NAME_TYPE);
    structMem = Blockly.Cake.Blocks.checkUnselect(structMem);
  var code;
  if (structMem == 'Itself')
    var code = name;
  else
    var code = name + '.' + structMem;

  return [code, Blockly.Cake.cake.ORDER_ATOMIC];
};

Blockly.Cake.cake['structure_set'] = function(block) {
  var name = block.getFieldValue('NAME');
  var structMem = Blockly.Cake.cake.variableDB_.getName(
    block.getFieldValue('Mem'), Blockly.Cake.Variables.NAME_TYPE);
    structMem = Blockly.Cake.Blocks.checkUnselect(structMem);
  var argument0 = Blockly.Cake.cake.valueToCode(block, 'VALUE',
    Blockly.Cake.cake.ORDER_ASSIGNMENT) || '0';
  var fullName;
  if (structMem == 'Itself') {
    fullName = name;
  } else {
    fullName = name + '.' + structMem;
  }
  return fullName + ' = ' + argument0 +';\n';
};