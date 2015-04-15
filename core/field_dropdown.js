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
 * @fileoverview Dropdown input field.  Used for editable titles and variables.
 * In the interests of a consistent UI, the toolbox shares some functions and
 * properties with the context menu.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.FieldDropdown');

goog.require('Blockly.Field');
goog.require('goog.dom');
goog.require('goog.style');
goog.require('goog.ui.Menu');
goog.require('goog.ui.MenuItem');


/**
 * Class for an editable dropdown field.
 * @param {(!Array.<string>|!Function)} menuGenerator An array of options
 *     for a dropdown list, or a function which generates these options.
 * @param {Function} opt_changeHandler A function that is executed when a new
 *     option is selected, with the newly selected value as its sole argument.
 *     If it returns a value, that value (which must be one of the options) will
 *     become selected in place of the newly selected option, unless the return
 *     value is null, in which case the change is aborted.
 * @extends {Blockly.Field}
 * @constructor
 */
Blockly.FieldDropdown = function(menuGenerator, opt_changeHandler, block) {
  this.menuGenerator_ = menuGenerator;
  this.changeHandler_ = opt_changeHandler;
  this.trimOptions_();
  var firstTuple = this.getOptions_(block)[0];
  this.value_ = firstTuple[1];
  this.block = block;

  // Add dropdown arrow: "option ▾" (LTR) or "▾ אופציה" (RTL)
  // Android can't (in 2014) display "▾", so use "▼" instead.
  var arrowChar = goog.userAgent.ANDROID ? '\u25BC' : '\u25BE';
  this.arrow_ = Blockly.createSvgElement('tspan', {}, null);
  this.arrow_.appendChild(document.createTextNode(
      Blockly.RTL ? arrowChar + ' ' : ' ' + arrowChar));
  // Call parent's constructor.
  Blockly.FieldDropdown.superClass_.constructor.call(this, firstTuple[0]);
};
goog.inherits(Blockly.FieldDropdown, Blockly.Field);

/**
 * Horizontal distance that a checkmark ovehangs the dropdown.
 */
Blockly.FieldDropdown.CHECKMARK_OVERHANG = 25;

/**
 * Clone this FieldDropdown.
 * @return {!Blockly.FieldDropdown} The result of calling the constructor again
 *   with the current values of the arguments used during construction.
 */
Blockly.FieldDropdown.prototype.clone = function() {
  return new Blockly.FieldDropdown(this.menuGenerator_, this.changeHandler_);
};

/**
 * Mouse cursor style when over the hotspot that initiates the editor.
 */
Blockly.FieldDropdown.prototype.CURSOR = 'default';

/**
 * Create a dropdown menu under the text.
 * @private
 */
Blockly.FieldDropdown.prototype.showEditor_ = function() {
  Blockly.WidgetDiv.show(this, null);
  var thisField = this;

  function callback(e) {
    var menuItem = e.target;
    if (menuItem) {
      var value = menuItem.getValue();
      if (thisField.changeHandler_) {
        // Call any change handler, and allow it to override.
        var override = thisField.changeHandler_(value);
        if (override !== undefined) {
          value = override;
        }
      }
      if (value !== null) {
        thisField.setValue(value);
      }
    }
    Blockly.WidgetDiv.hideIfOwner(thisField);
  }

  var menu = new goog.ui.Menu();
  var options = this.getOptions_(this.block);
  for (var x = 0; x < options.length; x++) {
    var text = options[x][0];  // Human-readable text.
    var value = options[x][1]; // Language-neutral value.
    var menuItem = new goog.ui.MenuItem(text);
    menuItem.setValue(value);
    menuItem.setCheckable(true);
    menu.addChild(menuItem, true);
    menuItem.setChecked(value == this.value_);
  }
  goog.events.listen(menu, goog.ui.Component.EventType.ACTION, callback);
  // Record windowSize and scrollOffset before adding menu.
  var windowSize = goog.dom.getViewportSize();
  var scrollOffset = goog.style.getViewportPageOffset(document);
  var xy = Blockly.getAbsoluteXY_(/** @type {!Element} */ (this.borderRect_));
  var borderBBox = this.borderRect_.getBBox();
  var div = Blockly.WidgetDiv.DIV;
  menu.render(div);
  var menuDom = menu.getElement();
  Blockly.addClass_(menuDom, 'blocklyDropdownMenu');
  // Record menuSize after adding menu.
  var menuSize = goog.style.getSize(menuDom);

  // Position the menu.
  // Flip menu vertically if off the bottom.
  if (xy.y + menuSize.height + borderBBox.height >=
      windowSize.height + scrollOffset.y) {
    xy.y -= menuSize.height;
  } else {
    xy.y += borderBBox.height;
  }
  if (Blockly.RTL) {
    xy.x += borderBBox.width;
    xy.x += Blockly.FieldDropdown.CHECKMARK_OVERHANG;
    // Don't go offscreen left.
    if (xy.x < scrollOffset.x + menuSize.width) {
      xy.x = scrollOffset.x + menuSize.width;
    }
  } else {
    xy.x -= Blockly.FieldDropdown.CHECKMARK_OVERHANG;
    // Don't go offscreen right.
    if (xy.x > windowSize.width + scrollOffset.x - menuSize.width) {
      xy.x = windowSize.width + scrollOffset.x - menuSize.width;
    }
  }
  Blockly.WidgetDiv.position(xy.x, xy.y, windowSize, scrollOffset);
  menu.setAllowAutoFocus(true);
  menuDom.focus();
};

/**
 * Factor out common words in statically defined options.
 * Create prefix and/or suffix labels.
 * @private
 */
Blockly.FieldDropdown.prototype.trimOptions_ = function() {
  this.prefixField = null;
  this.suffixField = null;
  var options = this.menuGenerator_;
  if (!goog.isArray(options) || options.length < 2) {
    return;
  }
  var strings = options.map(function(t) {return t[0];});
  var shortest = Blockly.shortestStringLength(strings);
  var prefixLength = Blockly.commonWordPrefix(strings, shortest);
  var suffixLength = Blockly.commonWordSuffix(strings, shortest);
  if (!prefixLength && !suffixLength) {
    return;
  }
  if (shortest <= prefixLength + suffixLength) {
    // One or more strings will entirely vanish if we proceed.  Abort.
    return;
  }
  if (prefixLength) {
    this.prefixField = strings[0].substring(0, prefixLength - 1);
  }
  if (suffixLength) {
    this.suffixField = strings[0].substr(1 - suffixLength);
  }
  // Remove the prefix and suffix from the options.
  var newOptions = [];
  for (var x = 0; x < options.length; x++) {
    var text = options[x][0];
    var value = options[x][1];
    text = text.substring(prefixLength, text.length - suffixLength);
    newOptions[x] = [text, value];
  }
  this.menuGenerator_ = newOptions;
};

/**
 * Return a list of the options for this dropdown.
 * @return {!Array.<!Array.<string>>} Array of option tuples:
 *     (human-readable text, language-neutral name).
 * @private
 */
Blockly.FieldDropdown.prototype.getOptions_ = function(block) {
  if (goog.isFunction(this.menuGenerator_)) {
    return this.menuGenerator_.call(this, block);
  }
  return /** @type {!Array.<!Array.<string>>} */ (this.menuGenerator_);
};

/**
 * Get the language-neutral value from this dropdown menu.
 * @return {string} Current text.
 */
Blockly.FieldDropdown.prototype.getValue = function() {
  return this.value_;
};

/**
 * Set the language-neutral value for this dropdown menu.
 * @param {string} newValue New value to set.
 */
Blockly.FieldDropdown.prototype.setValue = function(newValue) {
  this.value_ = newValue;
  // Look up and display the human-readable text.
  var options = this.getOptions_();
  for (var x = 0; x < options.length; x++) {
    // Options are tuples of human-readable text and language-neutral values.
    if (options[x][1] == newValue) {
      this.setText(options[x][0]);
      return;
    }
  }
  // Value not found.  Add it, maybe it will become valid once set
  // (like variable names).
  this.setText(newValue);
};

/**
 * Set the text in this field.  Trigger a rerender of the source block.
 * @param {?string} text New text.
 */
Blockly.FieldDropdown.prototype.setText = function(text) {
  if (this.sourceBlock_) {
    // Update arrow's colour.
    this.arrow_.style.fill = Blockly.makeColour(this.sourceBlock_.getColour());
  }
  if (text === null || text === this.text_) {
    // No change if null.
    return;
  }
  this.text_ = text;
  this.updateTextNode_();

  // Insert dropdown arrow.
  if (Blockly.RTL) {
    this.textElement_.insertBefore(this.arrow_, this.textElement_.firstChild);
  } else {
    this.textElement_.appendChild(this.arrow_);
  }

  if (this.sourceBlock_ && this.sourceBlock_.rendered) {
    this.sourceBlock_.render();
    this.sourceBlock_.bumpNeighbours_();
    this.sourceBlock_.workspace.fireChangeEvent();
  }
};

/**
 * Close the dropdown menu if this input is being deleted.
 */
Blockly.FieldDropdown.prototype.dispose = function() {
  Blockly.WidgetDiv.hideIfOwner(this);
  Blockly.FieldDropdown.superClass_.dispose.call(this);
};


/**
 * get type/dimension/ from variables name
 * @param blockVars: name of current block
 * @param option: wanted value -> type = 0, dimension = 5
 * @returns {*}
 */
Blockly.FieldDropdown.prototype.getTypefromVars = function(blockVars, option) {

    var wantedValue;
    var variableList = Blockly.Variables.allVariables();

    for (var temp = 0; temp < variableList.length; temp++) {
        if (variableList[temp][2] == blockVars) {
            wantedValue = variableList[temp][option];
        }
    }
    return wantedValue;
};


/* 너무 지저분 해 ~_~*/
/**
 * get parent type of the current block
 * @param curBlock : current block
 * @param strDist : string type of dist('variables', 'variables_pointer', 'varibles_array')
 * @returns {*}
 */
Blockly.FieldDropdown.prototype.getParentType = function(curBlock, strDist) {

    var parentType = null;


    if (curBlock.getParent()) {
        var parent = curBlock.getParent();


        // control_for
        if ((curBlock.type == 'controls_for')) {
            return null;
        }

        // function call block
        if ((parent.type.match('procedures_callreturn'))) {
            parent = parent.getParent();
        }

        // type 1
        // VARIABLE setter + (* POINTER getter)
        // POINTER setter + (& VARIABLE getter)
        if (((parent.type == (strDist + '_*' )) && (parent.getParent().type == 'variables_set') )||
            ((parent.type == (strDist + '_pointer_&')) && parent.getParent().type == (strDist + '_pointer_set'))) {
            var parentVars = parent.getParent().getVars();
            parentType = this.getTypefromVars(parentVars, 0);

        }

        // type 2
        // VARIABLE declare + (* POINTER getter),
        // POINTER declare + (& VARIABLE getter)
        else if (((parent.type == (strDist + '_pointer_&')) || (parent.type == (strDist + '_pointer_*')))
            && parent.getParent()) {

            if (parent.getParent().getVars()){
                parentType = parent.getParent().getTypes();

            }
        }

        // type 3
        // DOUBLE POINTER declare + (& POINTER getter)
        // POINTER declare + (* DOUBLE POINTER getter)
        else if (((parent.type == (strDist + '_&')) || (parent.type == (strDist + '_*'))) &&
            (parent.getParent().type == (strDist + '_declare')))
        {
            var ptrSpec = parent.getParent().getSpec();
            // DOUBLE POINTER declare + (& POINTER getter)
            if ((ptrSpec == '**') && (parent.type == (strDist + '_&'))) {
                parentType = parent.getParent().getType();

            }
            // POINTER declare + (* DOUBLE POINTER getter)
            else if ((ptrSpec == '*') && (parent.type == (strDist + '_*')))
            {
                parentType = parent.getParent().getType();
                parentType = 'db' + parentType;
            }
        }

        // type 4
        // DOUBLE POINTER setter + (& Pointer getter)
        // POINTER setter + (* DOUBLE POINTER getter)
        else if ((parent.type == (strDist + '_&') || (parent.type == (strDist + '_*'))) &&
            (parent.getParent().type ==  (strDist + '_set'))){

            var parentVars = parent.getParent().getVars();
            var dimension = this.getTypefromVars(parentVars, 5);
            parentType = this.getTypefromVars(parentVars, 0);

            // DOUBLE POINTER setter + (& Pointer getter)
            if(dimension == '**' && (parent.type == (strDist + '_&')) ){
                parentType = parentType.replace("db", "");
            }
            // POINTER setter + (* DOUBLE POINTER getter)
            else if (dimension == '*' && (parent.type == (strDist + '_*'))) {
                parentType = 'db' + parentType;
            }

        }

        // type 4
        // POINTER setter + malloc
        // setter + getter (any type)
        else if (((curBlock.type =='library_stdlib_malloc') ||(curBlock.type == (strDist+'_get')))
                && (parent.type.search('_set') > 0)) {
            var ParentVars = parent.getVars();

            // when pointer_set block
            if (strDist == 'variables_pointer'){
                ParentVars = ParentVars.toString().replace("* ", "");
            }
            parentType = this.getTypefromVars(ParentVars, 0);
        }


        // type 5
        // declare block + get block (any type)
        else if (((curBlock.type != (strDist+'_set')) && parent.type.match('_declare'))) {
            if (parent.getDeclare()) {
                parentType = parent.getTypes();
            }
        }

        // type 6
        // main block: int
        else if ((parent.type.match('main_block'))) {
            parentType = 'int';
        }

        //type 7
        // return block in function block
        else if((parent.type.match('procedures_return'))) {
            parentType = parent.getType();
        }

    }
    return parentType;
};

/**
 * make dropdown list with adequate type
 * @param block
 * @param varDist - variable dist~(0:define / 1:variable / 2:pointer / 3:array)
 * charDist : character type of dist('d', 'v', 'p', 'a')
 * strDist: string type of dist - for block type ('define', 'variables', 'variables_pointer', 'variables_array')
 * @returns {Array}
 */

Blockly.FieldDropdown.prototype.listCreate = function(block, varDist) {
    var variableList = Blockly.Variables.allVariables();
    var variableListPop = []; // 보여줄 리스트 거를 것.
    var thisPosition = block.getRelativeToSurfaceXY().y;

    var charDist, strDist;
    switch(varDist) {
        case 0:
            charDist = 'd';
            strDist = 'define';
            break;
        case 1:
            charDist = 'v';
            strDist = 'variables';
            break;
        case 2:
            charDist = 'p';
            strDist = 'variables_pointer';
            break;
        case 3:
            charDist = 'a';
            strDist = 'variables_array';
            break;
        default:
            break;
    }

    var parentType = Blockly.FieldDropdown.prototype.getParentType(block, strDist);

    while((block.getSurroundParent()) && (block.getSurroundParent().type != 'main_block') &&
    (block.getSurroundParent().type != 'procedures_defnoreturn') && (block.getSurroundParent().type != 'procedures_defreturn')){
        block = block.getSurroundParent();
    }
    var scope;
    if(block.getSurroundParent()) {
        scope = block.getSurroundParent().getName();
    }

    for (var temp = 0; temp < variableList.length; temp++){
        if(variableList[temp][1] == charDist){
            if(variableList[temp][3] == scope || variableList[temp][3] == "Global"){
                if(variableList[temp][4] < (thisPosition - 10)) {
                    if (parentType != null) {
                        if (variableList[temp][0] == parentType) {
                            variableListPop.push(variableList[temp][2]);
                        }
                    }
                    else {
                        variableListPop.push(variableList[temp][2]);
                    }
                }
            }
        }
    }

    return variableListPop;
};