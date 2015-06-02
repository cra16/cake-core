/**
 * @license
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * https://blockly.googlecode.com/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Generating cake for procedure blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.cake.procedures');

goog.require('Blockly.cake');

Blockly.cake['main_block'] = function(block) {
  // Define a procedure with a return value.
  var funcName = 'main';
  var branch = Blockly.cake.statementToCode(block, 'STACK');
  if (Blockly.cake.STATEMENT_PREFIX) {
    branch = Blockly.cake.prefixLines(
        Blockly.cake.STATEMENT_PREFIX.replace(/%1/g,
        '\'' + block.id + '\''), Blockly.cake.INDENT) + branch;
  }
  if (Blockly.cake.INFINITE_LOOP_TRAP) {
    branch = Blockly.cake.INFINITE_LOOP_TRAP.replace(/%1/g,
        '\'' + block.id + '\'') + branch;
  }
  var returnValue = Blockly.cake.valueToCode(block, 'RETURN',
      Blockly.cake.ORDER_NONE) || '';
  if (returnValue) {
    returnValue = '  return ' + returnValue + ';\n';
  }
    else {
      returnValue = '  return 0;\n';
  }
  var args = [];
  var argTypes = [];
  var typePlusArgs = [];
  for (var x = 0; x < block.arguments_.length; x++) {
    args[x] = Blockly.cake.variableDB_.getName(block.arguments_[x],
        Blockly.Variables.NAME_TYPE);
    argTypes[x] = block.types_[x];
    typePlusArgs[x] = argTypes[x] + ' ' + args[x];
  }
  var returnType = 'int';

    var rand = [];
    var time = [];
    for (var name in Blockly.cake.times_) {
        var def = Blockly.cake.times_[name];
        var nameSrand = 'srand';
        var nameTime = 'time';
        var preDef;
        if(name.match(nameSrand)) {
            if(def[0] == 'main_block') {
                preDef = Blockly.cake.prefixLines(def[1], Blockly.cake.INDENT);
                rand.push(preDef);
            }
        }
        else if(name.match(nameTime)){
            if(def[0] == 'main_block') {
                preDef = Blockly.cake.prefixLines(def[1], Blockly.cake.INDENT);
                time.push(preDef);
            }
        }
    }
    if(rand.length){
        var allDefs = rand.join('\n') + '\n' + time.join('\n');
    }
    else{
        var allDefs = time.join('\n');
    }

    var code = returnType + ' ' + funcName + '(' + typePlusArgs.join(', ') + ') {' +
        allDefs.replace(/\n\n+/g, '\n\n').replace(/\n*$/, '\n') + branch + returnValue + '}';
  code = Blockly.cake.scrub_(block, code);
  Blockly.cake.definitions_[funcName] = code;
  return null;
};

Blockly.cake['procedures_return'] = function(block) {
    var returnValue = block.getFieldValue('VALUE');
    if(returnValue){
        return 'return ' + returnValue + ';\n';
    }
    else {
        return 'return 0;\n';
    }
};

Blockly.cake['procedures_defreturn'] = function(block) {
  // Define a procedure with a return value.
  var funcName = Blockly.cake.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  var branch = Blockly.cake.statementToCode(block, 'STACK');
  if (Blockly.cake.STATEMENT_PREFIX) {
    branch = Blockly.cake.prefixLines(
        Blockly.cake.STATEMENT_PREFIX.replace(/%1/g,
        '\'' + block.id + '\''), Blockly.cake.INDENT) + branch;
  }
  if (Blockly.cake.INFINITE_LOOP_TRAP) {
    branch = Blockly.cake.INFINITE_LOOP_TRAP.replace(/%1/g,
        '\'' + block.id + '\'') + branch;
  }
  var returnValue = Blockly.cake.valueToCode(block, 'RETURN',
      Blockly.cake.ORDER_NONE) || '';
  if (returnValue) {
    returnValue = '  return ' + returnValue + ';\n';
  }
    else {
      returnValue = '  return 0;\n';
  }
  var typePlusArgs = Blockly.Procedures.getTypePlusArgs(block);

    var rand = [];
    var time = [];
    for (var name in Blockly.cake.times_) {
        var def = Blockly.cake.times_[name];
        var nameSrand = 'srand';
        var nameTime = 'time';
        var preDef;
        if(name.match(nameSrand)) {
            if(def[0] == funcName) {
                preDef = Blockly.cake.prefixLines(def[1], Blockly.cake.INDENT);
                rand.push(preDef);
            }
        }
        else if(name.match(nameTime)){
            if(def[0] == funcName) {
                preDef = Blockly.cake.prefixLines(def[1], Blockly.cake.INDENT);
                time.push(preDef);
            }
        }
    }
    if(rand.length){
        var allDefs = rand.join('\n') + '\n' + time.join('\n');
    }
    else{
        var allDefs = time.join('\n');
    }

  var returnType = block.getFieldValue('TYPES');
    var returnDist = block.getFieldValue('DISTS');
    var returnSpec, code;
    if(returnDist == 'pointer'){
        returnSpec = block.getFieldValue('PSPECS');
        if(returnSpec == null){
            returnSpec = '*';
        }
        code = returnType + returnSpec + ' ' + funcName + '(' + typePlusArgs.join(', ') + ') {\n' +
        allDefs.replace(/\n\n+/g, '\n\n').replace(/\n*$/, '\n') + branch + returnValue + '}';
    }
    else if(returnDist == 'array'){
        returnSpec = block.getFieldValue('ASPECS');
        if(returnSpec == null){
            returnSpec = '[]';
        }
        code = returnType + returnSpec + ' ' + funcName + '(' + typePlusArgs.join(', ') + ') {\n' +
        allDefs.replace(/\n\n+/g, '\n\n').replace(/\n*$/, '\n') + branch + returnValue + '}';
    }
    else{
        code = returnType + ' ' + funcName + '(' + typePlusArgs.join(', ') + ') {\n' +
        allDefs.replace(/\n\n+/g, '\n\n').replace(/\n*$/, '\n') + branch + returnValue + '}';
    }
  code = Blockly.cake.scrub_(block, code);
  Blockly.cake.definitions_[funcName] = code;
  Blockly.cake.definitions_['Func_declare'+funcName] =
    returnType + ' ' + funcName + '(' + typePlusArgs.join(', ') + ');';
    if (Blockly.Blocks.checkLegalName(Blockly.Msg.PROCEDURES_ILLEGALNAME, funcName) == -1) {
        this.initName();
    }
  return null;
};

// Defining a procedure without a return value uses the same generator as
// a procedure with a return value.
Blockly.cake['procedures_defnoreturn'] = function(block) {
  // Define a procedure with a return value.
  var funcName = Blockly.cake.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  var branch = Blockly.cake.statementToCode(block, 'STACK');

    var rand = [];
    var time = [];
    for (var name in Blockly.cake.times_) {
        var def = Blockly.cake.times_[name];
        var nameSrand = 'srand';
        var nameTime = 'time';
        var preDef;
        if(name.match(nameSrand)) {
            if(def[0] == funcName) {
                preDef = Blockly.cake.prefixLines(def[1], Blockly.cake.INDENT);
                rand.push(preDef);
            }
        }
        else if(name.match(nameTime)){
            if(def[0] == funcName) {
                preDef = Blockly.cake.prefixLines(def[1], Blockly.cake.INDENT);
                time.push(preDef);
            }
        }
    }
    if(rand.length){
        var allDefs = rand.join('\n') + '\n' + time.join('\n');
    }
    else{
        var allDefs = time.join('\n');
    }

  if (Blockly.cake.STATEMENT_PREFIX) {
    branch = Blockly.cake.prefixLines(
        Blockly.cake.STATEMENT_PREFIX.replace(/%1/g,
        '\'' + block.id + '\''), Blockly.cake.INDENT) + branch;
  }
  if (Blockly.cake.INFINITE_LOOP_TRAP) {
    branch = Blockly.cake.INFINITE_LOOP_TRAP.replace(/%1/g,
        '\'' + block.id + '\'') + branch;
  }
  var returnValue = Blockly.cake.valueToCode(block, 'RETURN',
      Blockly.cake.ORDER_NONE) || '';
  if (returnValue) {
    returnValue = '  return ' + returnValue + ';\n';
  }
  var typePlusArgs = Blockly.Procedures.getTypePlusArgs(block);

    var code = 'void ' + funcName + '(' + typePlusArgs.join(', ') + ') {\n' +
        allDefs.replace(/\n\n+/g, '\n\n').replace(/\n*$/, '\n') + branch + returnValue + '}';
  code = Blockly.cake.scrub_(block, code);
  Blockly.cake.definitions_[funcName] = code;
  Blockly.cake.definitions_['Func_declare'+funcName] =
    'void ' + funcName + '(' + typePlusArgs.join(', ') + ');';
    if (Blockly.Blocks.checkLegalName(Blockly.Msg.PROCEDURES_ILLEGALNAME, funcName) == -1) {
        this.initName();
    }
  return null;
};

Blockly.cake['procedures_callreturn'] = function(block) {
  // Call a procedure with a return value.
  var funcName = Blockly.cake.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  var args = [];
  for (var x = 0; x < block.arguments_.length; x++) {
    args[x] = Blockly.cake.valueToCode(block, 'ARG' + x,
        Blockly.cake.ORDER_COMMA) || 'null';
  }
  var code = funcName + '(' + args.join(', ') + ')';
  return [code, Blockly.cake.ORDER_FUNCTION_CALL];
};

Blockly.cake['procedures_callnoreturn'] = function(block) {
  // Call a procedure with no return value.
  var funcName = Blockly.cake.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  var args = [];
  for (var x = 0; x < block.arguments_.length; x++) {
    args[x] = Blockly.cake.valueToCode(block, 'ARG' + x,
        Blockly.cake.ORDER_COMMA) || 'null';
  }
  var code = funcName + '(' + args.join(', ') + ');\n';
  return code;
};
