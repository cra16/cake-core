'use strict';
// Depending on the URL argument, render as LTR or RTL.
var rtl = (document.location.search == '?rtl');
var block = null;

function enableRealtimeSpecificUi() {
  var realtimeDiv = document.getElementById('realtime');
  realtimeDiv.display = 'block';
}

function start() {
  Blockly.inject(document.getElementById('blocklyDiv'), 
      {
        path: '../', 
        toolbox: document.getElementById('toolbox')
      }
  );
  Blockly.addChangeListener(renderContent);
}

function renderContent() {
  var content = document.getElementById('codePane');
  var code = Blockly.cake.workspaceToCode();
  content.textContent = code;
  if (typeof prettyPrintOne == 'function') {
    code = content.innerHTML;
    code = prettyPrintOne(code, 'c');
    content.innerHTML = code;
  };
}