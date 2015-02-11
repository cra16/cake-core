'use strict';

goog.provide('Blockly.Blocks.stdio');

goog.require('Blockly.Blocks');

Blockly.Blocks['library_stdio_printf'] = {
    /**
     * Block for [printf function] in C.
     * @this Blockly.Block
     */
    init: function() {
        this.setHelpUrl(Blockly.Msg.TEXT_PRINT_HELPURL);
        this.setColour(300);
        this.appendValueInput('VAR0')
            .setCheck(['Variable', 'String'])
            .appendField(Blockly.Msg.STDIO_PRINTF_TITLE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setMutator(new Blockly.Mutator(['library_stdio_printf_add']));
        this.setTooltip(Blockly.Msg.TEXT_PRINT_TOOLTIP);
        this.printAddCount_ = 0;
    },
    /**
     * Create XML to represent the number of printf inputs.
     * @return {Element} XML storage element.
     * @this Blockly.Block
     */
    mutationToDom: function() {
        if (!this.printAddCount_) {
            return null;
        }
        var container = document.createElement('mutation');
        if (this.printAddCount_) {
            container.setAttribute('printadd', this.printAddCount_);
        }
        return container;
    },
    /**
     * Parse XML to restore printf inputs.
     * @param {!Element} xmlElement XML storage element.
     * @this Blockly.Block
     */
    domToMutation: function(xmlElement) {
        this.printAddCount_ = parseInt(xmlElement.getAttribute('printadd'), 10);
        for (var x = 1; x <= this.printAddCount_; x++) {
            this.appendValueInput('VAR' + x)
                .setCheck(null)
                .appendField(Blockly.Msg.STDIO_PRINTF_TITLE);

        }
    },
    /**
     * Populate the mutator's dialog with this block's components.
     * @param {!Blockly.Workspace} workspace Mutator's workspace.
     * @return {!Blockly.Block} Root block in mutator.
     * @this Blockly.Block
     */
    decompose: function(workspace) {
        var containerBlock = Blockly.Block.obtain(workspace, 'library_stdio_printf_printf');
        containerBlock.initSvg();
        var connection = containerBlock.getInput('STACK').connection;
        for (var x = 1; x <= this.printAddCount_; x++) {
            var printAddBlock = Blockly.Block.obtain(workspace, 'library_stdio_printf_add');
            printAddBlock.initSvg();
            connection.connect(printAddBlock.previousConnection);
            connection = printAddBlock.nextConnection;
        }
        return containerBlock;
    },
    /**
     * Reconfigure this block based on the mutator dialog's components.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
    compose: function(containerBlock) {
        // Disconnect all the elseif input blocks and remove the inputs.
        for (var x = this.printAddCount_; x > 0; x--) {
            this.removeInput('VAR' + x);
        }
        this.printAddCount_ = 0;
        // Rebuild the block's optional inputs.
        var clauseBlock = containerBlock.getInputTargetBlock('STACK');
        while (clauseBlock) {
            switch (clauseBlock.type) {
                case 'library_stdio_printf_add':
                    this.printAddCount_++;
                    var printInput = this.appendValueInput('VAR' + this.printAddCount_)
                        .setCheck(null)
                        .appendField('');
                    // Reconnect any child blocks.
                    if (clauseBlock.valueConnection_) {
                        printInput.connection.connect(clauseBlock.valueConnection_);
                    }
                    break;
                default:
                    throw 'Unknown block type.';
            }
            clauseBlock = clauseBlock.nextConnection &&
            clauseBlock.nextConnection.targetBlock();
        }
    },
    /**
     * Store pointers to any connected child blocks.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
    saveConnections: function(containerBlock) {
        var clauseBlock = containerBlock.getInputTargetBlock('STACK');
        var x = 1;
        while (clauseBlock) {
            switch (clauseBlock.type) {
                case 'library_stdio_printf_add':
                    var inputPrint = this.getInput('VAR' + x);
                    clauseBlock.valueConnection_ =
                        inputPrint && inputPrint.connection.targetConnection;
                    clauseBlock.statementConnection_ =
                    x++;
                    break;
                default:
                    throw 'Unknown block type.';
            }
            clauseBlock = clauseBlock.nextConnection &&
            clauseBlock.nextConnection.targetBlock();
        }
    },
    //when the block is changed,
    onchange: Blockly.Blocks.requireInFunction
};

Blockly.Blocks['library_stdio_printf_printf'] = {
    /**
     * Mutator block for printf_add container.
     * @this Blockly.Block
     */
    init: function() {
        this.setColour(300);
        this.appendDummyInput()
            .appendField(Blockly.Msg.STDIO_PRINTF_TITLE);
        this.appendStatementInput('STACK');
        this.setTooltip(Blockly.Msg.TEXT_PRINT_TOOLTIP);
        this.contextMenu = false;
    }
};

Blockly.Blocks['library_stdio_printf_add'] = {
    /**
     * Mutator bolck for printf_add condition.
     * @this Blockly.Block
     */
    init: function() {
        this.setColour(300);
        this.appendDummyInput()
            .appendField(Blockly.Msg.STDIP_PRINTF_MUTATOR_PRINTFADD_TITLE);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip(Blockly.Msg.TEXT_PRINT_TOOLTIP);
        this.contextMenu = false;
    }
};

Blockly.Blocks['library_stdio_text'] = {
    /**
     * Block for text value.
     * @this Blockly.Block
     */
    init: function() {
        this.setHelpUrl(Blockly.Msg.TEXT_TEXT_HELPURL);
        this.setColour(160);
        this.appendDummyInput()
            .appendField(this.newQuote_(true))
            .appendField(new Blockly.FieldTextInput(''), 'TEXT')
            .appendField(this.newQuote_(false));
        this.setOutput(true, 'String');
        this.setTooltip(Blockly.Msg.TEXT_TEXT_TOOLTIP);
    },
    /**
     * Create an image of an open or closed quote.
     * @param {boolean} open True if open quote, false if closed.
     * @return {!Blockly.FieldImage} The field image of the quote.
     * @private
     */
    newQuote_: function(open) {
        if (open == Blockly.RTL) {
            var file = 'quote1.png';
        } else {
            var file = 'quote0.png';
        }
        return new Blockly.FieldImage(Blockly.pathToBlockly + 'media/' + file,
            12, 12, '"');
    },
    onchange: Blockly.Blocks.requireInFunction
    //when the block is changed,
};

Blockly.Blocks['library_stdio_newLine'] = {
    /**
     * Block for text value.
     * @this Blockly.Block
     */
    init: function() {
        this.setHelpUrl(Blockly.Msg.STDIO_NEWLINE_HELPURL);
        this.setColour(160);
        this.interpolateMsg(Blockly.Msg.STDIO_NEWLINE_TITLE,
            Blockly.ALIGN_RIGHT);
        this.setOutput(true, 'String');
        this.setTooltip(Blockly.Msg.STDIO_NEWLINE_TOOLTIP);
    },
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