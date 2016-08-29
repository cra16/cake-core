/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2013 Google Inc.
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
 * @fileoverview A div that floats on top of Blockly.Cake.  This singleton contains
 *     temporary HTML UI widgets that the user is currently interacting with.
 *     E.g. text input areas, colour pickers, context menus.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Cake.WidgetDiv');

goog.require('Blockly.Cake.Css');
goog.require('goog.dom');


/**
 * The HTML container.  Set once by inject.js's Blockly.Cake.createDom_.
 * @type Element
 */
Blockly.Cake.WidgetDiv.DIV = null;

/**
 * The object currently using this container.
 * @private
 * @type Object
 */
Blockly.Cake.WidgetDiv.owner_ = null;

/**
 * Optional cleanup function set by whichever object uses the widget.
 * @private
 * @type Function
 */
Blockly.Cake.WidgetDiv.dispose_ = null;

/**
 * Initialize and display the widget div.  Close the old one if needed.
 * @param {!Object} newOwner The object that will be using this container.
 * @param {Function} dispose Optional cleanup function to be run when the widget
 *   is closed.
 */
Blockly.Cake.WidgetDiv.show = function(newOwner, dispose) {
  Blockly.Cake.WidgetDiv.hide();
  Blockly.Cake.WidgetDiv.owner_ = newOwner;
  Blockly.Cake.WidgetDiv.dispose_ = dispose;
  Blockly.Cake.WidgetDiv.DIV.style.display = 'block';
};

/**
 * Destroy the widget and hide the div.
 */
Blockly.Cake.WidgetDiv.hide = function() {
  if (Blockly.Cake.WidgetDiv.owner_) {
    Blockly.Cake.WidgetDiv.DIV.style.display = 'none';
    Blockly.Cake.WidgetDiv.dispose_ && Blockly.Cake.WidgetDiv.dispose_();
    Blockly.Cake.WidgetDiv.owner_ = null;
    Blockly.Cake.WidgetDiv.dispose_ = null;
    goog.dom.removeChildren(Blockly.Cake.WidgetDiv.DIV);
  }
};

/**
 * Is the container visible?
 * @return {boolean} True if visible.
 */
Blockly.Cake.WidgetDiv.isVisible = function() {
  return !!Blockly.Cake.WidgetDiv.owner_;
};

/**
 * Destroy the widget and hide the div if it is being used by the specified
 *   object.
 * @param {!Object} oldOwner The object that was using this container.
 */
Blockly.Cake.WidgetDiv.hideIfOwner = function(oldOwner) {
  if (Blockly.Cake.WidgetDiv.owner_ == oldOwner) {
    Blockly.Cake.WidgetDiv.hide();
  }
};

/**
 * Position the widget at a given location.  Prevent the widget from going
 * offscreen top or left (right in RTL).
 * @param {number} anchorX Horizontal location (window coorditates, not body).
 * @param {number} anchorY Vertical location (window coorditates, not body).
 * @param {!goog.math.Size} windowSize Height/width of window.
 * @param {!goog.math.Coordinate} scrollOffset X/y of window scrollbars.
 */
Blockly.Cake.WidgetDiv.position = function(anchorX, anchorY, windowSize,
                                      scrollOffset) {
  // Don't let the widget go above the top edge of the window.
  if (anchorY < scrollOffset.y) {
    anchorY = scrollOffset.y;
  }
  if (Blockly.Cake.RTL) {
    // Don't let the menu go right of the right edge of the window.
    if (anchorX > windowSize.width + scrollOffset.x) {
      anchorX = windowSize.width + scrollOffset.x;
    }
  } else {
    // Don't let the widget go left of the left edge of the window.
    if (anchorX < scrollOffset.x) {
      anchorX = scrollOffset.x;
    }
  }
  Blockly.Cake.WidgetDiv.DIV.style.left = anchorX + 'px';
  Blockly.Cake.WidgetDiv.DIV.style.top = anchorY + 'px';
};
