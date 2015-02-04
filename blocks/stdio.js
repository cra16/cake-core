'use strict';

goog.provide('Blockly.Blocks.stdio');

goog.require('Blockly.Blocks');

Blockly.Blocks['library_func_paren'] = {
  /**
   * Block for text value.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.TEXT_TEXT_HELPURL);
    this.setColour(700);
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
    this.setColour(300);
    this.interpolateMsg(Blockly.Msg.STDIO_PRINTF_TITLE,
                        ['TEXT', 'INBRACKET', Blockly.ALIGN_RIGHT],
                        Blockly.ALIGN_RIGHT);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.TEXT_PRINT_TOOLTIP);

  },
  //text block's newQuote replaces this.newQuote
  onchange: Blockly.Blocks.requireInFunction
  //when the block is changed, 
};

Blockly.Blocks['library_stdio_scanf'] = {
  /**
   * Block for [printf function] in c
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.TEXT_PRINT_HELPURL);
    this.setColour(300);
    this.interpolateMsg(Blockly.Msg.STDIO_SCANF_TITLE,
                        ['TEXT', 'INBRACKET', Blockly.ALIGN_RIGHT],
                        Blockly.ALIGN_RIGHT);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.TEXT_PRINT_TOOLTIP);
  },
  onchange: Blockly.Blocks.requireInFunction
  //when the block is changed, 
};