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

Blockly.Blocks['library_string_strcat'] = {
    /**
     * Block for strlen()
     * @this Blockly.Block
     */
    init: function() {
        this.setHelpUrl(Blockly.Msg.STRING_STRCAT_HELPURL);
        this.setColour(300);
        this.setOutput(true, 'String');
        this.interpolateMsg(Blockly.Msg.STRING_STRCAT_TITLE,
            ['STR1', null, Blockly.ALIGN_RIGHT],
            ['STR2', null, Blockly.ALIGN_RIGHT],
            Blockly.ALIGN_RIGHT);
        this.setInputsInline(true);
        this.setTooltip(Blockly.Msg.STRING_STRCAT_HELPURL);
    },
    //when the block is changed,
    onchange: Blockly.Blocks.requireInFunction
};

Blockly.Blocks['library_string_strcpy'] = {
    /**
     * Block for strlen()
     * @this Blockly.Block
     */
    init: function() {
        this.setHelpUrl(Blockly.Msg.STRING_STRCPY_HELPURL);
        this.setColour(300);
        this.setOutput(true, 'String');
        this.interpolateMsg(Blockly.Msg.STRING_STRCPY_TITLE,
            ['STR1', null, Blockly.ALIGN_RIGHT],
            ['STR2', null, Blockly.ALIGN_RIGHT],
            Blockly.ALIGN_RIGHT);
        this.setInputsInline(true);
        this.setTooltip(Blockly.Msg.STRING_STRCPY_HELPURL);
    },
    //when the block is changed,
    onchange: Blockly.Blocks.requireInFunction
};

Blockly.Blocks['library_string_strcmp'] = {
    /**
     * Block for strlen()
     * @this Blockly.Block
     */
    init: function() {
        this.setHelpUrl(Blockly.Msg.STRING_STRCMP_HELPURL);
        this.setColour(300);
        this.setOutput(true, 'String');
        this.interpolateMsg(Blockly.Msg.STRING_STRCMP_TITLE,
            ['STR1', null, Blockly.ALIGN_RIGHT],
            ['STR2', null, Blockly.ALIGN_RIGHT],
            Blockly.ALIGN_RIGHT);
        this.setInputsInline(true);
        this.setTooltip(Blockly.Msg.STRING_STRCMP_HELPURL);
    },
    //when the block is changed,
    onchange: Blockly.Blocks.requireInFunction
};