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
 * @fileoverview Colour input field.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Cake.FieldColour');

goog.require('Blockly.Cake.Field');
goog.require('goog.ui.ColorPicker');


/**
 * Class for a colour input field.
 * @param {string} colour The initial colour in '#rrggbb' format.
 * @param {Function} opt_changeHandler A function that is executed when a new
 *     colour is selected.  Its sole argument is the new colour value.  Its
 *     return value becomes the selected colour, unless it is undefined, in
 *     which case the new colour stands, or it is null, in which case the change
 *     is aborted.
 * @extends {Blockly.Cake.Field}
 * @constructor
 */
Blockly.Cake.FieldColour = function(colour, opt_changeHandler) {
  Blockly.Cake.FieldColour.superClass_.constructor.call(this, '\u00A0\u00A0\u00A0');

  this.changeHandler_ = opt_changeHandler;
  this.borderRect_.style['fillOpacity'] = 1;
  // Set the initial state.
  this.setValue(colour);
};
goog.inherits(Blockly.Cake.FieldColour, Blockly.Cake.Field);

/**
 * Clone this FieldColour.
 * @return {!Blockly.Cake.FieldColour} The result of calling the constructor again
 *   with the current values of the arguments used during construction.
 */
Blockly.Cake.FieldColour.prototype.clone = function() {
  return new Blockly.Cake.FieldColour(this.getValue(), this.changeHandler_);
};

/**
 * Mouse cursor style when over the hotspot that initiates the editor.
 */
Blockly.Cake.FieldColour.prototype.CURSOR = 'default';

/**
 * Close the colour picker if this input is being deleted.
 */
Blockly.Cake.FieldColour.prototype.dispose = function() {
  Blockly.Cake.WidgetDiv.hideIfOwner(this);
  Blockly.Cake.FieldColour.superClass_.dispose.call(this);
};

/**
 * Return the current colour.
 * @return {string} Current colour in '#rrggbb' format.
 */
Blockly.Cake.FieldColour.prototype.getValue = function() {
  return this.colour_;
};

/**
 * Set the colour.
 * @param {string} colour The new colour in '#rrggbb' format.
 */
Blockly.Cake.FieldColour.prototype.setValue = function(colour) {
  this.colour_ = colour;
  this.borderRect_.style.fill = colour;
  if (this.sourceBlock_ && this.sourceBlock_.rendered) {
    // Since we're not re-rendering we need to explicitly call
    // Blockly.Cake.Realtime.blockChanged()
    Blockly.Cake.Realtime.blockChanged(this.sourceBlock_);
    this.sourceBlock_.workspace.fireChangeEvent();
  }
};

/**
 * An array of colour strings for the palette.
 * See bottom of this page for the default:
 * http://docs.closure-library.googlecode.com/git/closure_goog_ui_colorpicker.js.source.html
 * @type {!Array.<string>}
 */
Blockly.Cake.FieldColour.COLOURS = goog.ui.ColorPicker.SIMPLE_GRID_COLORS;

/**
 * Number of columns in the palette.
 */
Blockly.Cake.FieldColour.COLUMNS = 7;

/**
 * Create a palette under the colour field.
 * @private
 */
Blockly.Cake.FieldColour.prototype.showEditor_ = function() {
  Blockly.Cake.WidgetDiv.show(this, Blockly.Cake.FieldColour.widgetDispose_);
  // Create the palette using Closure.
  var picker = new goog.ui.ColorPicker();
  picker.setSize(Blockly.Cake.FieldColour.COLUMNS);
  picker.setColors(Blockly.Cake.FieldColour.COLOURS);

  // Position the palette to line up with the field.
  // Record windowSize and scrollOffset before adding the palette.
  var windowSize = goog.dom.getViewportSize();
  var scrollOffset = goog.style.getViewportPageOffset(document);
  var xy = Blockly.Cake.getAbsoluteXY_(/** @type {!Element} */ (this.borderRect_));
  var borderBBox = this.borderRect_.getBBox();
  var div = Blockly.Cake.WidgetDiv.DIV;
  picker.render(div);
  picker.setSelectedColor(this.getValue());
  // Record paletteSize after adding the palette.
  var paletteSize = goog.style.getSize(picker.getElement());

  // Flip the palette vertically if off the bottom.
  if (xy.y + paletteSize.height + borderBBox.height >=
      windowSize.height + scrollOffset.y) {
    xy.y -= paletteSize.height - 1;
  } else {
    xy.y += borderBBox.height - 1;
  }
  if (Blockly.Cake.RTL) {
    xy.x += borderBBox.width;
    xy.x -= paletteSize.width;
    // Don't go offscreen left.
    if (xy.x < scrollOffset.x) {
      xy.x = scrollOffset.x;
    }
  } else {
    // Don't go offscreen right.
    if (xy.x > windowSize.width + scrollOffset.x - paletteSize.width) {
      xy.x = windowSize.width + scrollOffset.x - paletteSize.width;
    }
  }
  Blockly.Cake.WidgetDiv.position(xy.x, xy.y, windowSize, scrollOffset);

  // Configure event handler.
  var thisObj = this;
  Blockly.Cake.FieldColour.changeEventKey_ = goog.events.listen(picker,
      goog.ui.ColorPicker.EventType.CHANGE,
      function(event) {
        var colour = event.target.getSelectedColor() || '#000000';
        Blockly.Cake.WidgetDiv.hide();
        if (thisObj.changeHandler_) {
          // Call any change handler, and allow it to override.
          var override = thisObj.changeHandler_(colour);
          if (override !== undefined) {
            colour = override;
          }
        }
        if (colour !== null) {
          thisObj.setValue(colour);
        }
      });
};

/**
 * Hide the colour palette.
 * @private
 */
Blockly.Cake.FieldColour.widgetDispose_ = function() {
  if (Blockly.Cake.FieldColour.changeEventKey_) {
    goog.events.unlistenByKey(Blockly.Cake.FieldColour.changeEventKey_);
  }
};
