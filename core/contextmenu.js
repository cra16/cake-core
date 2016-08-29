/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2011 Google Inc.
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
 * @fileoverview Functionality for the right-click context menus.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Cake.ContextMenu');

goog.require('goog.dom');
goog.require('goog.style');
goog.require('goog.ui.Menu');
goog.require('goog.ui.MenuItem');


/**
 * Which block is the context menu attached to?
 * @type {Blockly.Cake.Block}
 */
Blockly.Cake.ContextMenu.currentBlock = null;

/**
 * Construct the menu based on the list of options and show the menu.
 * @param {!Event} e Mouse event.
 * @param {!Array.<!Object>} options Array of menu options.
 */
Blockly.Cake.ContextMenu.show = function(e, options) {
  Blockly.Cake.WidgetDiv.show(Blockly.Cake.ContextMenu, null);
  if (!options.length) {
    Blockly.Cake.ContextMenu.hide();
    return;
  }
  /* Here's what one option object looks like:
    {text: 'Make It So',
     enabled: true,
     callback: Blockly.Cake.MakeItSo}
  */
  var menu = new goog.ui.Menu();
  for (var x = 0, option; option = options[x]; x++) {
    var menuItem = new goog.ui.MenuItem(option.text);
    menu.addChild(menuItem, true);
    menuItem.setEnabled(option.enabled);
    if (option.enabled) {
      var evtHandlerCapturer = function(callback) {
        return function() { Blockly.Cake.doCommand(callback); };
      };
      goog.events.listen(menuItem, goog.ui.Component.EventType.ACTION,
                         evtHandlerCapturer(option.callback));
    }
  }
  goog.events.listen(menu, goog.ui.Component.EventType.ACTION,
                     Blockly.Cake.ContextMenu.hide);
  // Record windowSize and scrollOffset before adding menu.
  var windowSize = goog.dom.getViewportSize();
  var scrollOffset = goog.style.getViewportPageOffset(document);
  var div = Blockly.Cake.WidgetDiv.DIV;
  menu.render(div);
  var menuDom = menu.getElement();
  Blockly.Cake.addClass_(menuDom, 'blocklyContextMenu');
  // Record menuSize after adding menu.
  var menuSize = goog.style.getSize(menuDom);

  // Position the menu.
  var x = e.clientX + scrollOffset.x;
  var y = e.clientY + scrollOffset.y;
  // Flip menu vertically if off the bottom.
  if (e.clientY + menuSize.height >= windowSize.height) {
    y -= menuSize.height;
  }
  // Flip menu horizontally if off the edge.
  if (Blockly.Cake.RTL) {
    if (menuSize.width >= e.clientX) {
      x += menuSize.width;
    }
  } else {
    if (e.clientX + menuSize.width >= windowSize.width) {
      x -= menuSize.width;
    }
  }
  Blockly.Cake.WidgetDiv.position(x, y, windowSize, scrollOffset);

  menu.setAllowAutoFocus(true);
  // 1ms delay is required for focusing on context menus because some other
  // mouse event is still waiting in the queue and clears focus.
  setTimeout(function() {menuDom.focus();}, 1);
  Blockly.Cake.ContextMenu.currentBlock = null;  // May be set by Blockly.Cake.Block.
};

/**
 * Hide the context menu.
 */
Blockly.Cake.ContextMenu.hide = function() {
  Blockly.Cake.WidgetDiv.hideIfOwner(Blockly.Cake.ContextMenu);
  Blockly.Cake.ContextMenu.currentBlock = null;
};

/**
 * Create a callback function that creates and configures a block,
 *   then places the new block next to the original.
 * @param {!Blockly.Cake.Block} block Original block.
 * @param {!Element} xml XML representation of new block.
 * @return {!Function} Function that creates a block.
 */
Blockly.Cake.ContextMenu.callbackFactory = function(block, xml) {
  return function() {
    var newBlock = Blockly.Cake.Xml.domToBlock(block.workspace, xml);
    // Move the new block next to the old block.
    var xy = block.getRelativeToSurfaceXY();
    if (Blockly.Cake.RTL) {
      xy.x -= Blockly.Cake.SNAP_RADIUS;
    } else {
      xy.x += Blockly.Cake.SNAP_RADIUS;
    }
    xy.y += Blockly.Cake.SNAP_RADIUS * 2;
    newBlock.moveBy(xy.x, xy.y);
    newBlock.select();
  };
};
