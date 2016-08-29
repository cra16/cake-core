/**
 * Created by 최재웅 on 2015-02-11.
 */
'use strict';

goog.provide('Blockly.Cake.Blocks.time');

goog.require('Blockly.Cake.Blocks');

Blockly.Cake.Blocks['library_time_current'] = {
    /**
     * Block for printing current time
     * @this Blockly.Cake.Block
     */
    init: function() {
        this.setColour(280);
        this.interpolateMsg(Blockly.Cake.Msg.TIME_TIME_CURRENT_TITLE,
            Blockly.Cake.ALIGN_RIGHT);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip(Blockly.Cake.Msg.TIME_CURRENT_TOOLTIP);
        this.tag = Blockly.Cake.Msg.TAG_TIME_CURRENT;
    },
    getScope: function(){
        var block = this;
        if(!block.getSurroundParent()){
            return null;
        }
        else
        {
            while (block.type != 'main_block' && block.type != 'procedures_defnoreturn' && block.type != 'procedures_defreturn') {
                if (block.getSurroundParent()) {
                    block = block.getSurroundParent();
                }
            }
            if(block.type == 'main_block'){
                return block.type;
            }
            else if(block.type =='procedures_defnoreturn' || block.type == 'procedures_defreturn'){
                return block.getName();
            }
        }
    },
    //when the block is changed,
    onchange: Blockly.Cake.Blocks.requireInFunction
};

Blockly.Cake.Blocks['library_time_requiredTime'] = {
    /**
     * Block for saving time required to do
     * @this Blockly.Cake.Block
     */
    init: function() {
        this.setColour(280);
        this.interpolateMsg(Blockly.Cake.Msg.TIME_REQUIREDTIME_TITLE,
            Blockly.Cake.ALIGN_RIGHT);
        this.appendStatementInput('DO');
        this.interpolateMsg(Blockly.Cake.Msg.TIME_REQRUIEDTIME_TALE,
            ['SAVE', ['VAR_DOUBLE', 'Variable'], Blockly.Cake.ALIGN_RIGHT],
            Blockly.Cake.ALIGN_RIGHT);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);
        this.setTooltip(Blockly.Cake.Msg.TIME_REQUIREDTIME_TOOLTIP);
        this.tag = Blockly.Cake.Msg.TAG_TIME_REQUIREDTIME;
    },
    getScope: function(){
        var block = this;
        if(!block.getSurroundParent()){
            return null;
        }
        else
        {
            while (block.type != 'main_block' && block.type != 'procedures_defnoreturn' && block.type != 'procedures_defreturn') {
                if (block.getSurroundParent()) {
                    block = block.getSurroundParent();
                }
            }
            if(block.type == 'main_block'){
                return block.type;
            }
            else if(block.type =='procedures_defnoreturn' || block.type == 'procedures_defreturn'){
                return block.getName();
            }
        }
    },
    //when the block is changed,
    onchange: Blockly.Cake.Blocks.requireInFunction
};