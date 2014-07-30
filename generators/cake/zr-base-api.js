/**
 * Visual Blocks Editor
 *
 * Copyright 2014 Massachusetts Institute of Technology
 * http://zerorobotics.org/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Generating C++ for basic ZR API blocks.
 * @author dininno@mit.edu (Ethan DiNinno)
 */
'use strict';

//Generic generator for void functions with one argument
Blockly.cake['proto_oneArgumentNoReturn'] = function(block) {
	var func = block.getFieldValue('FUNCTION');
	var arg = Blockly.cake.valueToCode(block, 'ARGUMENT',
			Blockly.cake.ORDER_NONE);
	var code = func + '(' + arg + ');\n';
	return code;
};

Blockly.cake['spheres_setTarget'] = Blockly.cake['proto_oneArgumentNoReturn'];
Blockly.cake['spheres_getZRState'] = Blockly.cake['proto_oneArgumentNoReturn'];

Blockly.cake['spheres_getTime'] = function(block) {
	return ['api.getTime()', Blockly.cake.ORDER_FUNCTION_CALL];
};

Blockly.cake['spheres_setPos'] = function(block) {
	var x = Blockly.cake.valueToCode(block, 'X',
			Blockly.cake.ORDER_COMMA) || '0';
	var y = Blockly.cake.valueToCode(block, 'Y',
			Blockly.cake.ORDER_COMMA) || '0';
	var z = Blockly.cake.valueToCode(block, 'Z',
			Blockly.cake.ORDER_COMMA) || '0';
	var code = 'setPos(' + x + ', ' + y + ', ' + z + ');\n';
	return code;
};
