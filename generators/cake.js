/**
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * http://blockly.googlecode.com/
 * and 2014 Massachusetts Institute of Technology
 * http://zerorobotics.org/
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
 * @fileoverview Helper functions for generating C++ for blocks. Modified from the standard Blockly cake generator. 
 * @author fraser@google.com (Neil Fraser), dininno@mit.edu (Ethan DiNinno)
 */
'use strict';

goog.provide('Blockly.cake');

goog.require('Blockly.Generator');


Blockly.cake = new Blockly.Generator('cake');

//List of accepted variable types for dropdowns
Blockly.cake.C_VARIABLE_TYPES =
  [['float', 'float'],
   ['int', 'int'],
   ['unsigned int', 'unsigned int'],
   ['short', 'short'],
   ['unsigned short', 'unsigned short'],
   ['bool', 'bool']];
   
Blockly.cake.C_GLOBAL_VARS = [];

/**
 * List of illegal variable names.
 * This is not intended to be a security feature.  Blockly is 100% client-side,
 * so bypassing this list is trivial.  This is intended to prevent users from
 * accidentally clobbering a built-in object or function.
 * @private
 */
Blockly.cake.addReservedWords(
  ',alignas,alignof,and,and_eq,asm,auto,bitand,bitor,bool,break,case,catch,char,char16_t,char32_t,class,compl,const,constexpr,const_cast,continue,decltype,default,delete,do,double,dynamic_cast,else,enum,explicit,export,extern,false,float,for,friend,goto,if,inline,int,long,mutable,namespace,new,noexcept,not,not_eq,nullptr,operator,or,or_eq,private,protected,public,register,reinterpret_cast,return,short,signed,sizeof,static,static_assert,static_cast,struct,switch,template,this,thread_local,throw,true,try,typedef,typeid,typename,union,unsigned,using,virtual,void,volatile,wchar_t,while,xor,xor_eq,posix,'
  // http://en.cppreference.com/w/cpp/keyword
  + 'game,api,PI,PI2,PI3,PI4,DEG2RAD,RAD2DEG,ZRMS,ZR2D,ZR3D,ALLIANCE' //TODO: add ZR #defines to list
);

/**
 * Order of operation ENUMs.
 * http://en.cppreference.com/w/cpp/language/operator_precedence
 */
Blockly.cake.ORDER_ATOMIC = 0;         // 0 "" ...
Blockly.cake.ORDER_MEMBER = 2;         // . []
Blockly.cake.ORDER_FUNCTION_CALL = 2;  // ()
Blockly.cake.ORDER_INCREMENT = 3;      // ++
Blockly.cake.ORDER_DECREMENT = 3;      // --
Blockly.cake.ORDER_LOGICAL_NOT = 3;    // !
Blockly.cake.ORDER_BITWISE_NOT = 3;    // ~
Blockly.cake.ORDER_UNARY_PLUS = 3;     // +
Blockly.cake.ORDER_UNARY_NEGATION = 3; // -
Blockly.cake.ORDER_MULTIPLICATION = 5; // *
Blockly.cake.ORDER_DIVISION = 5;       // /
Blockly.cake.ORDER_MODULUS = 5;        // %
Blockly.cake.ORDER_ADDITION = 6;       // +
Blockly.cake.ORDER_SUBTRACTION = 6;    // -
Blockly.cake.ORDER_BITWISE_SHIFT = 7;  // << >>
Blockly.cake.ORDER_RELATIONAL = 8;     // < <= > >=
Blockly.cake.ORDER_EQUALITY = 9;       // == != 
Blockly.cake.ORDER_BITWISE_AND = 10;   // &
Blockly.cake.ORDER_BITWISE_XOR = 11;   // ^
Blockly.cake.ORDER_BITWISE_OR = 12;    // |
Blockly.cake.ORDER_LOGICAL_AND = 13;   // &&
Blockly.cake.ORDER_LOGICAL_OR = 14;    // ||
Blockly.cake.ORDER_CONDITIONAL = 15;   // ?:
Blockly.cake.ORDER_ASSIGNMENT = 15;    // = += -= *= /= %= <<= >>= ...
Blockly.cake.ORDER_COMMA = 17;         // ,
Blockly.cake.ORDER_NONE = 99;          // (...)

/**
 * Arbitrary code to inject into locations that risk causing infinite loops.
 * Any instances of '%1' will be replaced by the block ID that failed.
 * E.g. '  checkTimeout(%1);\n'
 * @type ?string
 */
Blockly.cake.INFINITE_LOOP_TRAP = null;

/**
 * Initialise the database of variable names.
 */
Blockly.cake.init = function() {
  // Create a dictionary of definitions to be printed before the code.
  Blockly.cake.definitions_ = Object.create(null);
  // Create a dictionary mapping desired function names in definitions_
  // to actual function names (to avoid collisions with user functions).
  Blockly.cake.functionNames_ = Object.create(null);

  if (Blockly.Variables) {
    if (!Blockly.cake.variableDB_) {
      Blockly.cake.variableDB_ =
          new Blockly.Names(Blockly.cake.RESERVED_WORDS_);
    } else {
      Blockly.cake.variableDB_.reset();
    }

    var defvars = [];
    var variables = Blockly.Variables.allVariables();
    for (var x = 0; x < variables.length; x++) {
      defvars[x] = 'var ' +
          Blockly.cake.variableDB_.getName(variables[x],
          Blockly.Variables.NAME_TYPE) + ';';
    }
    Blockly.cake.definitions_['variables'] = defvars.join('\n');
  }
};

/**
 * Prepend the generated code with the variable definitions.
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
Blockly.cake.finish = function(code) {
  // Indent every line.
  if (code) {
    code = this.prefixLines(code, Blockly.cake.INDENT);
  }
  code = 'int main() {\n' + code + '}';

  // Convert the definitions dictionary into a list.
  var includes = [];
  var definitions = [];
  for (var name in Blockly.cake.definitions_) {
    var def = Blockly.cake.definitions_[name];
    if (def.match(/^include\s/)) {
      includes.push(def);
    } else {
      definitions.push(def);
    }
  }
  //imports--> #include
  //definitions--> function def, #def
  var allDefs = includes.join('\n') + '\n\n' + definitions.join('\n\n');
  return allDefs.replace(/\n\n+/g, '\n\n').replace(/\n*$/, '\n\n\n') + code;
}

Blockly.cake.finishFull = function(code) {
  // Convert the definitions dictionary into a list.
  var definitions = [];
  for (var name in Blockly.cake.definitions_) {
    definitions.push(Blockly.cake.definitions_[name]);
  }
  code = definitions.join('\n\n') + '\n\n' + 
  'void setPos(float x, float y, float z) {\n\tfloat pos[3];\n\tpos[0] = x; pos[1] = y; pos[2] = z;\n\tapi.setPositionTarget(pos);\n}'
  + '\n\n' + code;
  //HACK: Make sure the code contains an init function in case the init page has not been properly initialized
  if(code.indexOf('//Begin page init\nvoid init() {\n') === -1) {
    code = 'void init() {}\n' + code;
  }
  return code;
};

/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything.  A trailing semicolon is needed to make this legal.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
Blockly.cake.scrubNakedValue = function(line) {
  //ZR editor should ignore all blocks that are not children of the page's function block
  return '';
};

/**
 * Encode a string as a properly escaped cake string, complete with
 * quotes.
 * @param {string} string Text to encode.
 * @return {string} cake string.
 * @private
 */
Blockly.cake.quote_ = function(string) {
  // TODO: This is a quick hack.  Replace with goog.string.quote
  string = string.replace(/\\/g, '\\\\')
                 .replace(/\n/g, '\\\n')
                 .replace(/'/g, '\\\'');
  return string; //Do not add quotes so printf formatting can be used
};

/**
 * Common tasks for generating cake from blocks.
 * Handles comments for the specified block and any connected value blocks.
 * Calls any statements following this block.
 * @param {!Blockly.Block} block The current block.
 * @param {string} code The cake code created for this block.
 * @return {string} cake code with comments and subsequent blocks added.
 * @this {Blockly.CodeGenerator}
 * @private
 */
Blockly.cake.scrub_ = function(block, code) {
  if (code === null) {
    // Block has handled code generation itself.
    return '';
  }
  var commentCode = '';
  // Only collect comments for blocks that aren't inline.
  if (!block.outputConnection || !block.outputConnection.targetConnection) {
    // Collect comment for this block.
    var comment = block.getCommentText();
    if (comment) {
      commentCode += this.prefixLines(comment, '// ') + '\n';
    }
    // Collect comments for all value arguments.
    // Don't collect comments for nested statements.
    for (var x = 0; x < block.inputList.length; x++) {
      if (block.inputList[x].type == Blockly.INPUT_VALUE) {
        var childBlock = block.inputList[x].connection.targetBlock();
        if (childBlock) {
          var comment = this.allNestedComments(childBlock);
          if (comment) {
            commentCode += this.prefixLines(comment, '// ');
          }
        }
      }
    }
  }
  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  var nextCode = this.blockToCode(nextBlock);
  return commentCode + code + nextCode;
};
