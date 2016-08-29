'use strict';

goog.provide('Blockly.Cake.Blocks.stdlib');

goog.require('Blockly.Cake.Blocks');

Blockly.Cake.Blocks['library_stdlib_convert'] = {
    /**
     * Block for atoi(), atof()
     * @this Blockly.Cake.Block
     */
    init: function() {
        var OPERATORS =
            [
                [Blockly.Cake.Msg.STDLIB_CONVERT_INT, 'INT'],
                [Blockly.Cake.Msg.STDLIB_CONVERT_DOUBLE, 'DOUBLE']
            ];
        this.setColour(280);
        this.setOutput(true, 'Number');
        this.interpolateMsg(Blockly.Cake.Msg.STDLIB_CONVERT_TITLE,
            ['VAR', ['Variable', 'VAR_CHAR', 'String', 'CHAR'], Blockly.Cake.ALIGN_RIGHT],
            ['OPERATORS', new Blockly.Cake.FieldDropdown(OPERATORS)],
            Blockly.Cake.ALIGN_RIGHT);
        this.setTooltip(Blockly.Cake.Msg.STDLIB_CONVERT_HELPURL);
        this.tag = Blockly.Cake.Msg.TAG_STDLIB_CONVERT;
    },
    //when the block is changed,
    onchange: Blockly.Cake.Blocks.requireInFunction
};

Blockly.Cake.Blocks['library_stdlib_rand'] = {
  /**
   * Block for rand()
   * @this Blockly.Cake.Block
   */
  init: function() {
      this.setColour(280);
      this.setOutput(true);
      this.interpolateMsg(Blockly.Cake.Msg.STDLIB_RAND_TITLE,
          ['VAR', 'SCOPE', Blockly.Cake.ALIGN_RIGHT],
          Blockly.Cake.ALIGN_RIGHT);
      this.setTooltip(Blockly.Cake.Msg.STDLIB_RAND_TOOLTIP);
      this.tag = Blockly.Cake.Msg.TAG_STDLIB_RAND;
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

Blockly.Cake.Blocks['library_stdlib_rand_scope'] = {
    /**
     * Scope Block for rand()
     * @this Blockly.Cake.Block
     */
    init: function() {
        this.setColour(280);
        this.setOutput(true, 'SCOPE');
        this.interpolateMsg(Blockly.Cake.Msg.STDLIB_RANDSCOPE_TITLE,
            ['A', ['Number', 'INT', 'Variable', 'VAR_INT', 'VAR_UNINT'], Blockly.Cake.ALIGN_RIGHT],
            ['B', ['Number', 'INT', 'Variable', 'VAR_INT', 'VAR_UNINT'], Blockly.Cake.ALIGN_RIGHT],
            Blockly.Cake.ALIGN_RIGHT);
        this.setTooltip(Blockly.Cake.Msg.STDLIB_RAND_TOOLTIP);
    },
    //when the block is changed,
    onchange: Blockly.Cake.Blocks.requireInFunction
};

Blockly.Cake.Blocks['library_stdlib_number_forRandScope1'] = {
    /**
     * Block for numeric value.
     * @this Blockly.Cake.Block
     */
    init: function() {
        this.setColour(240);
        this.appendDummyInput()
            .appendField(new Blockly.Cake.FieldTextInput('1',
                Blockly.Cake.FieldTextInput.numberValidator), 'NUM');
        this.setOutput(true, 'Number');
        this.setTooltip(Blockly.Cake.Msg.MATH_NUMBER_TOOLTIP);
    },
    //when the block is changed,
    onchange: Blockly.Cake.Blocks.requireInFunction
};

Blockly.Cake.Blocks['library_stdlib_number_forRandScope100'] = {
    /**
     * Block for numeric value.
     * @this Blockly.Cake.Block
     */
    init: function() {
        this.setColour(240);
        this.appendDummyInput()
            .appendField(new Blockly.Cake.FieldTextInput('100',
                Blockly.Cake.FieldTextInput.numberValidator), 'NUM');
        this.setOutput(true, 'Number');
        this.setTooltip(Blockly.Cake.Msg.MATH_NUMBER_TOOLTIP);
    },
    //when the block is changed,
    onchange: Blockly.Cake.Blocks.requireInFunction
};

Blockly.Cake.Blocks['library_stdlib_malloc'] = {
  /**
   * Block for malloc()
   * @this Blockly.Cake.Block
   */
  init: function() {
      this.setColour(280);
      this.setOutput(true, 'Pointer');
      this.interpolateMsg(Blockly.Cake.Msg.STDLIB_MALLOC_TITLE,
          ['VAR', null, Blockly.Cake.ALIGN_RIGHT],
          Blockly.Cake.ALIGN_RIGHT);
      this.setInputsInline(true);
      this.setTooltip(Blockly.Cake.Msg.STDLIB_MALLOC_TOOLTIP);
      this.tag = Blockly.Cake.Msg.TAG_STDLIB_MALLOC;
  },
  //when the block is changed, 
  onchange: Blockly.Cake.Blocks.requireInFunction
};

Blockly.Cake.Blocks['library_stdlib_sizeof_forMalloc'] = {
    /**
     * Block for sizeof()
     * @this Blockly.Cake.Block
     */
    init: function() {
        this.setColour(200);
        this.setOutput(true, 'Number');
        this.interpolateMsg(Blockly.Cake.Msg.STDLIB_SIZEOFFORMALLOC_TITLE,
            ['VAR', null, Blockly.Cake.ALIGN_RIGHT],
            Blockly.Cake.ALIGN_RIGHT);
        this.setInputsInline(true);
        this.setTooltip(Blockly.Cake.Msg.STDLIB_SIZEOFFORMALLOC_TOOLTIP);
    },
    //when the block is changed,
    onchange: Blockly.Cake.Blocks.requireInFunction
};

Blockly.Cake.Blocks['library_stdlib_arithmetic_forMalloc'] = {
    /**
     * Block for basic arithmetic operator.
     * @this Blockly.Cake.Block
     */
    init: function() {
        this.setColour(240);
        this.setOutput(true, 'Number');
        this.interpolateMsg(Blockly.Cake.Msg.STDLIB_ARITHFORMALLOC_TITLE,
            ['A', null, Blockly.Cake.ALIGN_RIGHT],
            ['B', 'Number', Blockly.Cake.ALIGN_RIGHT],
            Blockly.Cake.ALIGN_RIGHT);
        this.setInputsInline(true);
        this.setTooltip(Blockly.Cake.Msg.MATH_ARITHMETIC_TOOLTIP_MULTIPLY);
        this.tag = Blockly.Cake.Msg.TAG_STDLIB_SIZEOF;
    },
    //when the block is changed,
    onchange: Blockly.Cake.Blocks.requireInFunction
};

Blockly.Cake.Blocks['library_stdlib_number_forMalloc'] = {
    /**
     * Block for numeric value.
     * @this Blockly.Cake.Block
     */
    init: function() {
        this.setColour(240);
        this.appendDummyInput()
            .appendField(new Blockly.Cake.FieldTextInput('1',
                Blockly.Cake.FieldTextInput.numberValidator), 'NUM');
        this.setOutput(true, 'Number');
        this.setTooltip(Blockly.Cake.Msg.MATH_NUMBER_TOOLTIP);
    },
    //when the block is changed,
    onchange: Blockly.Cake.Blocks.requireInFunction
};

Blockly.Cake.Blocks['library_stdlib_free'] = {
  /**
   * Block for free()
   * @this Blockly.Cake.Block
   */
      init: function() {
      this.setColour(280);
      this.interpolateMsg(Blockly.Cake.Msg.STDLIB_FREE_TITLE,
          ['VAR', ['Pointer', 'PTR_INT', 'PTR_UNINT', 'PTR_FLOAT', 'PTR_DOUBLE', 'PTR_CHAR',
          'DBPTR_INT', 'DBPTR_UNINT', 'DBPTR_FLOAT', 'DBPTR_DOUBLE', 'DBPTR_CHAR'], Blockly.Cake.ALIGN_RIGHT],
          Blockly.Cake.ALIGN_RIGHT);
      this.setInputsInline(true);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(Blockly.Cake.Msg.STDLIB_FREE_TOOLTIP);
      this.tag = Blockly.Cake.Msg.TAG_STDLIB_FREE;
  },
  //when the block is changed,
  onchange: Blockly.Cake.Blocks.requireInFunction
};

Blockly.Cake.Blocks['library_stdlib_exit'] = {
  /**
   * Block for exit()
   * @this Blockly.Cake.Block
   */
  init: function() {
      var OPERATORS =
          [
              [Blockly.Cake.Msg.STDLIB_EXIT_SUCCESS, 'SUCCESS'],
              [Blockly.Cake.Msg.STDLIB_EXIT_FAILURE, 'FAILURE']
          ];
      this.setColour(280);
      this.interpolateMsg(Blockly.Cake.Msg.STDLIB_EXIT_TITLE,
          ['OPERATORS', new Blockly.Cake.FieldDropdown(OPERATORS)],
          Blockly.Cake.ALIGN_RIGHT);
      this.setPreviousStatement(true);
      this.setTooltip(Blockly.Cake.Msg.STDLIB_EXIT_HELPURL);
      this.tag = Blockly.Cake.Msg.TAG_STDLIB_EXIT;
  },
  //when the block is changed, 
  onchange: Blockly.Cake.Blocks.requireInFunction
};