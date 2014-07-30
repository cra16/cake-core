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

Blockly.zr_cpp['zrms14_getDebrisLocation'] = function(block) {
	var debrisId = block.getFieldValue('debrisId');
	var loc = Blockly.zr_cpp.valueToCode(block, 'loc',
			Blockly.zr_cpp.ORDER_NONE);
	return 'game.getDebrisLocation(' + debrisId + ', ' + loc + ');\n';
};

Blockly.zr_cpp['zrms14_haveDebris'] = function(block) {
	var debrisId = block.getFieldValue('debrisId');
	return ['game.haveDebris(' + debrisId + ')', Blockly.zr_cpp.ORDER_FUNCTION_CALL];
};

Blockly.zr_cpp['zrms14_startLassoVoid'] = function(block) {
	var debrisId = block.getFieldValue('debrisId');
	return 'game.startLasso(' + debrisId + ');\n';
};

Blockly.zr_cpp['zrms14_startLassoBool'] = function(block) {
	var debrisId = block.getFieldValue('debrisId');
	return ['game.startLasso(' + debrisId + ')', Blockly.zr_cpp.ORDER_FUNCTION_CALL];
};

Blockly.zr_cpp['zrms14_havePack'] = function(block) {
	var player = block.getFieldValue('player');
	var objectNum = block.getFieldValue('objectNum');
	return ['game.havePack(' + player + ', ' + objectNum + ')', Blockly.zr_cpp.ORDER_FUNCTION_CALL];
};

Blockly.zr_cpp['zrms14_predictCometState'] = function(block) {
	var dtSteps = Blockly.zr_cpp.valueToCode(block, 'dtSteps',
			Blockly.zr_cpp.ORDER_NONE);
	var initState = Blockly.zr_cpp.valueToCode(block, 'initState',
			Blockly.zr_cpp.ORDER_NONE);
	var finalState = Blockly.zr_cpp.valueToCode(block, 'finalState',
			Blockly.zr_cpp.ORDER_NONE);
	return 'game.predictCometState(' + dtSteps + ', ' + initState + ', ' + finalState + ');\n';
};

Blockly.zr_cpp['zrms14_getCometState'] = function(block) {
	var state = Blockly.zr_cpp.valueToCode(block, 'state',
			Blockly.zr_cpp.ORDER_NONE);
	return 'game.getCometState(' + state + ');\n';
};

Blockly.zr_cpp['zrms14_faceTarget'] = function(block) {
	var target = Blockly.zr_cpp.valueToCode(block, 'target',
			Blockly.zr_cpp.ORDER_NONE);
	return 'game.faceTarget(' + target + ');\n';
};

Blockly.zr_cpp['zrms14_isFacingTarget'] = function(block) {
	return ['game.isFacingComet()', Blockly.zr_cpp.ORDER_FUNCTION_CALL];
};

Blockly.zr_cpp['zrms14_shootLaserBool'] = function(block) {
	return ['game.shootLaser()', Blockly.zr_cpp.ORDER_FUNCTION_CALL];
};

Blockly.zr_cpp['zrms14_shootLaserVoid'] = function(block) {
	return 'game.shootLaser();\n';
};

Blockly.zr_cpp['zrms14_laserShotsRemaining'] = function(block) {
	return ['game.laserShotsRemaining()', Blockly.zr_cpp.ORDER_FUNCTION_CALL];
};

Blockly.zr_cpp['zrms14_getMass'] = function(block) {
	return ['game.getMass()', Blockly.zr_cpp.ORDER_FUNCTION_CALL];
};

Blockly.zr_cpp['zrms14_getFuelRemaining'] = function(block) {
	return ['game.getFuelRemaining()', Blockly.zr_cpp.ORDER_FUNCTION_CALL];
};

Blockly.zr_cpp['zrms14_getScore'] = function(block) {
	return ['game.getScore()', Blockly.zr_cpp.ORDER_FUNCTION_CALL];
};

Blockly.zr_cpp['zrms14_getOtherScore'] = function(block) {
	return ['game.getOtherScore()', Blockly.zr_cpp.ORDER_FUNCTION_CALL];
};

Blockly.zr_cpp['zrms14_isSlowDownActive'] = function(block) {
	return ['game.isSlowDownActive()', Blockly.zr_cpp.ORDER_FUNCTION_CALL];
};

Blockly.zr_cpp['zrms14_isBounceActive'] = function(block) {
	return ['game.isBounceActive()', Blockly.zr_cpp.ORDER_FUNCTION_CALL];
};