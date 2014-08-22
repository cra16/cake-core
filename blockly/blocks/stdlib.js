'use strict';

goog.provide('Blockly.Blocks.stdlib');

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

Blockly.Blocks['library_stdlib_rand'] = {
  /**
   * Block for [printf function] in c
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.TEXT_PRINT_HELPURL);
    this.setColour(300);
    this.interpolateMsg(Blockly.Msg.STDLIB_RAND_TITLE,
                        ['TEXT', 'INBRACKET', Blockly.ALIGN_RIGHT],
                        Blockly.ALIGN_RIGHT);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.TEXT_PRINT_TOOLTIP);

  }
  //text block's newQuote replaces this.newQuote
};

Blockly.Blocks['library_stdlib_srand'] = {
  /**
   * Block for [printf function] in c
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.TEXT_PRINT_HELPURL);
    this.setColour(300);
    this.interpolateMsg(Blockly.Msg.STDLIB_SRAND_TITLE,
                        ['TEXT', 'INBRACKET', Blockly.ALIGN_RIGHT],
                        Blockly.ALIGN_RIGHT);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.TEXT_PRINT_TOOLTIP);

  }
  //text block's newQuote replaces this.newQuote
};

Blockly.Blocks['library_stdlib_malloc'] = {
  /**
   * Block for [printf function] in c
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.TEXT_PRINT_HELPURL);
    this.setColour(300);
    this.interpolateMsg(Blockly.Msg.STDLIB_MALLOC_TITLE,
                        ['TEXT', 'INBRACKET', Blockly.ALIGN_RIGHT],
                        Blockly.ALIGN_RIGHT);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.TEXT_PRINT_TOOLTIP);

  }
  //text block's newQuote replaces this.newQuote
};

Blockly.Blocks['library_stdlib_free'] = {
  /**
   * Block for [printf function] in c
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.TEXT_PRINT_HELPURL);
    this.setColour(300);
    this.interpolateMsg(Blockly.Msg.STDLIB_FREE_TITLE,
                        ['TEXT', 'INBRACKET', Blockly.ALIGN_RIGHT],
                        Blockly.ALIGN_RIGHT);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.TEXT_PRINT_TOOLTIP);

  }
  //text block's newQuote replaces this.newQuote
};

Blockly.Blocks['library_stdlib_exit'] = {
  /**
   * Block for [printf function] in c
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.TEXT_PRINT_HELPURL);
    this.setColour(300);
    this.interpolateMsg(Blockly.Msg.STDLIB_EXIT_TITLE,
                        ['TEXT', 'INBRACKET', Blockly.ALIGN_RIGHT],
                        Blockly.ALIGN_RIGHT);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.TEXT_PRINT_TOOLTIP);

  }
  //text block's newQuote replaces this.newQuote
};