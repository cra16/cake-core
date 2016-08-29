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
 * @fileoverview Core JavaScript library for Blockly.Cake.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

// Top level object for Blockly.Cake.
goog.provide('Blockly.Cake');

// Blockly.Cake core dependencies.
goog.require('Blockly.Cake.Block');
goog.require('Blockly.Cake.Connection');
goog.require('Blockly.Cake.FieldAngle');
goog.require('Blockly.Cake.FieldCheckbox');
goog.require('Blockly.Cake.FieldColour');
goog.require('Blockly.Cake.FieldDropdown');
goog.require('Blockly.Cake.FieldStructure');
goog.require('Blockly.Cake.FieldStructureMember');
goog.require('Blockly.Cake.FieldImage');
goog.require('Blockly.Cake.FieldTextInput');
goog.require('Blockly.Cake.FieldVariable');
goog.require('Blockly.Cake.FieldVariablePointer');
goog.require('Blockly.Cake.FieldVariableArray');
goog.require('Blockly.Cake.FieldVariableDefine');
goog.require('Blockly.Cake.Generator');
goog.require('Blockly.Cake.Msg');
goog.require('Blockly.Cake.Procedures');
goog.require('Blockly.Cake.Structure');
goog.require('Blockly.Cake.Realtime');
goog.require('Blockly.Cake.Toolbox');
goog.require('Blockly.Cake.WidgetDiv');
goog.require('Blockly.Cake.Workspace');
goog.require('Blockly.Cake.inject');
goog.require('Blockly.Cake.utils');

// Closure dependencies.
goog.require('goog.color');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.string');
goog.require('goog.ui.ColorPicker');
goog.require('goog.ui.tree.TreeControl');
goog.require('goog.userAgent');


/**
 * Path to Blockly.Cake's directory.  Can be relative, absolute, or remote.
 * Used for loading additional resources.
 */
Blockly.Cake.pathToBlockly = './';

/**
 * Required name space for SVG elements.
 * @const
 */
Blockly.Cake.SVG_NS = 'http://www.w3.org/2000/svg';
/**
 * Required name space for HTML elements.
 * @const
 */
Blockly.Cake.HTML_NS = 'http://www.w3.org/1999/xhtml';

/**
 * The richness of block colours, regardless of the hue.
 * Must be in the range of 0 (inclusive) to 1 (exclusive).
 */
Blockly.Cake.HSV_SATURATION = 0.60;
/**
 * The intensity of block colours, regardless of the hue.
 * Must be in the range of 0 (inclusive) to 1 (exclusive).
 */
Blockly.Cake.HSV_VALUE = 0.82;

/**
 * Convert a hue (HSV model) into an RGB hex triplet.
 * @param {number} hue Hue on a colour wheel (0-360).
 * @return {string} RGB code, e.g. '#5ba65b'.
 */
Blockly.Cake.makeColour = function(hue) {
  return goog.color.hsvToHex(hue, Blockly.Cake.HSV_SATURATION,
      Blockly.Cake.HSV_VALUE * 256);
};

/**
 * ENUM for a right-facing value input.  E.g. 'test' or 'return'.
 * @const
 */
Blockly.Cake.INPUT_VALUE = 1;
/**
 * ENUM for a left-facing value output.  E.g. 'call random'.
 * @const
 */
Blockly.Cake.OUTPUT_VALUE = 2;
/**
 * ENUM for a down-facing block stack.  E.g. 'then-do' or 'else-do'.
 * @const
 */
Blockly.Cake.NEXT_STATEMENT = 3;
/**
 * ENUM for an up-facing block stack.  E.g. 'close screen'.
 * @const
 */
Blockly.Cake.PREVIOUS_STATEMENT = 4;
/**
 * ENUM for an dummy input.  Used to add field(s) with no input.
 * @const
 */
Blockly.Cake.DUMMY_INPUT = 5;

/**
 * ENUM for left alignment.
 * @const
 */
Blockly.Cake.ALIGN_LEFT = -1;
/**
 * ENUM for centre alignment.
 * @const
 */
Blockly.Cake.ALIGN_CENTRE = 0;
/**
 * ENUM for right alignment.
 * @const
 */
Blockly.Cake.ALIGN_RIGHT = 1;

/**
 * Lookup table for determining the opposite type of a connection.
 * @const
 */
Blockly.Cake.OPPOSITE_TYPE = [];
Blockly.Cake.OPPOSITE_TYPE[Blockly.Cake.INPUT_VALUE] = Blockly.Cake.OUTPUT_VALUE;
Blockly.Cake.OPPOSITE_TYPE[Blockly.Cake.OUTPUT_VALUE] = Blockly.Cake.INPUT_VALUE;
Blockly.Cake.OPPOSITE_TYPE[Blockly.Cake.NEXT_STATEMENT] = Blockly.Cake.PREVIOUS_STATEMENT;
Blockly.Cake.OPPOSITE_TYPE[Blockly.Cake.PREVIOUS_STATEMENT] = Blockly.Cake.NEXT_STATEMENT;

/**
 * Database of pre-loaded sounds.
 * @private
 * @const
 */
Blockly.Cake.SOUNDS_ = Object.create(null);

/**
 * Currently selected block.
 * @type {Blockly.Cake.Block}
 */
Blockly.Cake.selected = null;

/**
 * Is Blockly.Cake in a read-only, non-editable mode?
 * Note that this property may only be set before init is called.
 * It can't be used to dynamically toggle editability on and off.
 */
Blockly.Cake.readOnly = false;

/**
 * Currently highlighted connection (during a drag).
 * @type {Blockly.Cake.Connection}
 * @private
 */
Blockly.Cake.highlightedConnection_ = null;

/**
 * Connection on dragged block that matches the highlighted connection.
 * @type {Blockly.Cake.Connection}
 * @private
 */
Blockly.Cake.localConnection_ = null;

/**
 * Number of pixels the mouse must move before a drag starts.
 * @const
 */
Blockly.Cake.DRAG_RADIUS = 5;

/**
 * Maximum misalignment between connections for them to snap together.
 * @const
 */
Blockly.Cake.SNAP_RADIUS = 20;

/**
 * Delay in ms between trigger and bumping unconnected block out of alignment.
 * @const
 */
Blockly.Cake.BUMP_DELAY = 250;

/**
 * Number of characters to truncate a collapsed block to.
 * @const
 */
Blockly.Cake.COLLAPSE_CHARS = 30;

/**
 * The main workspace (defined by inject.js).
 * @type {Blockly.Cake.Workspace}
 */
Blockly.Cake.mainWorkspace = null;

/**
 * Contents of the local clipboard.
 * @type {Element}
 * @private
 */
Blockly.Cake.clipboard_ = null;

/**
 * Returns the dimensions of the current SVG image.
 * @return {!Object} Contains width and height properties.
 */
Blockly.Cake.svgSize = function() {
  return {width: Blockly.Cake.svg.cachedWidth_,
          height: Blockly.Cake.svg.cachedHeight_};
};

/**
 * Size the SVG image to completely fill its container.
 * Record the height/width of the SVG image.
 */
Blockly.Cake.svgResize = function() {
  var svg = Blockly.Cake.svg;
  var div = svg.parentNode;
  var width = div.offsetWidth;
  var height = div.offsetHeight;
  if (svg.cachedWidth_ != width) {
    svg.setAttribute('width', width + 'px');
    svg.cachedWidth_ = width;
  }
  if (svg.cachedHeight_ != height) {
    svg.setAttribute('height', height + 'px');
    svg.cachedHeight_ = height;
  }
  // Update the scrollbars (if they exist).
  if (Blockly.Cake.mainWorkspace.scrollbar) {
    Blockly.Cake.mainWorkspace.scrollbar.resize();
  }
};

/**
 * Handle a mouse-down on SVG drawing surface.
 * @param {!Event} e Mouse down event.
 * @private
 */
Blockly.Cake.onMouseDown_ = function(e) {
  Blockly.Cake.svgResize();
  Blockly.Cake.terminateDrag_(); // In case mouse-up event was lost.
  Blockly.Cake.hideChaff();
  var isTargetSvg = e.target && e.target.nodeName &&
      e.target.nodeName.toLowerCase() == 'svg';
  if (!Blockly.Cake.readOnly && Blockly.Cake.selected && isTargetSvg) {
    // Clicking on the document clears the selection.
    Blockly.Cake.selected.unselect();
  }
  if (e.target == Blockly.Cake.svg && Blockly.Cake.isRightButton(e)) {
    // Right-click.
    Blockly.Cake.showContextMenu_(e);
  } else if ((Blockly.Cake.readOnly || isTargetSvg) &&
             Blockly.Cake.mainWorkspace.scrollbar) {
    // If the workspace is editable, only allow dragging when gripping empty
    // space.  Otherwise, allow dragging when gripping anywhere.
    Blockly.Cake.mainWorkspace.dragMode = true;
    // Record the current mouse position.
    Blockly.Cake.mainWorkspace.startDragMouseX = e.clientX;
    Blockly.Cake.mainWorkspace.startDragMouseY = e.clientY;
    Blockly.Cake.mainWorkspace.startDragMetrics =
        Blockly.Cake.mainWorkspace.getMetrics();
    Blockly.Cake.mainWorkspace.startScrollX = Blockly.Cake.mainWorkspace.scrollX;
    Blockly.Cake.mainWorkspace.startScrollY = Blockly.Cake.mainWorkspace.scrollY;
  }
};

/**
 * Handle a mouse-up anywhere on the page.
 * @param {!Event} e Mouse up event.
 * @private
 */
Blockly.Cake.onMouseUp_ = function(e) {
  Blockly.Cake.setCursorHand_(false);
  Blockly.Cake.mainWorkspace.dragMode = false;
};

/**
 * Handle a mouse-move on SVG drawing surface.
 * @param {!Event} e Mouse move event.
 * @private
 */
Blockly.Cake.onMouseMove_ = function(e) {
  if (Blockly.Cake.mainWorkspace.dragMode) {
    Blockly.Cake.removeAllRanges();
    var dx = e.clientX - Blockly.Cake.mainWorkspace.startDragMouseX;
    var dy = e.clientY - Blockly.Cake.mainWorkspace.startDragMouseY;
    var metrics = Blockly.Cake.mainWorkspace.startDragMetrics;
    var x = Blockly.Cake.mainWorkspace.startScrollX + dx;
    var y = Blockly.Cake.mainWorkspace.startScrollY + dy;
    x = Math.min(x, -metrics.contentLeft);
    y = Math.min(y, -metrics.contentTop);
    x = Math.max(x, metrics.viewWidth - metrics.contentLeft -
                 metrics.contentWidth);
    y = Math.max(y, metrics.viewHeight - metrics.contentTop -
                 metrics.contentHeight);

    // Move the scrollbars and the page will scroll automatically.
    Blockly.Cake.mainWorkspace.scrollbar.set(-x - metrics.contentLeft,
                                        -y - metrics.contentTop);
  }
};

/**
 * Handle a key-down on SVG drawing surface.
 * @param {!Event} e Key down event.
 * @private
 */
Blockly.Cake.onKeyDown_ = function(e) {
  if (Blockly.Cake.isTargetInput_(e)) {
    // When focused on an HTML text input widget, don't trap any keys.
    return;
  }
  // TODO: Add keyboard support for cursoring around the context menu.
  if (e.keyCode == 27) {
    // Pressing esc closes the context menu.
    Blockly.Cake.hideChaff();
  } else if (e.keyCode == 8 || e.keyCode == 46) {
    // Delete or backspace.
    try {
      if (Blockly.Cake.selected && Blockly.Cake.selected.isDeletable()) {
        Blockly.Cake.hideChaff();
        Blockly.Cake.selected.dispose(true, true);
      }
    } finally {
      // Stop the browser from going back to the previous page.
      // Use a finally so that any error in delete code above doesn't disappear
      // from the console when the page rolls back.
      e.preventDefault();
    }
  } else if (e.altKey || e.ctrlKey || e.metaKey) {
    if (Blockly.Cake.selected && Blockly.Cake.selected.isDeletable() &&
        Blockly.Cake.selected.workspace == Blockly.Cake.mainWorkspace) {
      Blockly.Cake.hideChaff();
      if (e.keyCode == 67) {
        // 'c' for copy.
        Blockly.Cake.copy_(Blockly.Cake.selected);
      } else if (e.keyCode == 88) {
        // 'x' for cut.
        Blockly.Cake.copy_(Blockly.Cake.selected);
        Blockly.Cake.selected.dispose(true, true);
      }
    }
    if (e.keyCode == 86) {
      // 'v' for paste.
      if (Blockly.Cake.clipboard_) {
        Blockly.Cake.mainWorkspace.paste(Blockly.Cake.clipboard_);
      }
    }
  }
};

/**
 * Stop binding to the global mouseup and mousemove events.
 * @private
 */
Blockly.Cake.terminateDrag_ = function() {
  Blockly.Cake.Block.terminateDrag_();
  Blockly.Cake.Flyout.terminateDrag_();
};

/**
 * Copy a block onto the local clipboard.
 * @param {!Blockly.Cake.Block} block Block to be copied.
 * @private
 */
Blockly.Cake.copy_ = function(block) {
  var xmlBlock = Blockly.Cake.Xml.blockToDom_(block);
  Blockly.Cake.Xml.deleteNext(xmlBlock);
  // Encode start position in XML.
  var xy = block.getRelativeToSurfaceXY();
  xmlBlock.setAttribute('x', Blockly.Cake.RTL ? -xy.x : xy.x);
  xmlBlock.setAttribute('y', xy.y);
  Blockly.Cake.clipboard_ = xmlBlock;
};

/**
 * Show the context menu for the workspace.
 * @param {!Event} e Mouse event.
 * @private
 */
Blockly.Cake.showContextMenu_ = function(e) {
  if (Blockly.Cake.readOnly) {
    return;
  }
  var options = [];
  // Add a little animation to collapsing and expanding.
  var COLLAPSE_DELAY = 10;

  if (Blockly.Cake.collapse) {
    var hasCollapsedBlocks = false;
    var hasExpandedBlocks = false;
    var topBlocks = Blockly.Cake.mainWorkspace.getTopBlocks(false);
    for (var i = 0; i < topBlocks.length; i++) {
      var block = topBlocks[i];
      while (block) {
        if (block.isCollapsed()) {
          hasCollapsedBlocks = true;
        } else {
          hasExpandedBlocks = true;
        }
        block = block.getNextBlock();
      }
    }

    // Option to collapse top blocks.
    var collapseOption = {enabled: hasExpandedBlocks};
    collapseOption.text = Blockly.Cake.Msg.COLLAPSE_ALL;
    collapseOption.callback = function() {
      var ms = 0;
      for (var i = 0; i < topBlocks.length; i++) {
        var block = topBlocks[i];
        while (block) {
          setTimeout(block.setCollapsed.bind(block, true), ms);
          block = block.getNextBlock();
          ms += COLLAPSE_DELAY;
        }
      }
    };
    options.push(collapseOption);

    // Option to expand top blocks.
    var expandOption = {enabled: hasCollapsedBlocks};
    expandOption.text = Blockly.Cake.Msg.EXPAND_ALL;
    expandOption.callback = function() {
      var ms = 0;
      for (var i = 0; i < topBlocks.length; i++) {
        var block = topBlocks[i];
        while (block) {
          setTimeout(block.setCollapsed.bind(block, false), ms);
          block = block.getNextBlock();
          ms += COLLAPSE_DELAY;
        }
      }
    };
    options.push(expandOption);
  }

  Blockly.Cake.ContextMenu.show(e, options);
};

/**
 * Cancel the native context menu, unless the focus is on an HTML input widget.
 * @param {!Event} e Mouse down event.
 * @private
 */
Blockly.Cake.onContextMenu_ = function(e) {
  if (!Blockly.Cake.isTargetInput_(e)) {
    // When focused on an HTML text input widget, don't cancel the context menu.
    e.preventDefault();
  }
};

/**
 * Close tooltips, context menus, dropdown selections, etc.
 * @param {boolean=} opt_allowToolbox If true, don't close the toolbox.
 */
Blockly.Cake.hideChaff = function(opt_allowToolbox) {
  Blockly.Cake.Tooltip.hide();
  Blockly.Cake.WidgetDiv.hide();
  if (!opt_allowToolbox &&
      Blockly.Cake.Toolbox.flyout_ && Blockly.Cake.Toolbox.flyout_.autoClose) {
    Blockly.Cake.Toolbox.clearSelection();
  }
};

/**
 * Deselect any selections on the webpage.
 * Chrome will select text outside the SVG when double-clicking.
 * Deselect this text, so that it doesn't mess up any subsequent drag.
 */
Blockly.Cake.removeAllRanges = function() {
  if (window.getSelection) {  // W3
    var sel = window.getSelection();
    if (sel && sel.removeAllRanges) {
      sel.removeAllRanges();
      window.setTimeout(function() {
          try {
            window.getSelection().removeAllRanges();
          } catch (e) {
            // MSIE throws 'error 800a025e' here.
          }
        }, 0);
    }
  }
};

/**
 * Is this event targeting a text input widget?
 * @param {!Event} e An event.
 * @return {boolean} True if text input.
 * @private
 */
Blockly.Cake.isTargetInput_ = function(e) {
  return e.target.type == 'textarea' || e.target.type == 'text';
};

/**
 * Load an audio file.  Cache it, ready for instantaneous playing.
 * @param {!Array.<string>} filenames List of file types in decreasing order of
 *   preference (i.e. increasing size).  E.g. ['media/go.mp3', 'media/go.wav']
 *   Filenames include path from Blockly.Cake's root.  File extensions matter.
 * @param {string} name Name of sound.
 * @private
 */
Blockly.Cake.loadAudio_ = function(filenames, name) {
  if (!window['Audio'] || !filenames.length) {
    // No browser support for Audio.
    return;
  }
  var sound;
  var audioTest = new window['Audio']();
  for (var i = 0; i < filenames.length; i++) {
    var filename = filenames[i];
    var ext = filename.match(/\.(\w+)$/);
    if (ext && audioTest.canPlayType('audio/' + ext[1])) {
      // Found an audio format we can play.
      sound = new window['Audio'](Blockly.Cake.pathToBlockly + filename);
      break;
    }
  }
  if (sound && sound.play) {
    Blockly.Cake.SOUNDS_[name] = sound;
  }
};

/**
 * Preload all the audio files so that they play quickly when asked for.
 * @private
 */
Blockly.Cake.preloadAudio_ = function() {
  for (var name in Blockly.Cake.SOUNDS_) {
    var sound = Blockly.Cake.SOUNDS_[name];
    sound.volume = .01;
    sound.play();
    sound.pause();
  }
};

/**
 * Play an audio file at specified value.  If volume is not specified,
 * use full volume (1).
 * @param {string} name Name of sound.
 * @param {?number} opt_volume Volume of sound (0-1).
 */
Blockly.Cake.playAudio = function(name, opt_volume) {
  var sound = Blockly.Cake.SOUNDS_[name];
  if (sound) {
    var mySound;
    var ie9 = goog.userAgent.DOCUMENT_MODE &&
              goog.userAgent.DOCUMENT_MODE === 9;
    if (ie9 || goog.userAgent.IPAD || goog.userAgent.ANDROID) {
      // Creating a new audio node causes lag in IE9, Android and iPad. Android
      // and IE9 refetch the file from the server, iPad uses a singleton audio
      // node which must be deleted and recreated for each new audio tag.
      mySound = sound;
    } else {
      mySound = sound.cloneNode();
    }
    mySound.volume = (opt_volume === undefined ? 1 : opt_volume);
    mySound.play();
  }
};

/**
 * Set the mouse cursor to be either a closed hand or the default.
 * @param {boolean} closed True for closed hand.
 * @private
 */
Blockly.Cake.setCursorHand_ = function(closed) {
  if (Blockly.Cake.readOnly) {
    return;
  }
  /* Hotspot coordinates are baked into the CUR file, but they are still
     required due to a Chrome bug.
     http://code.google.com/p/chromium/issues/detail?id=1446 */
  var cursor = '';
  if (closed) {
    cursor = 'url(' + Blockly.Cake.pathToBlockly + 'media/handclosed.cur) 7 3, auto';
  }
  if (Blockly.Cake.selected) {
    Blockly.Cake.selected.getSvgRoot().style.cursor = cursor;
  }
  // Set cursor on the SVG surface as well as block so that rapid movements
  // don't result in cursor changing to an arrow momentarily.
  Blockly.Cake.svg.style.cursor = cursor;
};

/**
 * Return an object with all the metrics required to size scrollbars for the
 * main workspace.  The following properties are computed:
 * .viewHeight: Height of the visible rectangle,
 * .viewWidth: Width of the visible rectangle,
 * .contentHeight: Height of the contents,
 * .contentWidth: Width of the content,
 * .viewTop: Offset of top edge of visible rectangle from parent,
 * .viewLeft: Offset of left edge of visible rectangle from parent,
 * .contentTop: Offset of the top-most content from the y=0 coordinate,
 * .contentLeft: Offset of the left-most content from the x=0 coordinate.
 * .absoluteTop: Top-edge of view.
 * .absoluteLeft: Left-edge of view.
 * @return {Object} Contains size and position metrics of main workspace.
 * @private
 */
Blockly.Cake.getMainWorkspaceMetrics_ = function() {
  var svgSize = Blockly.Cake.svgSize();
  svgSize.width -= Blockly.Cake.Toolbox.width;  // Zero if no Toolbox.
  var viewWidth = svgSize.width - Blockly.Cake.Scrollbar.scrollbarThickness;
  var viewHeight = svgSize.height - Blockly.Cake.Scrollbar.scrollbarThickness;
  try {
    var blockBox = Blockly.Cake.mainWorkspace.getCanvas().getBBox();
  } catch (e) {
    // Firefox has trouble with hidden elements (Bug 528969).
    return null;
  }
  if (Blockly.Cake.mainWorkspace.scrollbar) {
    // Add a border around the content that is at least half a screenful wide.
    // Ensure border is wide enough that blocks can scroll over entire screen.
    var leftEdge = Math.min(blockBox.x - viewWidth / 2,
                            blockBox.x + blockBox.width - viewWidth);
    var rightEdge = Math.max(blockBox.x + blockBox.width + viewWidth / 2,
                             blockBox.x + viewWidth);
    var topEdge = Math.min(blockBox.y - viewHeight / 2,
                           blockBox.y + blockBox.height - viewHeight);
    var bottomEdge = Math.max(blockBox.y + blockBox.height + viewHeight / 2,
                              blockBox.y + viewHeight);
  } else {
    var leftEdge = blockBox.x;
    var rightEdge = leftEdge + blockBox.width;
    var topEdge = blockBox.y;
    var bottomEdge = topEdge + blockBox.height;
  }
  var absoluteLeft = Blockly.Cake.RTL ? 0 : Blockly.Cake.Toolbox.width;
  var metrics = {
    viewHeight: svgSize.height,
    viewWidth: svgSize.width,
    contentHeight: bottomEdge - topEdge,
    contentWidth: rightEdge - leftEdge,
    viewTop: -Blockly.Cake.mainWorkspace.scrollY,
    viewLeft: -Blockly.Cake.mainWorkspace.scrollX,
    contentTop: topEdge,
    contentLeft: leftEdge,
    absoluteTop: 0,
    absoluteLeft: absoluteLeft
  };
  return metrics;
};

/**
 * Sets the X/Y translations of the main workspace to match the scrollbars.
 * @param {!Object} xyRatio Contains an x and/or y property which is a float
 *     between 0 and 1 specifying the degree of scrolling.
 * @private
 */
Blockly.Cake.setMainWorkspaceMetrics_ = function(xyRatio) {
  if (!Blockly.Cake.mainWorkspace.scrollbar) {
    throw 'Attempt to set main workspace scroll without scrollbars.';
  }
  var metrics = Blockly.Cake.getMainWorkspaceMetrics_();
  if (goog.isNumber(xyRatio.x)) {
    Blockly.Cake.mainWorkspace.scrollX = -metrics.contentWidth * xyRatio.x -
        metrics.contentLeft;
  }
  if (goog.isNumber(xyRatio.y)) {
    Blockly.Cake.mainWorkspace.scrollY = -metrics.contentHeight * xyRatio.y -
        metrics.contentTop;
  }
  var translation = 'translate(' +
      (Blockly.Cake.mainWorkspace.scrollX + metrics.absoluteLeft) + ',' +
      (Blockly.Cake.mainWorkspace.scrollY + metrics.absoluteTop) + ')';
  Blockly.Cake.mainWorkspace.getCanvas().setAttribute('transform', translation);
  Blockly.Cake.mainWorkspace.getBubbleCanvas().setAttribute('transform',
                                                       translation);
};

/**
 * Execute a command.  Generally, a command is the result of a user action
 * e.g., a click, drag or context menu selection.  Calling the cmdThunk function
 * through doCommand() allows us to capture information that can be used for
 * capabilities like undo (which is supported by the realtime collaboration
 * feature).
 * @param {function()} cmdThunk A function representing the command execution.
 */
Blockly.Cake.doCommand = function(cmdThunk) {
  if (Blockly.Cake.Realtime.isEnabled) {
    Blockly.Cake.Realtime.doCommand(cmdThunk);
  } else {
    cmdThunk();
  }
};

/**
 * When something in Blockly.Cake's workspace changes, call a function.
 * @param {!Function} func Function to call.
 * @return {!Array.<!Array>} Opaque data that can be passed to
 *     removeChangeListener.
 */
Blockly.Cake.addChangeListener = function(func) {
  return Blockly.Cake.bindEvent_(Blockly.Cake.mainWorkspace.getCanvas(),
                            'blocklyWorkspaceChange', null, func);
};

/**
 * Stop listening for Blockly.Cake's workspace changes.
 * @param {!Array.<!Array>} bindData Opaque data from addChangeListener.
 */
Blockly.Cake.removeChangeListener = function(bindData) {
  Blockly.Cake.unbindEvent_(bindData);
};

/**
 * Returns the main workspace.
 * @return {!Blockly.Cake.Workspace} The main workspace.
 */
Blockly.Cake.getMainWorkspace = function() {
  return Blockly.Cake.mainWorkspace;
};

// Export symbols that would otherwise be renamed by Closure compiler.
window['Blockly.Cake'] = Blockly.Cake;
Blockly.Cake['getMainWorkspace'] = Blockly.Cake.getMainWorkspace;
Blockly.Cake['addChangeListener'] = Blockly.Cake.addChangeListener;
Blockly.Cake['removeChangeListener'] = Blockly.Cake.removeChangeListener;
