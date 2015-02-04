/**
 * @license
 * Visual Blocks Editor
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
 * @fileoverview Variable input field.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.FieldStructureMember');

goog.require('Blockly.FieldDropdown');
goog.require('Blockly.Msg');
goog.require('Blockly.Structure');
goog.require('Blockly.Field');


/**
 * Class for a variable's dropdown field.
 * @param {?string} varname The default name for the variable.  If null,
 *     a unique variable name will be generated.
 * @param {Function} opt_changeHandler A function that is executed when a new
 *     option is selected.  Its sole argument is the new option value.  Its
 *     return value is ignored.
 * @extends {Blockly.FieldDropdown}
 * @constructor
 */

Blockly.FieldStructureMember = function(varname, opt_changeHandler, block) {

  Blockly.FieldStructureMember.superClass_.constructor.call(this,
    Blockly.FieldStructureMember.dropdownCreate, opt_changeHandler, block);

  if (varname) {
    this.setValue(varname);
  } else {
    this.setValue(Blockly.Variables.generateUniqueName());
  }
};
goog.inherits(Blockly.FieldStructureMember, Blockly.FieldDropdown);

/**
 * Clone this FieldVariable.
 * @return {!Blockly.FieldVariable} The result of calling the constructor again
 *   with the current values of the arguments used during construction.
 */
Blockly.FieldStructureMember.prototype.clone = function() {
  return new Blockly.FieldStructureMember(this.getValue(), this.changeHandler_);
};

/**
 * Get the variable's name (use a variableDB to convert into a real name).
 * Unline a regular dropdown, variables are literal and have no neutral value.
 * @return {string} Current text.
 */
Blockly.FieldStructureMember.prototype.getValue = function() {
  return this.getText();
};

/**
 * Set the variable name.
 * @param {string} text New text.
 */
Blockly.FieldStructureMember.prototype.setValue = function(text) {
  this.value_ = text;
  this.setText(text);
};

/**
 * Return a sorted list of variable names for variable dropdown menus.
 * Include a special option at the end for creating a new variable name.
 * @return {!Array.<string>} Array of variable names.
 * @this {!Blockly.FieldStructureMember}
 */
Blockly.FieldStructureMember.dropdownCreate = function(block) {
  var structureList = Blockly.Structure.allStructure();
  var structureListPop = []; // 보여줄 리스트 거를 것.
  var structName = block.getInput('struct').fieldRow[0].text_;
  for (var temp = 0; temp < structureList[1].length; temp++) {
    if (structureList[1][temp][2] == structName) {
      for (var temp2 = 0; temp2 < structureList[1][temp][4].length; temp2++)
        structureListPop.push(structureList[1][temp][4][temp2])
    }
  }
  // Ensure that the currently selected variable is an option.
  var name = this.getText();
  if (name && structureListPop.indexOf(name) == -1) {
    structureListPop.push(name);
  } else structureListPop.push('--Select--');
  structureListPop.push('Itself');
  structureListPop.sort(goog.string.caseInsensitiveCompare);
  var options = [];
  for (var x = 0; x < structureListPop.length; x++) {
    options[x] = [structureListPop[x], structureListPop[x]];
  }

  // console.log(options);
  return options;

};

Blockly.FieldStructureMember.dropdownChange = function(block) {
  block.getInput('struct').removeField('Mem');
  block.getInput('struct').appendField(new Blockly.FieldStructureMember('--Select--', null, block), 'Mem')
}