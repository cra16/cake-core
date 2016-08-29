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
 * @fileoverview Toolbox from whence to create blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Cake.Toolbox');

goog.require('Blockly.Cake.Flyout');
goog.require('goog.events.BrowserFeature');
goog.require('goog.html.SafeHtml');
goog.require('goog.style');
goog.require('goog.ui.tree.TreeControl');
goog.require('goog.ui.tree.TreeNode');


/**
 * Width of the toolbox.
 * @type {number}
 */
Blockly.Cake.Toolbox.width = 0;

/**
 * The SVG group currently selected.
 * @type {SVGGElement}
 * @private
 */
Blockly.Cake.Toolbox.selectedOption_ = null;

/**
 * Configuration constants for Closure's tree UI.
 * @type {Object.<string,*>}
 * @const
 * @private
 */
Blockly.Cake.Toolbox.CONFIG_ = {
  indentWidth: 19,
  cssRoot: 'blocklyTreeRoot',
  cssHideRoot: 'blocklyHidden',
  cssItem: '',
  cssTreeRow: 'blocklyTreeRow',
  cssItemLabel: 'blocklyTreeLabel',
  cssTreeIcon: 'blocklyTreeIcon',
  cssExpandedFolderIcon: 'blocklyTreeIconOpen',
  cssFileIcon: 'blocklyTreeIconNone',
  cssSelectedRow: 'blocklyTreeSelected'
};

/**
 * Creates the toolbox's DOM.  Only needs to be called once.
 * @param {!Element} svg The top-level SVG element.
 * @param {!Element} container The SVG's HTML parent element.
 */
Blockly.Cake.Toolbox.createDom = function(svg, container) {
  // Create an HTML container for the Toolbox menu.
  Blockly.Cake.Toolbox.HtmlDiv = goog.dom.createDom('div', 'blocklyToolboxDiv');
  Blockly.Cake.Toolbox.HtmlDiv.setAttribute('dir', Blockly.Cake.RTL ? 'RTL' : 'LTR');
  container.appendChild(Blockly.Cake.Toolbox.HtmlDiv);

  /**
   * @type {!Blockly.Cake.Flyout}
   * @private
   */
  Blockly.Cake.Toolbox.flyout_ = new Blockly.Cake.Flyout();
  svg.appendChild(Blockly.Cake.Toolbox.flyout_.createDom());

  // Clicking on toolbar closes popups.
  Blockly.Cake.bindEvent_(Blockly.Cake.Toolbox.HtmlDiv, 'mousedown', null,
      function(e) {
        if (Blockly.Cake.isRightButton(e) || e.target == Blockly.Cake.Toolbox.HtmlDiv) {
          // Close flyout.
          Blockly.Cake.hideChaff(false);
        } else {
          // Just close popups.
          Blockly.Cake.hideChaff(true);
        }
      });
};

/**
 * Initializes the toolbox.
 */
Blockly.Cake.Toolbox.init = function() {
    Blockly.Cake.Toolbox.CONFIG_['cleardotPath'] =
        Blockly.Cake.pathToBlockly + 'media/1x1.gif';
    Blockly.Cake.Toolbox.CONFIG_['cssCollapsedFolderIcon'] =
        'blocklyTreeIconClosed' + (Blockly.Cake.RTL ? 'Rtl' : 'Ltr');
    var tree = new Blockly.Cake.Toolbox.TreeControl(goog.html.SafeHtml.EMPTY,
        Blockly.Cake.Toolbox.CONFIG_);
    Blockly.Cake.Toolbox.tree_ = tree;
    tree.setShowRootNode(false);
    tree.setShowLines(false);
    tree.setShowExpandIcons(false);
    tree.setSelectedItem(null);

    Blockly.Cake.Toolbox.HtmlDiv.style.display = 'block';
    Blockly.Cake.Toolbox.flyout_.init(Blockly.Cake.mainWorkspace, true);
    Blockly.Cake.Toolbox.populate_();
    tree.render(Blockly.Cake.Toolbox.HtmlDiv);

    // If the document resizes, reposition the toolbox.
    goog.events.listen(window, goog.events.EventType.RESIZE,
        Blockly.Cake.Toolbox.position_);
    Blockly.Cake.Toolbox.position_();
};

/**
 * Updates the toolbox.
 */
Blockly.Cake.Toolbox.update = function() {
    //Blockly.Cake.Toolbox.clearData();
    Blockly.Cake.Toolbox.CONFIG_['cleardotPath'] =
        Blockly.Cake.pathToBlockly + 'media/1x1.gif';
    Blockly.Cake.Toolbox.CONFIG_['cssCollapsedFolderIcon'] =
        'blocklyTreeIconClosed' + (Blockly.Cake.RTL ? 'Rtl' : 'Ltr');
    var tree = new Blockly.Cake.Toolbox.TreeControl(goog.html.SafeHtml.EMPTY,
        Blockly.Cake.Toolbox.CONFIG_);
    Blockly.Cake.Toolbox.tree_ = tree;
    tree.setShowRootNode(false);
    tree.setShowLines(false);
    tree.setShowExpandIcons(false);
    tree.setSelectedItem(null);

    Blockly.Cake.Toolbox.HtmlDiv.style.display = 'block';
    Blockly.Cake.Toolbox.flyout_.init(Blockly.Cake.mainWorkspace, true);
    Blockly.Cake.Toolbox.populate_();
    tree.render(Blockly.Cake.Toolbox.HtmlDiv);

    // If the document resizes, reposition the toolbox.
    goog.events.listen(window, goog.events.EventType.RESIZE,
        Blockly.Cake.Toolbox.position_);
    Blockly.Cake.Toolbox.position_();
};

/**
 * Move the toolbox to the edge.
 * @private
 */
Blockly.Cake.Toolbox.position_ = function() {
  var treeDiv = Blockly.Cake.Toolbox.HtmlDiv;
  var svgBox = goog.style.getBorderBox(Blockly.Cake.svg);
  var svgSize = Blockly.Cake.svgSize();
  if (Blockly.Cake.RTL) {
    var xy = Blockly.Cake.convertCoordinates(0, 0, false);
    treeDiv.style.left = (xy.x + svgSize.width - treeDiv.offsetWidth) + 'px';
  } else {
    treeDiv.style.marginLeft = svgBox.left;
  }
  treeDiv.style.height = (svgSize.height + 1) + 'px';
  Blockly.Cake.Toolbox.width = treeDiv.offsetWidth;
  if (!Blockly.Cake.RTL) {
    // For some reason the LTR toolbox now reports as 1px too wide.
    Blockly.Cake.Toolbox.width -= 1;
  }
};

/**
 * Fill the toolbox with categories and blocks.
 * @private
 */
Blockly.Cake.Toolbox.populate_ = function() {
  var rootOut = Blockly.Cake.Toolbox.tree_;
  rootOut.removeChildren();  // Delete any existing content.
  rootOut.blocks = [];
  function syncTrees(treeIn, treeOut) {
    for (var i = 0, childIn; childIn = treeIn.childNodes[i]; i++) {
      if (!childIn.tagName) {
        // Skip over text.
        continue;
      }
      var name = childIn.tagName.toUpperCase();
      if (name == 'CATEGORY') {
        var childOut = rootOut.createNode(childIn.getAttribute('name'));
        childOut.blocks = [];
        treeOut.add(childOut);
        var custom = childIn.getAttribute('custom');
        if (custom) {
          // Variables and procedures have special categories that are dynamic.
          childOut.blocks = custom;
        } else {
          syncTrees(childIn, childOut);
        }
      } else if (name == 'BLOCK') {
        treeOut.blocks.push(childIn);
      }
    }
  }
  syncTrees(Blockly.Cake.languageTree, Blockly.Cake.Toolbox.tree_);

  if (rootOut.blocks.length) {
    throw 'Toolbox cannot have both blocks and categories in the root level.';
  }

  // Fire a resize event since the toolbox may have changed width and height.
  Blockly.Cake.fireUiEvent(window, 'resize');
};

/**
 * Unhighlight any previously specified option.
 */
Blockly.Cake.Toolbox.clearSelection = function() {
  Blockly.Cake.Toolbox.tree_.setSelectedItem(null);
};

// Extending Closure's Tree UI.

/**
 * Extention of a TreeControl object that uses a custom tree node.
 * @param {!goog.html.SafeHtml} html The HTML content of the node label.
 * @param {Object=} opt_config The configuration for the tree. See
 *    goog.ui.tree.TreeControl.DefaultConfig. If not specified, a default config
 *    will be used.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @constructor
 * @extends {goog.ui.tree.TreeControl}
 */
Blockly.Cake.Toolbox.TreeControl = function(html, opt_config, opt_domHelper) {
  goog.ui.tree.TreeControl.call(this, html, opt_config, opt_domHelper);
};
goog.inherits(Blockly.Cake.Toolbox.TreeControl, goog.ui.tree.TreeControl);

/**
 * Adds touch handling to TreeControl.
 * @override
 */
Blockly.Cake.Toolbox.TreeControl.prototype.enterDocument = function() {
  Blockly.Cake.Toolbox.TreeControl.superClass_.enterDocument.call(this);

  // Add touch handler.
  if (goog.events.BrowserFeature.TOUCH_ENABLED) {
    var el = this.getElement();
    Blockly.Cake.bindEvent_(el, goog.events.EventType.TOUCHSTART, this,
        this.handleTouchEvent_);
  }
};
/**
 * Handles touch events.
 * @param {!goog.events.BrowserEvent} e The browser event.
 * @private
 */
Blockly.Cake.Toolbox.TreeControl.prototype.handleTouchEvent_ = function(e) {
  e.preventDefault();
  var node = this.getNodeFromEvent_(e);
  if (node && e.type === goog.events.EventType.TOUCHSTART) {
    // Fire asynchronously since onMouseDown takes long enough that the browser
    // would fire the default mouse event before this method returns.
    window.setTimeout(function() {
      node.onMouseDown(e);  // Same behaviour for click and touch.
    }, 1);
  }
};

/**
 * Creates a new tree node using a custom tree node.
 * @param {string=} html The HTML content of the node label.
 * @return {!goog.ui.tree.TreeNode} The new item.
 * @override
 */
Blockly.Cake.Toolbox.TreeControl.prototype.createNode = function(opt_html) {
  return new Blockly.Cake.Toolbox.TreeNode(opt_html ?
      goog.html.SafeHtml.htmlEscape(opt_html) : goog.html.SafeHtml.EMPTY,
      this.getConfig(), this.getDomHelper());
};

/**
 * Display/hide the flyout when an item is selected.
 * @param {goog.ui.tree.BaseNode} node The item to select.
 * @override
 */
Blockly.Cake.Toolbox.TreeControl.prototype.setSelectedItem = function(node) {
  if (this.selectedItem_ == node) {
    return;
  }
  goog.ui.tree.TreeControl.prototype.setSelectedItem.call(this, node);
  if (node && node.blocks && node.blocks.length) {
    Blockly.Cake.Toolbox.flyout_.show(node.blocks);
  } else {
    // Hide the flyout.
    Blockly.Cake.Toolbox.flyout_.hide();
  }
};

/**
 * An single node in the tree, customized for Blockly.Cake's UI.
 * @param {!goog.html.SafeHtml} html The HTML content of the node label.
 * @param {Object=} opt_config The configuration for the tree. See
 *    goog.ui.tree.TreeControl.DefaultConfig. If not specified, a default config
 *    will be used.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @constructor
 * @extends {goog.ui.tree.TreeNode}
 */
Blockly.Cake.Toolbox.TreeNode = function(html, opt_config, opt_domHelper) {
  goog.ui.tree.TreeNode.call(this, html, opt_config, opt_domHelper);
  var resize = function() {
    Blockly.Cake.fireUiEvent(window, 'resize');
  };
  // Fire a resize event since the toolbox may have changed width.
  goog.events.listen(Blockly.Cake.Toolbox.tree_,
      goog.ui.tree.BaseNode.EventType.EXPAND, resize);
  goog.events.listen(Blockly.Cake.Toolbox.tree_,
      goog.ui.tree.BaseNode.EventType.COLLAPSE, resize);
};
goog.inherits(Blockly.Cake.Toolbox.TreeNode, goog.ui.tree.TreeNode);

/**
 * Supress population of the +/- icon.
 * @return {!goog.html.SafeHtml} The source for the icon.
 * @override
 */
goog.ui.tree.BaseNode.prototype.getExpandIconSafeHtml = function() {
  return goog.html.SafeHtml.create('span');
};

/**
 * Expand or collapse the node on mouse click.
 * @param {!goog.events.BrowserEvent} e The browser event.
 * @override
 */
Blockly.Cake.Toolbox.TreeNode.prototype.onMouseDown = function(e) {
  // Expand icon.
  if (this.hasChildren() && this.isUserCollapsible_) {
    this.toggle();
    this.select();
  } else if (this.isSelected()) {
    this.getTree().setSelectedItem(null);
  } else {
    this.select();
  }
  this.updateRow();
};

/**
 * Supress the inherited double-click behaviour.
 * @param {!goog.events.BrowserEvent} e The browser event.
 * @override
 * @private
 */
Blockly.Cake.Toolbox.TreeNode.prototype.onDoubleClick_ = function(e) {
  // NOP.
};
