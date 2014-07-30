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

Blockly.cake['zrms14_getDebrisLocation'] = function(block) {
	var debrisId = block.getFieldValue('debrisId');
	var loc = Blockly.cake.valueToCode(block, 'loc',
			Blockly.cake.ORDER_NONE);
	return 'game.getDebrisLocation(' + debrisId + ', ' + loc + ');\n';
};

Blockly.cake['zrms14_haveDebris'] = function(block) {
	var debrisId = block.getFieldValue('debrisId');
	return ['game.haveDebris(' + debrisId + ')', Blockly.cake.ORDER_FUNCTION_CALL];
};

Blockly.cake['zrms14_startLassoVoid'] = function(block) {
	var debrisId = block.getFieldValue('debrisId');
	return 'game.startLasso(' + debrisId + ');\n';
};

Blockly.cake['zrms14_startLassoBool'] = function(block) {
	var debrisId = block.getFieldValue('debrisId');
	return ['game.startLasso(' + debrisId + ')', Blockly.cake.ORDER_FUNCTION_CALL];
};

Blockly.cake['zrms14_havePack'] = function(block) {
	var player = block.getFieldValue('player');
	var objectNum = block.getFieldValue('objectNum');
	return ['game.havePack(' + player + ', ' + objectNum + ')', Blockly.cake.ORDER_FUNCTION_CALL];
};

Blockly.cake['zrms14_predictCometState'] = function(block) {
	var dtSteps = Blockly.cake.valueToCode(block, 'dtSteps',
			Blockly.cake.ORDER_NONE);
	var initState = Blockly.cake.valueToCode(block, 'initState',
			Blockly.cake.ORDER_NONE);
	var finalState = Blockly.cake.valueToCode(block, 'finalState',
			Blockly.cake.ORDER_NONE);
	return 'game.predictCometState(' + dtSteps + ', ' + initState + ', ' + finalState + ');\n';
};

Blockly.cake['zrms14_getCometState'] = function(block) {
	var state = Blockly.cake.valueToCode(block, 'state',
			Blockly.cake.ORDER_NONE);
	return 'game.getCometState(' + state + ');\n';
};

Blockly.cake['zrms14_faceTarget'] = function(block) {
	var target = Blockly.cake.valueToCode(block, 'target',
			Blockly.cake.ORDER_NONE);
	return 'game.faceTarget(' + target + ');\n';
};

Blockly.cake['zrms14_isFacingTarget'] = function(block) {
	return ['game.isFacingComet()', Blockly.cake.ORDER_FUNCTION_CALL];
};

Blockly.cake['zrms14_shootLaserBool'] = function(block) {
	return ['game.shootLaser()', Blockly.cake.ORDER_FUNCTION_CALL];
};

Blockly.cake['zrms14_shootLaserVoid'] = function(block) {
	return 'game.shootLaser();\n';
};

Blockly.cake['zrms14_laserShotsRemaining'] = function(block) {
	return ['game.laserShotsRemaining()', Blockly.cake.ORDER_FUNCTION_CALL];
};

Blockly.cake['zrms14_getMass'] = function(block) {
	return ['game.getMass()', Blockly.cake.ORDER_FUNCTION_CALL];
};

Blockly.cake['zrms14_getFuelRemaining'] = function(block) {
	return ['game.getFuelRemaining()', Blockly.cake.ORDER_FUNCTION_CALL];
};

Blockly.cake['zrms14_getScore'] = function(block) {
	return ['game.getScore()', Blockly.cake.ORDER_FUNCTION_CALL];
};

Blockly.cake['zrms14_getOtherScore'] = function(block) {
	return ['game.getOtherScore()', Blockly.cake.ORDER_FUNCTION_CALL];
};

Blockly.cake['zrms14_isSlowDownActive'] = function(block) {
	return ['game.isSlowDownActive()', Blockly.cake.ORDER_FUNCTION_CALL];
};

Blockly.cake['zrms14_isBounceActive'] = function(block) {
	return ['game.isBounceActive()', Blockly.cake.ORDER_FUNCTION_CALL];
};