'use strict';

goog.provide('Blockly.Blocks.stdio');

goog.require('Blockly.Blocks');

Blockly.Blocks['stdio_printf'] = {
  /**
   * Block for [printf function] in c
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.TEXT_PRINT_HELPURL);
    this.setColour(160);
    this.interpolateMsg(Blockly.Msg.TEXT_PRINT_TITLE,
                        ['TEXT', null, Blockly.ALIGN_RIGHT],
                        Blockly.ALIGN_RIGHT);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.TEXT_PRINT_TOOLTIP);
  }
};