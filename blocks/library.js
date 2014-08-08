'use strict';

goog.provide('Blockly.Blocks.library');

goog.require('Blockly.Blocks');

// Blockly.Blocks['library_func_paren'] = {
//   init: function() {
//     this.setHelpUrl('http://www.example.com/');
//     this.setColour(260);
//     this.appendDummyInput()
//         .setAlign(Blockly.ALIGN_CENTRE)
//         .appendField(new Blockly.FieldImage("../../media/leftBracket.png", 15, 15, "("))
//         .appendField(new Blockly.FieldTextInput(''), 'INTEXT')
//         .appendField(new Blockly.FieldImage("../../media/rightBracket.png", 15, 15, ")"));
//     this.setOutput(true, "String");
//     this.setTooltip('');
//   }
// };

// Blockly.Blocks['library_include'] = {
//   init: function() {
//     this.setHelpUrl('http://www.example.com/');
//     this.setColour(260);
//     this.appendDummyInput()
//         .setAlign(Blockly.ALIGN_CENTRE)
//         .appendField("#include <")
//         .appendField(new Blockly.FieldTextInput(""), "FILE")
//         .appendField(">");
//     this.setPreviousStatement(true, "null");
//     this.setNextStatement(true, "null");
//     this.setTooltip('');
//   }
// };

Blockly.Blocks['library_func_paren'] = {
  /**
   * Block for text value.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.TEXT_TEXT_HELPURL);
    this.setColour(260);
    this.appendDummyInput()
        .appendField(this.newBracket_(true))
        .appendField(new Blockly.FieldTextInput(' '), 'TEXT')
        .appendField(this.newBracket_(false));
    this.setOutput(true, 'INBRACKET');
    this.setTooltip(Blockly.Msg.TEXT_TEXT_TOOLTIP);

  },
  /**
   * Create an image of an open or closed quote.
   * @param {boolean} open True if open quote, false if closed.
   * @return {!Blockly.FieldImage} The field image of the quote.
   * @private
   */
  newBracket_: function(open) {
    if (open == Blockly.RTL) {
      var file = 'rightBracket.png';
    } else {
      var file = 'leftBracket.png';
    }
    return new Blockly.FieldImage(Blockly.pathToBlockly + 'media/' + file,
                                  15, 15, '"');
  }
};

Blockly.Blocks['library_stdio_printf'] = {
  /**
   * Block for [printf function] in c
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.TEXT_PRINT_HELPURL);
    this.setColour(260);
    this.interpolateMsg(Blockly.Msg.STDIO_PRINTF_TITLE,
                        ['TEXT', 'INBRACKET', Blockly.ALIGN_RIGHT],
                        Blockly.ALIGN_RIGHT);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.TEXT_PRINT_TOOLTIP);

  }
  //text block's newQuote replaces this.newQuote
};

Blockly.Blocks['library_stdio_scanf'] = {
  /**
   * Block for [printf function] in c
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.TEXT_PRINT_HELPURL);
    this.setColour(260);
    this.interpolateMsg(Blockly.Msg.STDIO_SCANF_TITLE,
                        ['TEXT', 'INBRACKET', Blockly.ALIGN_RIGHT],
                        Blockly.ALIGN_RIGHT);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.TEXT_PRINT_TOOLTIP);
  }
};

