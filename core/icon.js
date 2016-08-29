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
 * @fileoverview Object representing an icon on a block.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Cake.Icon');

/**
 * Class for an icon.
 * @param {Blockly.Cake.Block} block The block associated with this icon.
 * @constructor
 */
Blockly.Cake.Icon = function(block) {
  this.block_ = block;
};

/**
 * Radius of icons.
 */
Blockly.Cake.Icon.RADIUS = 8;

/**
 * Bubble UI (if visible).
 * @type {Blockly.Cake.Bubble}
 * @private
 */
Blockly.Cake.Icon.prototype.bubble_ = null;

/**
 * Absolute X coordinate of icon's center.
 * @private
 */
Blockly.Cake.Icon.prototype.iconX_ = 0;

/**
 * Absolute Y coordinate of icon's centre.
 * @private
 */
Blockly.Cake.Icon.prototype.iconY_ = 0;

/**
 * Create the icon on the block.
 * @private
 */
Blockly.Cake.Icon.prototype.createIcon_ = function() {
  /* Here's the markup that will be generated:
  <g class="blocklyIconGroup"></g>
  */
  this.iconGroup_ = Blockly.Cake.createSvgElement('g', {}, null);
  this.block_.getSvgRoot().appendChild(this.iconGroup_);
  Blockly.Cake.bindEvent_(this.iconGroup_, 'mouseup', this, this.iconClick_);
  this.updateEditable();
};

/**
 * Dispose of this icon.
 */
Blockly.Cake.Icon.prototype.dispose = function() {
  // Dispose of and unlink the icon.
  goog.dom.removeNode(this.iconGroup_);
  this.iconGroup_ = null;
  // Dispose of and unlink the bubble.
  this.setVisible(false);
  this.block_ = null;
};

/**
 * Add or remove the UI indicating if this icon may be clicked or not.
 */
Blockly.Cake.Icon.prototype.updateEditable = function() {
  if (!this.block_.isInFlyout) {
    Blockly.Cake.addClass_(/** @type {!Element} */ (this.iconGroup_),
                      'blocklyIconGroup');
  } else {
    Blockly.Cake.removeClass_(/** @type {!Element} */ (this.iconGroup_),
                         'blocklyIconGroup');
  }
};

/**
 * Is the associated bubble visible?
 * @return {boolean} True if the bubble is visible.
 */
Blockly.Cake.Icon.prototype.isVisible = function() {
  return !!this.bubble_;
};

/**
 * Clicking on the icon toggles if the bubble is visible.
 * @param {!Event} e Mouse click event.
 * @private
 */
Blockly.Cake.Icon.prototype.iconClick_ = function(e) {
  if (!this.block_.isInFlyout) {
    this.setVisible(!this.isVisible());
  }
};

/**
 * Change the colour of the associated bubble to match its block.
 */
Blockly.Cake.Icon.prototype.updateColour = function() {
  if (this.isVisible()) {
    var hexColour = Blockly.Cake.makeColour(this.block_.getColour());
    this.bubble_.setColour(hexColour);
  }
};

/**
 * Render the icon.
 * @param {number} cursorX Horizontal offset at which to position the icon.
 * @return {number} Horizontal offset for next item to draw.
 */
Blockly.Cake.Icon.prototype.renderIcon = function(cursorX) {
  if (this.block_.isCollapsed()) {
    this.iconGroup_.setAttribute('display', 'none');
    return cursorX;
  }
  this.iconGroup_.setAttribute('display', 'block');

  var TOP_MARGIN = 5;
  var diameter = 2 * Blockly.Cake.Icon.RADIUS;
  if (Blockly.Cake.RTL) {
    cursorX -= diameter;
  }
  this.iconGroup_.setAttribute('transform',
      'translate(' + cursorX + ', ' + TOP_MARGIN + ')');
  this.computeIconLocation();
  if (Blockly.Cake.RTL) {
    cursorX -= Blockly.Cake.BlockSvg.SEP_SPACE_X;
  } else {
    cursorX += diameter + Blockly.Cake.BlockSvg.SEP_SPACE_X;
  }
  return cursorX;
};

/**
 * Notification that the icon has moved.  Update the arrow accordingly.
 * @param {number} x Absolute horizontal location.
 * @param {number} y Absolute vertical location.
 */
Blockly.Cake.Icon.prototype.setIconLocation = function(x, y) {
  this.iconX_ = x;
  this.iconY_ = y;
  if (this.isVisible()) {
    this.bubble_.setAnchorLocation(x, y);
  }
};

/**
 * Notification that the icon has moved, but we don't really know where.
 * Recompute the icon's location from scratch.
 */
Blockly.Cake.Icon.prototype.computeIconLocation = function() {
  // Find coordinates for the centre of the icon and update the arrow.
  var blockXY = this.block_.getRelativeToSurfaceXY();
  var iconXY = Blockly.Cake.getRelativeXY_(this.iconGroup_);
  var newX = blockXY.x + iconXY.x + Blockly.Cake.Icon.RADIUS;
  var newY = blockXY.y + iconXY.y + Blockly.Cake.Icon.RADIUS;
  if (newX !== this.iconX_ || newY !== this.iconY_) {
    this.setIconLocation(newX, newY);
  }
};

/**
 * Returns the center of the block's icon relative to the surface.
 * @return {!Object} Object with x and y properties.
 */
Blockly.Cake.Icon.prototype.getIconLocation = function() {
  return {x: this.iconX_, y: this.iconY_};
};
