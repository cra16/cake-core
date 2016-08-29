'use strict';

goog.provide('Blockly.Cake.Blocks.string');

goog.require('Blockly.Cake.Blocks');

Blockly.Cake.Blocks['library_string_strlen'] = {
    /**
     * Block for strlen()
     * @this Blockly.Cake.Block
     */
    init: function() {
        this.setColour(320);
        this.setOutput(true, 'Number');
        this.interpolateMsg(Blockly.Cake.Msg.STRING_STRLEN_TITLE,
            ['VAR', ['String', 'STR', 'PTR_CHAR', 'Pointer', 'DBPTR_CHAR'], Blockly.Cake.ALIGN_RIGHT],
            Blockly.Cake.ALIGN_RIGHT);
        this.setInputsInline(true);
        this.setTooltip(Blockly.Cake.Msg.STRING_STRLEN_TOOLTIP);
        this.tag = Blockly.Cake.Msg.TAG_STRING_STRLEN;
    },
    //when the block is changed,
    onchange: Blockly.Cake.Blocks.requireInFunction
};

Blockly.Cake.Blocks['library_string_strcat'] = {
    /**
     * Block for strlen()
     * @this Blockly.Cake.Block
     */
    init: function() {
        this.setColour(320);
        this.setOutput(true, 'String');
        this.interpolateMsg(Blockly.Cake.Msg.STRING_STRCAT_TITLE,
            ['STR1', ['String', 'STR', 'PTR_CHAR', 'Pointer', 'DBPTR_CHAR'], Blockly.Cake.ALIGN_RIGHT],
            ['STR2', ['String', 'STR', 'PTR_CHAR', 'Pointer', 'DBPTR_CHAR'], Blockly.Cake.ALIGN_RIGHT],
            Blockly.Cake.ALIGN_RIGHT);
        this.setInputsInline(true);
        this.setTooltip(Blockly.Cake.Msg.STRING_STRCAT_TOOLTIP);
        this.tag = Blockly.Cake.Msg.TAG_STRING_STRCAT;
    },
    //when the block is changed,
    onchange: Blockly.Cake.Blocks.requireInFunction
};

Blockly.Cake.Blocks['library_string_strcpy'] = {
    /**
     * Block for strlen()
     * @this Blockly.Cake.Block
     */
    init: function() {
        this.setColour(320);
        this.setOutput(true, 'String');
        this.interpolateMsg(Blockly.Cake.Msg.STRING_STRCPY_TITLE,
            ['STR1', ['String', 'STR', 'PTR_CHAR', 'Pointer', 'DBPTR_CHAR'], Blockly.Cake.ALIGN_RIGHT],
            ['STR2', ['String', 'STR', 'PTR_CHAR', 'Pointer', 'DBPTR_CHAR'], Blockly.Cake.ALIGN_RIGHT],
            Blockly.Cake.ALIGN_RIGHT);
        this.setInputsInline(true);
        this.setTooltip(Blockly.Cake.Msg.STRING_STRCPY_TOOLTIP);
        this.tag = Blockly.Cake.Msg.TAG_STRING_STRCPY;
    },
    //when the block is changed,
    onchange: Blockly.Cake.Blocks.requireInFunction
};

Blockly.Cake.Blocks['library_string_strcmp'] = {
    /**
     * Block for strlen()
     * @this Blockly.Cake.Block
     */
    init: function() {
        this.setColour(320);
        this.setOutput(true, 'String');
        this.interpolateMsg(Blockly.Cake.Msg.STRING_STRCMP_TITLE,
            ['STR1', ['String', 'STR', 'PTR_CHAR', 'Pointer', 'DBPTR_CHAR'], Blockly.Cake.ALIGN_RIGHT],
            ['STR2', ['String', 'STR', 'PTR_CHAR', 'Pointer', 'DBPTR_CHAR'], Blockly.Cake.ALIGN_RIGHT],
            Blockly.Cake.ALIGN_RIGHT);
        this.setInputsInline(true);
        this.setTooltip(Blockly.Cake.Msg.STRING_STRCMP_TOOLTIP);
        this.tag = Blockly.Cake.Msg.TAG_STRING_STRCMP;
    },
    //when the block is changed,
    onchange: Blockly.Cake.Blocks.requireInFunction
};