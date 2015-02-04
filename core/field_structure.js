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

goog.provide('Blockly.FieldStructure');

goog.require('Blockly.FieldDropdown');
goog.require('Blockly.Msg');
goog.require('Blockly.Structure');


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

Blockly.FieldStructure = function(varname, opt_changeHandler) {

  Blockly.FieldStructure.superClass_.constructor.call(this,
    Blockly.FieldStructure.dropdownCreate, opt_changeHandler);

  if (varname) {
    this.setValue(varname);
  } else {
    this.setValue(Blockly.Variables.generateUniqueName());
  }
};
goog.inherits(Blockly.FieldStructure, Blockly.FieldDropdown);

/**
 * Clone this FieldVariable.
 * @return {!Blockly.FieldVariable} The result of calling the constructor again
 *   with the current values of the arguments used during construction.
 */
Blockly.FieldStructure.prototype.clone = function() {
  return new Blockly.FieldStructure(this.getValue(), this.changeHandler_);
};

/**
 * Get the variable's name (use a variableDB to convert into a real name).
 * Unline a regular dropdown, variables are literal and have no neutral value.
 * @return {string} Current text.
 */
Blockly.FieldStructure.prototype.getValue = function() {
  return this.getText();
};

/**
 * Set the variable name.
 * @param {string} text New text.
 */
Blockly.FieldStructure.prototype.setValue = function(text) {
  this.value_ = text;
  this.setText(text);
};

/**
 * Return a sorted list of variable names for variable dropdown menus.
 * Include a special option at the end for creating a new variable name.
 * @return {!Array.<string>} Array of variable names.
 * @this {!Blockly.FieldStructure}
 */
Blockly.FieldStructure.dropdownCreate = function() {
  var structureList = Blockly.Structure.allStructure();
  var structureListPop = []; // 보여줄 리스트 거를 것.

  for (var temp = 0; temp < structureList[0].length; temp++) {
    if (structureList[0][temp][0] == 'sd')
      structureListPop.push(structureList[0][temp][1]);
  }

  // Ensure that the currently selected variable is an option.
  var name = this.getText();
  if (name && structureListPop.indexOf(name) == -1) {
    structureListPop.push(name);
  } else structureListPop.push('-Type-');
  structureListPop.sort(goog.string.caseInsensitiveCompare);

  var options = [];
  for (var x = 0; x < structureListPop.length; x++) {
    options[x] = [structureListPop[x], structureListPop[x]];
  }
  return options;

};
