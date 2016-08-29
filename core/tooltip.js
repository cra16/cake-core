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
 * @fileoverview Library to create tooltips for Blockly.Cake.
 * First, call Blockly.Cake.Tooltip.init() after onload.
 * Second, set the 'tooltip' property on any SVG element that needs a tooltip.
 * If the tooltip is a string, then that message will be displayed.
 * If the tooltip is an SVG element, then that object's tooltip will be used.
 * Third, call Blockly.Cake.Tooltip.bindMouseEvents(e) passing the SVG element.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Cake.Tooltip');


/**
 * Is a tooltip currently showing?
 */
Blockly.Cake.Tooltip.visible = false;

/**
 * Maximum width (in characters) of a tooltip.
 */
Blockly.Cake.Tooltip.LIMIT = 50;

/**
 * PID of suspended thread to clear tooltip on mouse out.
 * @private
 */
Blockly.Cake.Tooltip.mouseOutPid_ = 0;

/**
 * PID of suspended thread to show the tooltip.
 * @private
 */
Blockly.Cake.Tooltip.showPid_ = 0;

/**
 * Last observed location of the mouse pointer (freezes when tooltip appears).
 * @private
 */
Blockly.Cake.Tooltip.lastXY_ = {x: 0, y: 0};

/**
 * Current element being pointed at.
 * @private
 */
Blockly.Cake.Tooltip.element_ = null;

/**
 * Once a tooltip has opened for an element, that element is 'poisoned' and
 * cannot respawn a tooltip until the pointer moves over a different element.
 * @private
 */
Blockly.Cake.Tooltip.poisonedElement_ = null;

/**
 * Tooltip's SVG group element.
 * @type {Element}
 * @private
 */
Blockly.Cake.Tooltip.svgGroup_ = null;

/**
 * Tooltip's SVG text element.
 * @type {SVGTextElement}
 * @private
 */
Blockly.Cake.Tooltip.svgText_ = null;

/**
 * Tooltip's SVG background rectangle.
 * @type {Element}
 * @private
 */
Blockly.Cake.Tooltip.svgBackground_ = null;

/**
 * Tooltip's SVG shadow rectangle.
 * @type {Element}
 * @private
 */
Blockly.Cake.Tooltip.svgShadow_ = null;

/**
 * Horizontal offset between mouse cursor and tooltip.
 */
Blockly.Cake.Tooltip.OFFSET_X = 0;

/**
 * Vertical offset between mouse cursor and tooltip.
 */
Blockly.Cake.Tooltip.OFFSET_Y = 10;

/**
 * Radius mouse can move before killing tooltip.
 */
Blockly.Cake.Tooltip.RADIUS_OK = 10;

/**
 * Delay before tooltip appears.
 */
Blockly.Cake.Tooltip.HOVER_MS = 1000;

/**
 * Horizontal padding between text and background.
 */
Blockly.Cake.Tooltip.MARGINS = 5;

/**
 * Create the tooltip elements.  Only needs to be called once.
 * @return {!SVGGElement} The tooltip's SVG group.
 */
Blockly.Cake.Tooltip.createDom = function() {
  /*
  <g class="blocklyHidden">
    <rect class="blocklyTooltipShadow" x="2" y="2"/>
    <rect class="blocklyTooltipBackground"/>
    <text class="blocklyTooltipText"></text>
  </g>
  */
  var svgGroup = /** @type {!SVGGElement} */ (
      Blockly.Cake.createSvgElement('g', {'class': 'blocklyHidden'}, null));
  Blockly.Cake.Tooltip.svgGroup_ = svgGroup;
  Blockly.Cake.Tooltip.svgShadow_ = /** @type {!SVGRectElement} */ (
      Blockly.Cake.createSvgElement(
          'rect', {'class': 'blocklyTooltipShadow', 'x': 2, 'y': 2}, svgGroup));
  Blockly.Cake.Tooltip.svgBackground_ = /** @type {!SVGRectElement} */ (
      Blockly.Cake.createSvgElement(
          'rect', {'class': 'blocklyTooltipBackground'}, svgGroup));
  Blockly.Cake.Tooltip.svgText_ = /** @type {!SVGTextElement} */ (
      Blockly.Cake.createSvgElement(
          'text', {'class': 'blocklyTooltipText'}, svgGroup));
  return svgGroup;
};

/**
 * Binds the required mouse events onto an SVG element.
 * @param {!Element} element SVG element onto which tooltip is to be bound.
 */
Blockly.Cake.Tooltip.bindMouseEvents = function(element) {
  Blockly.Cake.bindEvent_(element, 'mouseover', null, Blockly.Cake.Tooltip.onMouseOver_);
  Blockly.Cake.bindEvent_(element, 'mouseout', null, Blockly.Cake.Tooltip.onMouseOut_);
  Blockly.Cake.bindEvent_(element, 'mousemove', null, Blockly.Cake.Tooltip.onMouseMove_);
};

/**
 * Hide the tooltip if the mouse is over a different object.
 * Initialize the tooltip to potentially appear for this object.
 * @param {!Event} e Mouse event.
 * @private
 */
Blockly.Cake.Tooltip.onMouseOver_ = function(e) {
  // If the tooltip is an object, treat it as a pointer to the next object in
  // the chain to look at.  Terminate when a string or function is found.
  var element = e.target;
  while (!goog.isString(element.tooltip) && !goog.isFunction(element.tooltip)) {
    element = element.tooltip;
  }
  if (Blockly.Cake.Tooltip.element_ != element) {
    Blockly.Cake.Tooltip.hide();
    Blockly.Cake.Tooltip.poisonedElement_ = null;
    Blockly.Cake.Tooltip.element_ = element;
  }
  // Forget about any immediately preceeding mouseOut event.
  window.clearTimeout(Blockly.Cake.Tooltip.mouseOutPid_);
};

/**
 * Hide the tooltip if the mouse leaves the object and enters the workspace.
 * @param {!Event} e Mouse event.
 * @private
 */
Blockly.Cake.Tooltip.onMouseOut_ = function(e) {
  // Moving from one element to another (overlapping or with no gap) generates
  // a mouseOut followed instantly by a mouseOver.  Fork off the mouseOut
  // event and kill it if a mouseOver is received immediately.
  // This way the task only fully executes if mousing into the void.
  Blockly.Cake.Tooltip.mouseOutPid_ = window.setTimeout(function() {
        Blockly.Cake.Tooltip.element_ = null;
        Blockly.Cake.Tooltip.poisonedElement_ = null;
        Blockly.Cake.Tooltip.hide();
      }, 1);
  window.clearTimeout(Blockly.Cake.Tooltip.showPid_);
};

/**
 * When hovering over an element, schedule a tooltip to be shown.  If a tooltip
 * is already visible, hide it if the mouse strays out of a certain radius.
 * @param {!Event} e Mouse event.
 * @private
 */
Blockly.Cake.Tooltip.onMouseMove_ = function(e) {
  if (!Blockly.Cake.Tooltip.element_ || !Blockly.Cake.Tooltip.element_.tooltip) {
    // No tooltip here to show.
    return;
  } else if (Blockly.Cake.Block.dragMode_ != 0) {
    // Don't display a tooltip during a drag.
    return;
  } else if (Blockly.Cake.WidgetDiv.isVisible()) {
    // Don't display a tooltip if a widget is open (tooltip would be under it).
    return;
  }
  if (Blockly.Cake.Tooltip.visible) {
    // Compute the distance between the mouse position when the tooltip was
    // shown and the current mouse position.  Pythagorean theorem.
    var mouseXY = Blockly.Cake.mouseToSvg(e);
    var dx = Blockly.Cake.Tooltip.lastXY_.x - mouseXY.x;
    var dy = Blockly.Cake.Tooltip.lastXY_.y - mouseXY.y;
    var dr = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    if (dr > Blockly.Cake.Tooltip.RADIUS_OK) {
      Blockly.Cake.Tooltip.hide();
    }
  } else if (Blockly.Cake.Tooltip.poisonedElement_ != Blockly.Cake.Tooltip.element_) {
    // The mouse moved, clear any previously scheduled tooltip.
    window.clearTimeout(Blockly.Cake.Tooltip.showPid_);
    // Maybe this time the mouse will stay put.  Schedule showing of tooltip.
    Blockly.Cake.Tooltip.lastXY_ = Blockly.Cake.mouseToSvg(e);
    Blockly.Cake.Tooltip.showPid_ =
        window.setTimeout(Blockly.Cake.Tooltip.show_, Blockly.Cake.Tooltip.HOVER_MS);
  }
};

/**
 * Hide the tooltip.
 */
Blockly.Cake.Tooltip.hide = function() {
  if (Blockly.Cake.Tooltip.visible) {
    Blockly.Cake.Tooltip.visible = false;
    if (Blockly.Cake.Tooltip.svgGroup_) {
      Blockly.Cake.Tooltip.svgGroup_.style.display = 'none';
    }
  }
  window.clearTimeout(Blockly.Cake.Tooltip.showPid_);
};

/**
 * Create the tooltip and show it.
 * @private
 */
Blockly.Cake.Tooltip.show_ = function() {
  Blockly.Cake.Tooltip.poisonedElement_ = Blockly.Cake.Tooltip.element_;
  if (!Blockly.Cake.Tooltip.svgGroup_) {
    return;
  }
  // Erase all existing text.
  goog.dom.removeChildren(
      /** @type {!Element} */ (Blockly.Cake.Tooltip.svgText_));
  // Get the new text.
  var tip = Blockly.Cake.Tooltip.element_.tooltip;
  if (goog.isFunction(tip)) {
    tip = tip();
  }
  tip = Blockly.Cake.Tooltip.wrap_(tip, Blockly.Cake.Tooltip.LIMIT);
  // Create new text, line by line.
  var lines = tip.split('\n');
  for (var i = 0; i < lines.length; i++) {
    var tspanElement = Blockly.Cake.createSvgElement('tspan',
        {'dy': '1em', 'x': Blockly.Cake.Tooltip.MARGINS}, Blockly.Cake.Tooltip.svgText_);
    var textNode = document.createTextNode(lines[i]);
    tspanElement.appendChild(textNode);
  }
  // Display the tooltip.
  Blockly.Cake.Tooltip.visible = true;
  Blockly.Cake.Tooltip.svgGroup_.style.display = 'block';
  // Resize the background and shadow to fit.
  var bBox = Blockly.Cake.Tooltip.svgText_.getBBox();
  var width = 2 * Blockly.Cake.Tooltip.MARGINS + bBox.width;
  var height = bBox.height;
  Blockly.Cake.Tooltip.svgBackground_.setAttribute('width', width);
  Blockly.Cake.Tooltip.svgBackground_.setAttribute('height', height);
  Blockly.Cake.Tooltip.svgShadow_.setAttribute('width', width);
  Blockly.Cake.Tooltip.svgShadow_.setAttribute('height', height);
  if (Blockly.Cake.RTL) {
    // Right-align the paragraph.
    // This cannot be done until the tooltip is rendered on screen.
    var maxWidth = bBox.width;
    for (var x = 0, textElement;
         textElement = Blockly.Cake.Tooltip.svgText_.childNodes[x]; x++) {
      textElement.setAttribute('text-anchor', 'end');
      textElement.setAttribute('x', maxWidth + Blockly.Cake.Tooltip.MARGINS);
    }
  }
  // Move the tooltip to just below the cursor.
  var anchorX = Blockly.Cake.Tooltip.lastXY_.x;
  if (Blockly.Cake.RTL) {
    anchorX -= Blockly.Cake.Tooltip.OFFSET_X + width;
  } else {
    anchorX += Blockly.Cake.Tooltip.OFFSET_X;
  }
  var anchorY = Blockly.Cake.Tooltip.lastXY_.y + Blockly.Cake.Tooltip.OFFSET_Y;

  var svgSize = Blockly.Cake.svgSize();
  if (anchorY + bBox.height > svgSize.height) {
    // Falling off the bottom of the screen; shift the tooltip up.
    anchorY -= bBox.height + 2 * Blockly.Cake.Tooltip.OFFSET_Y;
  }
  if (Blockly.Cake.RTL) {
    // Prevent falling off left edge in RTL mode.
    anchorX = Math.max(Blockly.Cake.Tooltip.MARGINS, anchorX);
  } else {
    if (anchorX + bBox.width > svgSize.width - 2 * Blockly.Cake.Tooltip.MARGINS) {
      // Falling off the right edge of the screen;
      // clamp the tooltip on the edge.
      anchorX = svgSize.width - bBox.width - 2 * Blockly.Cake.Tooltip.MARGINS;
    }
  }
  Blockly.Cake.Tooltip.svgGroup_.setAttribute('transform',
      'translate(' + anchorX + ',' + anchorY + ')');
};

/**
 * Wrap text to the specified width.
 * @param {string} text Text to wrap.
 * @param {number} limit Width to wrap each line.
 * @private
 */
Blockly.Cake.Tooltip.wrap_ = function(text, limit) {
  if (text.length <= limit) {
    // Short text, no need to wrap.
    return text;
  }
  // Split the text into words.
  var words = text.trim().split(/\s+/);
  // Set limit to be the length of the largest word.
  for (var i = 0; i < words.length; i++) {
    if (words[i].length > limit) {
      limit = words[i].length;
    }
  }

  var lastScore;
  var score = -Infinity;
  var lastText;
  var lineCount = 1;
  do {
    lastScore = score;
    lastText = text;
    // Create a list of booleans representing if a space (false) or
    // a break (true) appears after each word.
    var wordBreaks = [];
    // Seed the list with evenly spaced linebreaks.
    var steps = words.length / lineCount;
    var insertedBreaks = 1;
    for (var i = 0; i < words.length - 1; i++) {
      if (insertedBreaks < (i + 1.5) / steps) {
        insertedBreaks++;
        wordBreaks[i] = true;
      } else {
        wordBreaks[i] = false;
      }
    }
    wordBreaks = Blockly.Cake.Tooltip.wrapMutate_(words, wordBreaks, limit);
    score = Blockly.Cake.Tooltip.wrapScore_(words, wordBreaks, limit);
    text = Blockly.Cake.Tooltip.wrapToText_(words, wordBreaks);
    lineCount++;
  } while (score > lastScore)
  return lastText;
};

/**
 * Compute a score for how good the wrapping is.
 * @param {!Array.<string>} words Array of each word.
 * @param {!Array.<boolean>} wordBreaks Array of line breaks.
 * @param {number} limit Width to wrap each line.
 * @return {number} Larger the better.
 * @private
 */
Blockly.Cake.Tooltip.wrapScore_ = function(words, wordBreaks, limit) {
  // If this function becomes a performance liability, add caching.
  // Compute the length of each line.
  var lineLengths = [0];
  var linePunctuation = [];
  for (var i = 0; i < words.length; i++) {
    lineLengths[lineLengths.length - 1] += words[i].length;
    if (wordBreaks[i] === true) {
      lineLengths.push(0);
      linePunctuation.push(words[i].charAt(words[i].length - 1));
    } else if (wordBreaks[i] === false) {
      lineLengths[lineLengths.length - 1]++;
    }
  }
  var maxLength = Math.max.apply(Math, lineLengths);

  var score = 0;
  for (var i = 0; i < lineLengths.length; i++) {
    // Optimize for width.
    // -2 points per char over limit (scaled to the power of 1.5).
    score -= Math.pow(Math.abs(limit - lineLengths[i]), 1.5) * 2;
    // Optimize for even lines.
    // -1 point per char smaller than max (scaled to the power of 1.5).
    score -= Math.pow(maxLength - lineLengths[i], 1.5);
    // Optimize for structure.
    // Add score to line endings after punctuation.
    if ('.?!'.indexOf(linePunctuation[i]) != -1) {
      score += limit / 3;
    } else if (',;)]}'.indexOf(linePunctuation[i]) != -1) {
      score += limit / 4;
    }
  }
  // All else being equal, the last line should not be longer than the
  // previous line.  For example, this looks wrong:
  // aaa bbb
  // ccc ddd eee
  if (lineLengths.length > 1 && lineLengths[lineLengths.length - 1] <=
      lineLengths[lineLengths.length - 2]) {
    score += 0.5;
  }
  return score;
};

/**
 * Mutate the array of line break locations until an optimal solution is found.
 * No line breaks are added or deleted, they are simply moved around.
 * @param {!Array.<string>} words Array of each word.
 * @param {!Array.<boolean>} wordBreaks Array of line breaks.
 * @param {number} limit Width to wrap each line.
 * @return {!Array.<boolean>} New array of optimal line breaks.
 * @private
 */
Blockly.Cake.Tooltip.wrapMutate_ = function(words, wordBreaks, limit) {
  var bestScore = Blockly.Cake.Tooltip.wrapScore_(words, wordBreaks, limit);
  var bestBreaks;
  // Try shifting every line break forward or backward.
  for (var i = 0; i < wordBreaks.length - 1; i++) {
    if (wordBreaks[i] == wordBreaks[i + 1]) {
      continue;
    }
    var mutatedWordBreaks = [].concat(wordBreaks);
    mutatedWordBreaks[i] = !mutatedWordBreaks[i];
    mutatedWordBreaks[i + 1] = !mutatedWordBreaks[i + 1];
    var mutatedScore =
        Blockly.Cake.Tooltip.wrapScore_(words, mutatedWordBreaks, limit);
    if (mutatedScore > bestScore) {
      bestScore = mutatedScore;
      bestBreaks = mutatedWordBreaks;
    }
  }
  if (bestBreaks) {
    // Found an improvement.  See if it may be improved further.
    return Blockly.Cake.Tooltip.wrapMutate_(words, bestBreaks, limit);
  }
  // No improvements found.  Done.
  return wordBreaks;
};

/**
 * Reassemble the array of words into text, with the specified line breaks.
 * @param {!Array.<string>} words Array of each word.
 * @param {!Array.<boolean>} wordBreaks Array of line breaks.
 * @return {string} Plain text.
 * @private
 */
Blockly.Cake.Tooltip.wrapToText_ = function(words, wordBreaks) {
  var text = [];
  for (var i = 0; i < words.length; i++) {
    text.push(words[i]);
    if (wordBreaks[i] !== undefined) {
      text.push(wordBreaks[i] ? '\n' : ' ');
    }
  }
  return text.join('');
};
