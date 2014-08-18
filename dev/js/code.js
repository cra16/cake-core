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
}

function toXml() {
  var output = document.getElementById('importExport');
  var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
  output.value = Blockly.Xml.domToPrettyText(xml);
  output.focus();
  output.select();
}

function fromXml() {
  var input = document.getElementById('importExport');
  var xml = Blockly.Xml.textToDom(input.value);
  Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml);
}

function toCode(lang) {
  var output = document.getElementById('importExport');
  output.innerHTML = Blockly[lang].workspaceToCode();
}