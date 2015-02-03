'use strict';

goog.provide('Blockly.Blocks.stdlib');

goog.require('Blockly.Blocks');

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

  },
  //when the block is changed, 
  onchange: Blockly.Blocks.requireInFunction
  
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

  },
  //when the block is changed, 
  onchange: Blockly.Blocks.requireInFunction
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

  },
  //when the block is changed, 
  onchange: Blockly.Blocks.requireInFunction
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

  },
  //when the block is changed, 
  onchange: Blockly.Blocks.requireInFunction
};

Blockly.Blocks['library_stdlib_exit'] = {
  /**
   * Block for exit()
   * @this Blockly.Block
   */
  init: function() {
      var OPERATORS =
          [
              [Blockly.Msg.STDLIB_EXIT_SUCCESS, 'SUCCESS'],
              [Blockly.Msg.STDLIB_EXIT_FAILURE, 'FAILURE']
          ];
      this.setHelpUrl(Blockly.Msg.STDLIB_EXIT_HELPURL);
      this.setColour(300);
      this.interpolateMsg(Blockly.Msg.STDLIB_EXIT_TITLE,
          ['OPERATORS', new Blockly.FieldDropdown(OPERATORS)],
          Blockly.ALIGN_RIGHT);
      this.setPreviousStatement(true);
      this.setTooltip(Blockly.Msg.STDLIB_EXIT_HELPURL);
  },
  //when the block is changed, 
  onchange: Blockly.Blocks.requireInFunction
};