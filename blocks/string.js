'use strict';

goog.provide('Blockly.Blocks.string');

goog.require('Blockly.Blocks');

Blockly.Blocks['library_string_strlen'] = {
    /**
     * Block for strlen()
     * @this Blockly.Block
     */
    init: function() {
        this.setColour(320);
        this.setOutput(true, 'Number');
        this.interpolateMsg(Blockly.Msg.STRING_STRLEN_TITLE,
            ['VAR', ['String', 'STR', 'PTR_CHAR', 'Pointer', 'DBPTR_CHAR'], Blockly.ALIGN_RIGHT],
            Blockly.ALIGN_RIGHT);
        this.setInputsInline(true);
        this.setTooltip(Blockly.Msg.STRING_STRLEN_TOOLTIP);
        this.tag = Blockly.Msg.TAG_STRING_STRLEN;
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
        this.setColour(320);
        this.setOutput(true, 'String');
        this.interpolateMsg(Blockly.Msg.STRING_STRCAT_TITLE,
            ['STR1', ['String', 'STR', 'PTR_CHAR', 'Pointer', 'DBPTR_CHAR'], Blockly.ALIGN_RIGHT],
            ['STR2', ['String', 'STR', 'PTR_CHAR', 'Pointer', 'DBPTR_CHAR'], Blockly.ALIGN_RIGHT],
            Blockly.ALIGN_RIGHT);
        this.setInputsInline(true);
        this.setTooltip(Blockly.Msg.STRING_STRCAT_TOOLTIP);
        this.tag = Blockly.Msg.TAG_STRING_STRCAT;
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
        this.setColour(320);
        this.setOutput(true, 'String');
        this.interpolateMsg(Blockly.Msg.STRING_STRCPY_TITLE,
            ['STR1', ['String', 'STR', 'PTR_CHAR', 'Pointer', 'DBPTR_CHAR'], Blockly.ALIGN_RIGHT],
            ['STR2', ['String', 'STR', 'PTR_CHAR', 'Pointer', 'DBPTR_CHAR'], Blockly.ALIGN_RIGHT],
            Blockly.ALIGN_RIGHT);
        this.setInputsInline(true);
        this.setTooltip(Blockly.Msg.STRING_STRCPY_TOOLTIP);
        this.tag = Blockly.Msg.TAG_STRING_STRCPY;
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
        this.setColour(320);
        this.setOutput(true, 'String');
        this.interpolateMsg(Blockly.Msg.STRING_STRCMP_TITLE,
            ['STR1', ['String', 'STR', 'PTR_CHAR', 'Pointer', 'DBPTR_CHAR'], Blockly.ALIGN_RIGHT],
            ['STR2', ['String', 'STR', 'PTR_CHAR', 'Pointer', 'DBPTR_CHAR'], Blockly.ALIGN_RIGHT],
            Blockly.ALIGN_RIGHT);
        this.setInputsInline(true);
        this.setTooltip(Blockly.Msg.STRING_STRCMP_TOOLTIP);
        this.tag = Blockly.Msg.TAG_STRING_STRCMP;
    },
    //when the block is changed,
    onchange: Blockly.Blocks.requireInFunction
};