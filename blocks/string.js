'use strict';

goog.provide('Blockly.Blocks.string');

goog.require('Blockly.Blocks');

Blockly.Blocks['library_string_strlen'] = {
    /**
     * Block for strlen()
     * @this Blockly.Block
     */
    init: function() {
        this.setHelpUrl(Blockly.Msg.STRING_STRLEN_HELPURL);
        this.setColour(300);
        this.setOutput(true, 'Number');
        this.interpolateMsg(Blockly.Msg.STRING_STRLEN_TITLE,
            ['VAR', null, Blockly.ALIGN_RIGHT],
            Blockly.ALIGN_RIGHT);
        this.setInputsInline(true);
        this.setTooltip(Blockly.Msg.STRING_STRLEN_HELPURL);
    },
    //when the block is changed,
    onchange: Blockly.Blocks.requireInFunction
};