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
 * @fileoverview Angle input field.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Cake.FieldAngle');

goog.require('Blockly.Cake.FieldTextInput');


/**
 * Class for an editable angle field.
 * @param {string} text The initial content of the field.
 * @param {Function} opt_changeHandler An optional function that is called
 *     to validate any constraints on what the user entered.  Takes the new
 *     text as an argument and returns the accepted text or null to abort
 *     the change.
 * @extends {Blockly.Cake.Field}
 * @constructor
 */
Blockly.Cake.FieldAngle = function(text, opt_changeHandler) {
  var changeHandler;
  if (opt_changeHandler) {
    // Wrap the user's change handler together with the angle validator.
    var thisObj = this;
    changeHandler = function(value) {
      value = Blockly.Cake.FieldAngle.angleValidator.call(thisObj, value);
      if (value !== null) {
        opt_changeHandler.call(thisObj, value);
      }
      return value;
    };
  } else {
    changeHandler = Blockly.Cake.FieldAngle.angleValidator;
  }

  // Add degree symbol: "360°" (LTR) or "°360" (RTL)
  this.symbol_ = Blockly.Cake.createSvgElement('tspan', {}, null);
  this.symbol_.appendChild(document.createTextNode('\u00B0'));

  Blockly.Cake.FieldAngle.superClass_.constructor.call(this,
      text, changeHandler);
};
goog.inherits(Blockly.Cake.FieldAngle, Blockly.Cake.FieldTextInput);

/**
 * Clone this FieldAngle.
 * @return {!Blockly.Cake.FieldAngle} The result of calling the constructor again
 *   with the current values of the arguments used during construction.
 */
Blockly.Cake.FieldAngle.prototype.clone = function() {
  return new Blockly.Cake.FieldAngle(this.getText(), this.changeHandler_);
};

/**
 * Round angles to the nearest 15 degrees when using mouse.
 * Set to 0 to disable rounding.
 */
Blockly.Cake.FieldAngle.ROUND = 15;

/**
 * Half the width of protractor image.
 */
Blockly.Cake.FieldAngle.HALF = 100 / 2;

/**
 * Radius of protractor circle.  Slightly smaller than protractor size since
 * otherwise SVG crops off half the border at the edges.
 */
Blockly.Cake.FieldAngle.RADIUS = Blockly.Cake.FieldAngle.HALF - 1;

/**
 * Clean up this FieldAngle, as well as the inherited FieldTextInput.
 * @return {!Function} Closure to call on destruction of the WidgetDiv.
 * @private
 */
Blockly.Cake.FieldAngle.prototype.dispose_ = function() {
  var thisField = this;
  return function() {
    Blockly.Cake.FieldAngle.superClass_.dispose_.call(thisField)();
    thisField.gauge_ = null;
    if (thisField.clickWrapper_) {
      Blockly.Cake.unbindEvent_(thisField.clickWrapper_);
    }
    if (thisField.moveWrapper1_) {
      Blockly.Cake.unbindEvent_(thisField.moveWrapper1_);
    }
    if (thisField.moveWrapper2_) {
      Blockly.Cake.unbindEvent_(thisField.moveWrapper2_);
    }
  };
};

/**
 * Show the inline free-text editor on top of the text.
 * @private
 */
Blockly.Cake.FieldAngle.prototype.showEditor_ = function() {
  var noFocus =
      goog.userAgent.MOBILE || goog.userAgent.ANDROID || goog.userAgent.IPAD;
  // Mobile browsers have issues with in-line textareas (focus & keyboards).
  Blockly.Cake.FieldAngle.superClass_.showEditor_.call(this, noFocus);
  var div = Blockly.Cake.WidgetDiv.DIV;
  if (!div.firstChild) {
    // Mobile interface uses window.prompt.
    return;
  }
  // Build the SVG DOM.
  var svg = Blockly.Cake.createSvgElement('svg', {
    'xmlns': 'http://www.w3.org/2000/svg',
    'xmlns:html': 'http://www.w3.org/1999/xhtml',
    'xmlns:xlink': 'http://www.w3.org/1999/xlink',
    'version': '1.1',
    'height': (Blockly.Cake.FieldAngle.HALF * 2) + 'px',
    'width': (Blockly.Cake.FieldAngle.HALF * 2) + 'px'
  }, div);
  var circle = Blockly.Cake.createSvgElement('circle', {
    'cx': Blockly.Cake.FieldAngle.HALF, 'cy': Blockly.Cake.FieldAngle.HALF,
    'r': Blockly.Cake.FieldAngle.RADIUS,
    'class': 'blocklyAngleCircle'
  }, svg);
  this.gauge_ = Blockly.Cake.createSvgElement('path',
      {'class': 'blocklyAngleGauge'}, svg);
  this.line_ = Blockly.Cake.createSvgElement('line',
      {'x1': Blockly.Cake.FieldAngle.HALF,
      'y1': Blockly.Cake.FieldAngle.HALF,
      'class': 'blocklyAngleLine'}, svg);
  // Draw markers around the edge.
  for (var a = 0; a < 360; a += 15) {
    Blockly.Cake.createSvgElement('line', {
      'x1': Blockly.Cake.FieldAngle.HALF + Blockly.Cake.FieldAngle.RADIUS,
      'y1': Blockly.Cake.FieldAngle.HALF,
      'x2': Blockly.Cake.FieldAngle.HALF + Blockly.Cake.FieldAngle.RADIUS -
          (a % 45 == 0 ? 10 : 5),
      'y2': Blockly.Cake.FieldAngle.HALF,
      'class': 'blocklyAngleMarks',
      'transform': 'rotate(' + a + ', ' +
          Blockly.Cake.FieldAngle.HALF + ', ' + Blockly.Cake.FieldAngle.HALF + ')'
    }, svg);
  }
  svg.style.marginLeft = '-35px';
  this.clickWrapper_ =
      Blockly.Cake.bindEvent_(svg, 'click', this, Blockly.Cake.WidgetDiv.hide);
  this.moveWrapper1_ =
      Blockly.Cake.bindEvent_(circle, 'mousemove', this, this.onMouseMove);
  this.moveWrapper2_ =
      Blockly.Cake.bindEvent_(this.gauge_, 'mousemove', this, this.onMouseMove);
  this.updateGraph_();
};

/**
 * Set the angle to match the mouse's position.
 * @param {!Event} e Mouse move event.
 */
Blockly.Cake.FieldAngle.prototype.onMouseMove = function(e) {
  var bBox = this.gauge_.ownerSVGElement.getBoundingClientRect();
  var dx = e.clientX - bBox.left - Blockly.Cake.FieldAngle.HALF;
  var dy = e.clientY - bBox.top - Blockly.Cake.FieldAngle.HALF;
  var angle = Math.atan(-dy / dx);
  if (isNaN(angle)) {
    // This shouldn't happen, but let's not let this error propogate further.
    return;
  }
  angle = angle / Math.PI * 180;
  // 0: East, 90: North, 180: West, 270: South.
  if (dx < 0) {
    angle += 180;
  } else if (dy > 0) {
    angle += 360;
  }
  if (Blockly.Cake.FieldAngle.ROUND) {
    angle = Math.round(angle / Blockly.Cake.FieldAngle.ROUND) *
        Blockly.Cake.FieldAngle.ROUND;
  }
  if (angle >= 360) {
    // Rounding may have rounded up to 360.
    angle -= 360;
  }
  angle = String(angle);
  Blockly.Cake.FieldTextInput.htmlInput_.value = angle;
  this.setText(angle);
};

/**
 * Insert a degree symbol.
 * @param {?string} text New text.
 */
Blockly.Cake.FieldAngle.prototype.setText = function(text) {
  Blockly.Cake.FieldAngle.superClass_.setText.call(this, text);
  this.updateGraph_();
  // Insert degree symbol.
  if (Blockly.Cake.RTL) {
    this.textElement_.insertBefore(this.symbol_, this.textElement_.firstChild);
  } else {
    this.textElement_.appendChild(this.symbol_);
  }
  // Cached width is obsolete.  Clear it.
  this.size_.width = 0;
};

/**
 * Redraw the graph with the current angle.
 * @private
 */
Blockly.Cake.FieldAngle.prototype.updateGraph_ = function() {
  if (!this.gauge_) {
    return;
  }
  var angleRadians = Number(this.getText()) / 180 * Math.PI;
  if (isNaN(angleRadians)) {
    this.gauge_.setAttribute('d',
        'M ' + Blockly.Cake.FieldAngle.HALF + ', ' + Blockly.Cake.FieldAngle.HALF);
    this.line_.setAttribute('x2', Blockly.Cake.FieldAngle.HALF);
    this.line_.setAttribute('y2', Blockly.Cake.FieldAngle.HALF);
  } else {
    var x = Blockly.Cake.FieldAngle.HALF + Math.cos(angleRadians) *
        Blockly.Cake.FieldAngle.RADIUS;
    var y = Blockly.Cake.FieldAngle.HALF + Math.sin(angleRadians) *
        -Blockly.Cake.FieldAngle.RADIUS;
    var largeFlag = (angleRadians > Math.PI) ? 1 : 0;
    this.gauge_.setAttribute('d',
        'M ' + Blockly.Cake.FieldAngle.HALF + ', ' + Blockly.Cake.FieldAngle.HALF +
        ' h ' + Blockly.Cake.FieldAngle.RADIUS +
        ' A ' + Blockly.Cake.FieldAngle.RADIUS + ',' + Blockly.Cake.FieldAngle.RADIUS +
        ' 0 ' + largeFlag + ' 0 ' + x + ',' + y + ' z');
    this.line_.setAttribute('x2', x);
    this.line_.setAttribute('y2', y);
  }
};

/**
 * Ensure that only an angle may be entered.
 * @param {string} text The user's text.
 * @return {?string} A string representing a valid angle, or null if invalid.
 */
Blockly.Cake.FieldAngle.angleValidator = function(text) {
  var n = Blockly.Cake.FieldTextInput.numberValidator(text);
  if (n !== null) {
    n = n % 360;
    if (n < 0) {
      n += 360;
    }
    n = String(n);
   }
  return n;
};
