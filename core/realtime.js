/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2014 Google Inc.
 * https://blockly.googlecode.com/
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
 * This file contains functions used by any Blockly.Cake app that wants to provide
 * realtime collaboration functionality.
 */

/**
 * @fileoverview Common support code for Blockly.Cake apps using realtime
 * collaboration.
 * Note that to use this you must set up a project via the Google Developers
 * Console. Instructions on how to do that can be found in the Blockly.Cake wiki page
 * at https://code.google.com/p/blockly/wiki/RealtimeCollaboration
 * Once you do that you can set the clientId in
 * Blockly.Cake.Realtime.rtclientOptions_
 * @author markf@google.com (Mark Friedman)
 */
'use strict';

goog.provide('Blockly.Cake.Realtime');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.style');
goog.require('rtclient');

/**
 * URL for progress indicator.
 * @type {string}
 * @private
 */
Blockly.Cake.Realtime.PROGRESS_URL_ = 'media/progress.gif';

/**
 * Is realtime collaboration enabled?
 * @type {boolean}
 * @private
 */
Blockly.Cake.Realtime.enabled_ = false;

/**
 * The Realtime document being collaborated on.
 * @type {gapi.drive.realtime.Document}
 * @private
 */
Blockly.Cake.Realtime.document_ = null;

/**
 * The Realtime model of this doc.
 * @type {gapi.drive.realtime.Model}
 * @private
 */
Blockly.Cake.Realtime.model_ = null;

/**
 * The unique id associated with this editing session.
 * @type {string}
 * @private
 */
Blockly.Cake.Realtime.sessionId_ = null;

/**
 * The function used to initialize the UI after realtime is initialized.
 * @type {function()}
 * @private
 */
Blockly.Cake.Realtime.initUi_ = null;

/**
 * A map from block id to blocks.
 * @type {gapi.drive.realtime.CollaborativeMap}
 * @private
 */
Blockly.Cake.Realtime.blocksMap_ = null;

/**
 * Are currently syncing from another instance of this realtime doc.
 * @type {boolean}
 */
Blockly.Cake.Realtime.withinSync = false;

/**
 * The current instance of the realtime loader client
 * @type {rtclient.RealtimeLoader}
 * @private
 */
Blockly.Cake.Realtime.realtimeLoader_ = null;

/**
 * The id of a text area to be used as a realtime chat box.
 * @type {string}
 * @private
 */
Blockly.Cake.Realtime.chatBoxElementId_ = null;

/**
 * The initial text to be placed in the realtime chat box.
 * @type {string}
 * @private
 */
Blockly.Cake.Realtime.chatBoxInitialText_ = null;

/**
 * Indicator of whether we are in the context of an undo or redo operation.
 * @type {boolean}
 * @private
 */
Blockly.Cake.Realtime.withinUndo_ = false;

/**
 * Returns whether realtime collaboration is enabled.
 * @return {boolean}
 */
Blockly.Cake.Realtime.isEnabled = function() {
  return Blockly.Cake.Realtime.enabled_;
};

/**
 * The id of the button to use for undo.
 * @type {string}
 * @private
 */
Blockly.Cake.Realtime.undoElementId_ = null;

/**
 * The id of the button to use for redo.
 * @type {string}
 * @private
 */
Blockly.Cake.Realtime.redoElementId_ = null;

/**
 * URL of the animated progress indicator.
 * @type {string}
 * @private
 */
Blockly.Cake.Realtime.PROGRESS_URL_ = 'media/progress.gif';

/**
 * URL of the anonymous user image.
 * @type {string}
 * @private
 */
Blockly.Cake.Realtime.ANONYMOUS_URL_ = 'media/anon.jpeg';

/**
 * This function is called the first time that the Realtime model is created
 * for a file. This function should be used to initialize any values of the
 * model.
 * @param {!gapi.drive.realtime.Model} model The Realtime root model object.
 * @private
 */
Blockly.Cake.Realtime.initializeModel_ = function(model) {
  Blockly.Cake.Realtime.model_ = model;
  var blocksMap = model.createMap();
  model.getRoot().set('blocks', blocksMap);
  var topBlocks = model.createList();
  model.getRoot().set('topBlocks', topBlocks);
  if (Blockly.Cake.Realtime.chatBoxElementId_) {
    model.getRoot().set(Blockly.Cake.Realtime.chatBoxElementId_,
        model.createString(Blockly.Cake.Realtime.chatBoxInitialText_));
  }
};

/**
 * Delete a block from the realtime blocks map.
 * @param {!Blockly.Cake.Block} block The block to remove.
 */
Blockly.Cake.Realtime.removeBlock = function(block) {
  Blockly.Cake.Realtime.blocksMap_.delete(block.id.toString());
};

/**
 * Add to the list of top-level blocks.
 * @param {!Blockly.Cake.Block} block The block to add.
 */
Blockly.Cake.Realtime.addTopBlock = function(block) {
  if (Blockly.Cake.Realtime.topBlocks_.indexOf(block) == -1) {
    Blockly.Cake.Realtime.topBlocks_.push(block);
  }
};

/**
 * Delete a block from the list of top-level blocks.
 * @param {!Blockly.Cake.Block} block The block to remove.
 */
Blockly.Cake.Realtime.removeTopBlock = function(block) {
  Blockly.Cake.Realtime.topBlocks_.removeValue(block);
};

/**
 * Obtain a newly created block known by the Realtime API.
 * @param {!Blockly.Cake.Workspace} workspace The workspace to put the block in.
 * @param {string} prototypeName The name of the prototype for the block.
 * @return {!Blockly.Cake.Block}
 */
Blockly.Cake.Realtime.obtainBlock = function(workspace, prototypeName) {
  var newBlock =
      Blockly.Cake.Realtime.model_.create(Blockly.Cake.Block, workspace, prototypeName);
  return newBlock;
};

/**
 * Get an existing block by id.
 * @param {string} id The block's id.
 * @return {Blockly.Cake.Block} The found block.
 */
Blockly.Cake.Realtime.getBlockById = function(id) {
  return Blockly.Cake.Realtime.blocksMap_.get(id);
};

/**
 * Log the event for debugging purposses.
 * @param {gapi.drive.realtime.BaseModelEvent} evt The event that occurred.
 * @private
 */
Blockly.Cake.Realtime.logEvent_ = function(evt) {
  console.log('Object event:');
  console.log('  id: ' + evt.target.id);
  console.log('  type: ' + evt.type);
  var events = evt.events;
  if (events) {
    var eventCount = events.length;
    for (var i = 0; i < eventCount; i++) {
      var event = events[i];
      console.log('  child event:');
      console.log('    id: ' + event.target.id);
      console.log('    type: ' + event.type);
    }
  }
};

/**
 * Event handler to call when a block is changed.
 * @param {!gapi.drive.realtime.ObjectChangedEvent} evt The event that occurred.
 * @private
 */
Blockly.Cake.Realtime.onObjectChange_ = function(evt) {
  var events = evt.events;
  var eventCount = evt.events.length;
  for (var i = 0; i < eventCount; i++) {
    var event = events[i];
    if (!event.isLocal || Blockly.Cake.Realtime.withinUndo_) {
      var block = event.target;
      if (event.type == 'value_changed') {
        if (event.property == 'xmlDom') {
          Blockly.Cake.Realtime.doWithinSync_(function() {
            Blockly.Cake.Realtime.placeBlockOnWorkspace_(block, false);
            Blockly.Cake.Realtime.moveBlock_(block);
          });
        } else if (event.property == 'relativeX' ||
            event.property == 'relativeY') {
          Blockly.Cake.Realtime.doWithinSync_(function() {
            if (!block.svg_) {
              // If this is a move of a newly disconnected (i.e newly top
              // level) block it will not have any svg (because it has been
              // disposed of by it's parent), so we need to handle that here.
              Blockly.Cake.Realtime.placeBlockOnWorkspace_(block, false);
            }
            Blockly.Cake.Realtime.moveBlock_(block);
          });
        }
      }
    }
  }
};

/**
 * Event handler to call when there is a change to the realtime blocks map.
 * @param {!gapi.drive.realtime.ValueChangedEvent} evt The event that occurred.
 * @private
 */
Blockly.Cake.Realtime.onBlocksMapChange_ = function(evt) {
  if (!evt.isLocal || Blockly.Cake.Realtime.withinUndo_) {
    var block = evt.newValue;
    if (block) {
      Blockly.Cake.Realtime.placeBlockOnWorkspace_(block, !(evt.oldValue));
    } else {
      block = evt.oldValue;
      Blockly.Cake.Realtime.deleteBlock(block);
    }
  }
};

/**
 * A convenient wrapper around code that synchronizes the local model being
 * edited with changes from another non-local model.
 * @param {!function()} thunk A thunk of code to call.
 * @private
 */
Blockly.Cake.Realtime.doWithinSync_ = function(thunk) {
  if (Blockly.Cake.Realtime.withinSync) {
    thunk();
  } else {
    try {
      Blockly.Cake.Realtime.withinSync = true;
      thunk();
    } finally {
      Blockly.Cake.Realtime.withinSync = false;
    }
  }
};

/**
 * Places a block to be synced on this docs main workspace.  The block might
 * already exist on this doc, in which case it is updated and/or moved.
 * @param {!Blockly.Cake.Block} block The block.
 * @param {boolean} addToTop Whether to add the block to the workspace/s list of
 *     top-level blocks.
 * @private
 */
Blockly.Cake.Realtime.placeBlockOnWorkspace_ = function(block, addToTop) {
  Blockly.Cake.Realtime.doWithinSync_(function() {
//    if (!Blockly.Cake.Realtime.blocksMap_.has(block.id)) {
//      Blockly.Cake.Realtime.blocksMap_.set(block.id, block);
//    }
    var blockDom = Blockly.Cake.Xml.textToDom(block.xmlDom).firstChild;
    var newBlock =
        Blockly.Cake.Xml.domToBlock(Blockly.Cake.mainWorkspace, blockDom, true);
    // TODO: The following is for debugging.  It should never actually happen.
    if (!newBlock) {
      return;
    }
    // Since Blockly.Cake.Xml.blockDomToBlock() purposely won't add blocks to
    // workspace.topBlocks_ we sometimes need to do it explicitly here.
    if (addToTop) {
      newBlock.workspace.addTopBlock(newBlock);
    }
    if (addToTop ||
        goog.array.contains(Blockly.Cake.Realtime.topBlocks_, newBlock)) {
      Blockly.Cake.Realtime.moveBlock_(newBlock);
    }
  });
};

/**
 * Move a block.
 * @param {!Blockly.Cake.Block} block The block to move.
 * @private
 */
Blockly.Cake.Realtime.moveBlock_ = function(block) {
  if (!isNaN(block.relativeX) && !isNaN(block.relativeY)) {
    var width = Blockly.Cake.svgSize().width;
    var curPos = block.getRelativeToSurfaceXY();
    var dx = block.relativeX - curPos.x;
    var dy = block.relativeY - curPos.y;
    block.moveBy(Blockly.Cake.RTL ? width - dx : dx, dy);
  }
};

/**
 * Delete a block.
 * @param {!Blockly.Cake.Block} block The block to delete.
 */
Blockly.Cake.Realtime.deleteBlock = function(block) {
  Blockly.Cake.Realtime.doWithinSync_(function() {
    block.dispose(true, true, true);
  });
};

/**
 * Load all the blocks from the realtime model's blocks map and place them
 * appropriately on the main Blockly.Cake workspace.
 * @private
 */
Blockly.Cake.Realtime.loadBlocks_ = function() {
  var topBlocks = Blockly.Cake.Realtime.topBlocks_;
  for (var j = 0; j < topBlocks.length; j++) {
    var topBlock = topBlocks.get(j);
    Blockly.Cake.Realtime.placeBlockOnWorkspace_(topBlock, true);
  }
};

/**
 * Cause a changed block to update the realtime model, and therefore to be
 * synced with other apps editing this same doc.
 * @param {!Blockly.Cake.Block} block The block that changed.
 */
Blockly.Cake.Realtime.blockChanged = function(block) {
  if (block.workspace == Blockly.Cake.mainWorkspace &&
      Blockly.Cake.Realtime.isEnabled() &&
      !Blockly.Cake.Realtime.withinSync) {
    var rootBlock = block.getRootBlock();
    var xy = rootBlock.getRelativeToSurfaceXY();
    var changed = false;
    var xml = Blockly.Cake.Xml.blockToDom_(rootBlock);
    xml.setAttribute('id', rootBlock.id);
    var topXml = goog.dom.createDom('xml');
    topXml.appendChild(xml);
    var newXml = Blockly.Cake.Xml.domToText(topXml);
    if (newXml != rootBlock.xmlDom) {
      changed = true;
      rootBlock.xmlDom = newXml;
    }
    if (rootBlock.relativeX != xy.x || rootBlock.relativeY != xy.y) {
      rootBlock.relativeX = xy.x;
      rootBlock.relativeY = xy.y;
      changed = true;
    }
    if (changed) {
      var blockId = rootBlock.id.toString();
      Blockly.Cake.Realtime.blocksMap_.set(blockId, rootBlock);
    }
  }
};

/**
 * This function is called when the Realtime file has been loaded. It should
 * be used to initialize any user interface components and event handlers
 * depending on the Realtime model. In this case, create a text control binder
 * and bind it to our string model that we created in initializeModel.
 * @param {!gapi.drive.realtime.Document} doc The Realtime document.
 * @private
 */
Blockly.Cake.Realtime.onFileLoaded_ = function(doc) {
  Blockly.Cake.Realtime.document_ = doc;
  Blockly.Cake.Realtime.sessionId_ = Blockly.Cake.Realtime.getSessionId_(doc);
  Blockly.Cake.Realtime.model_ = doc.getModel();
  Blockly.Cake.Realtime.blocksMap_ =
      Blockly.Cake.Realtime.model_.getRoot().get('blocks');
  Blockly.Cake.Realtime.topBlocks_ =
      Blockly.Cake.Realtime.model_.getRoot().get('topBlocks');

  Blockly.Cake.Realtime.model_.getRoot().addEventListener(
      gapi.drive.realtime.EventType.OBJECT_CHANGED,
      Blockly.Cake.Realtime.onObjectChange_);
  Blockly.Cake.Realtime.blocksMap_.addEventListener(
      gapi.drive.realtime.EventType.VALUE_CHANGED,
      Blockly.Cake.Realtime.onBlocksMapChange_);

  Blockly.Cake.Realtime.initUi_();

  //Adding Listeners for Collaborator events.
  doc.addEventListener(gapi.drive.realtime.EventType.COLLABORATOR_JOINED,
      Blockly.Cake.Realtime.onCollaboratorJoined_);
  doc.addEventListener(gapi.drive.realtime.EventType.COLLABORATOR_LEFT,
      Blockly.Cake.Realtime.onCollaboratorLeft_);
  Blockly.Cake.Realtime.updateCollabUi_();

  Blockly.Cake.Realtime.loadBlocks_();

  // Add logic for undo button.
  // TODO: Uncomment this when undo/redo are fixed.
//
//  var undoButton = document.getElementById(Blockly.Cake.Realtime.undoElementId_);
//  var redoButton = document.getElementById(Blockly.Cake.Realtime.redoElementId_);
//
//  if (undoButton) {
//    undoButton.onclick = function (e) {
//      try {
//        Blockly.Cake.Realtime.withinUndo_ = true;
//        Blockly.Cake.Realtime.model_.undo();
//      } finally {
//        Blockly.Cake.Realtime.withinUndo_ = false;
//      }
//    };
//  }
//  if (redoButton) {
//    redoButton.onclick = function (e) {
//      try {
//        Blockly.Cake.Realtime.withinUndo_ = true;
//        Blockly.Cake.Realtime.model_.redo();
//      } finally {
//        Blockly.Cake.Realtime.withinUndo_ = false;
//      }
//    };
//  }
//
//  // Add event handler for UndoRedoStateChanged events.
//  var onUndoRedoStateChanged = function(e) {
//    undoButton.disabled = !e.canUndo;
//    redoButton.disabled = !e.canRedo;
//  };
//  Blockly.Cake.Realtime.model_.addEventListener(
//      gapi.drive.realtime.EventType.UNDO_REDO_STATE_CHANGED,
//      onUndoRedoStateChanged);

};

/**
 * Get the sessionId associated with this editing session.  Note that it is
 * unique to the current browser window/tab.
 * @param {gapi.drive.realtime.Document} doc
 * @return {*}
 * @private
 */
Blockly.Cake.Realtime.getSessionId_ = function(doc) {
  var collaborators = doc.getCollaborators();
  for (var i = 0; i < collaborators.length; i++) {
    var collaborator = collaborators[i];
    if (collaborator.isMe) {
      return collaborator.sessionId;
    }
  }
  return undefined;
};

/**
 * Register the Blockly.Cake types and attributes that are reflected in the realtime
 * model.
 * @private
 */
Blockly.Cake.Realtime.registerTypes_ = function() {
  var custom = gapi.drive.realtime.custom;

  custom.registerType(Blockly.Cake.Block, 'Block');
  Blockly.Cake.Block.prototype.id = custom.collaborativeField('id');
  Blockly.Cake.Block.prototype.xmlDom = custom.collaborativeField('xmlDom');
  Blockly.Cake.Block.prototype.relativeX = custom.collaborativeField('relativeX');
  Blockly.Cake.Block.prototype.relativeY = custom.collaborativeField('relativeY');

  custom.setInitializer(Blockly.Cake.Block, Blockly.Cake.Block.prototype.initialize);
};

/**
 * Time period for realtime re-authorization
 * @type {number}
 * @private
 */
Blockly.Cake.Realtime.REAUTH_INTERVAL_IN_MILLISECONDS_ = 30 * 60 * 1000;

/**
 * What to do after Realtime authorization.
 * @private
 */
Blockly.Cake.Realtime.afterAuth_ = function() {
  // This is a workaround for the fact that the code in realtime-client-utils.js
  // doesn't deal with auth timeouts correctly.  So we explicitly reauthorize at
  // regular intervals.
  window.setTimeout(
      function() {
        Blockly.Cake.Realtime.realtimeLoader_.authorizer.authorize(
            Blockly.Cake.Realtime.afterAuth_);
      },
      Blockly.Cake.Realtime.REAUTH_INTERVAL_IN_MILLISECONDS_);
};

/**
 * Add "Anyone with the link" permissions to the file.
 * @param {string} fileId the file id
 * @private
 */
Blockly.Cake.Realtime.afterCreate_ = function(fileId) {
  var resource = {
    'type': 'anyone',
    'role': 'writer',
    'value': 'default',
    'withLink': true
  };
  var request = gapi.client.drive.permissions.insert({
    'fileId': fileId,
    'resource': resource
  });
  request.execute(function(resp) {
    // If we have an error try to just set the permission for all users
    // of the domain.
    if (resp.error) {
      Blockly.Cake.Realtime.getUserDomain(fileId, function(domain) {
        var resource = {
          'type': 'domain',
          'role': 'writer',
          'value': domain,
          'withLink': true
        };
        request = gapi.client.drive.permissions.insert({
          'fileId': fileId,
          'resource': resource
        });
        request.execute(function(resp) { });
      });
    }
  });
};

/**
 * Get the domain (if it exists) associated with a realtime file.  The callback
 * will be called with the domain, if it exists.
 * @param {string} fileId the id of the file
 * @param {function(string)} callback a function to call back with the domain
 */
Blockly.Cake.Realtime.getUserDomain = function(fileId, callback) {
  /**
   * Note that there may be a more direct way to get the domain by, for example,
   * using the Google profile API but this way we don't need any additional
   * APIs or scopes.  But if it turns out that the permissions API stops
   * providing the domain this might have to change.
   */
  var request = gapi.client.drive.permissions.list({
    'fileId': fileId
  });
  request.execute(function(resp) {
    for (var i = 0; i < resp.items.length; i++) {
      var item = resp.items[i];
      if (item.role == 'owner') {
        callback(item.domain);
        return;
      }
    }
  });
};

/**
 * Options for the Realtime loader.
 * @private
 */
Blockly.Cake.Realtime.rtclientOptions_ = {
  /**
   * Client ID from the console.
   * This will be set from the options passed into Blockly.Cake.Realtime.start()
   */
  'clientId': null,

  /**
   * The ID of the button to click to authorize. Must be a DOM element ID.
   */
  'authButtonElementId': 'authorizeButton',

  /**
   * The ID of the container of the authorize button.
   */
  'authDivElementId': 'authButtonDiv',

  /**
   * Function to be called when a Realtime model is first created.
   */
  'initializeModel': Blockly.Cake.Realtime.initializeModel_,

  /**
   * Autocreate files right after auth automatically.
   */
  'autoCreate': true,

  /**
   * The name of newly created Drive files.
   */
  'defaultTitle': 'Realtime Blockly.Cake File',

  /**
   * The name of the folder to place newly created Drive files in.
   */
  'defaultFolderTitle': 'Realtime Blockly.Cake Folder',

  /**
   * The MIME type of newly created Drive Files. By default the application
   * specific MIME type will be used:
   *     application/vnd.google-apps.drive-sdk.
   */
  'newFileMimeType': null, // Using default.

  /**
   * Function to be called every time a Realtime file is loaded.
   */
  'onFileLoaded': Blockly.Cake.Realtime.onFileLoaded_,

  /**
   * Function to be called to initialize custom Collaborative Objects types.
   */
  'registerTypes': Blockly.Cake.Realtime.registerTypes_,

  /**
   * Function to be called after authorization and before loading files.
   */
  'afterAuth': Blockly.Cake.Realtime.afterAuth_,

  /**
   * Function to be called after file creation, if autoCreate is true.
   */
  'afterCreate': Blockly.Cake.Realtime.afterCreate_
};

/**
 * Parse options to startRealtime().
 * @param {!Object} options Object containing the options.
 * @private
 */
Blockly.Cake.Realtime.parseOptions_ = function(options) {
  var chatBoxOptions = rtclient.getOption(options, 'chatbox');
  if (chatBoxOptions) {
    Blockly.Cake.Realtime.chatBoxElementId_ =
        rtclient.getOption(chatBoxOptions, 'elementId');
    Blockly.Cake.Realtime.chatBoxInitialText_ =
        rtclient.getOption(chatBoxOptions, 'initText', Blockly.Cake.Msg.CHAT);
  }
  Blockly.Cake.Realtime.rtclientOptions_.clientId =
      rtclient.getOption(options, 'clientId');
  Blockly.Cake.Realtime.collabElementId =
      rtclient.getOption(options, 'collabElementId');
  // TODO: Uncomment this when undo/redo are fixed.
//  Blockly.Cake.Realtime.undoElementId_ =
//      rtclient.getOption(options, 'undoElementId', 'undoButton');
//  Blockly.Cake.Realtime.redoElementId_ =
//      rtclient.getOption(options, 'redoElementId', 'redoButton');
};

/**
 * Setup the Blockly.Cake container for realtime authorization and start the
 * Realtime loader.
 * @param {function()} uiInitialize Function to initialize the Blockly.Cake UI.
 * @param {!Element} uiContainer Container element for the Blockly.Cake UI.
 * @param {!Object} options The realtime options.
 */
Blockly.Cake.Realtime.startRealtime = function(uiInitialize, uiContainer, options) {
  Blockly.Cake.Realtime.parseOptions_(options);
  Blockly.Cake.Realtime.enabled_ = true;
  // Note that we need to setup the UI for realtime authorization before
  // loading the realtime code (which, in turn, will handle initializing the
  // rest of the Blockly.Cake UI.
  var authDiv = Blockly.Cake.Realtime.addAuthUi_(uiContainer);
  Blockly.Cake.Realtime.initUi_ = function() {
    uiInitialize();
    if (Blockly.Cake.Realtime.chatBoxElementId_) {
      var chatText = Blockly.Cake.Realtime.model_.getRoot().get(
          Blockly.Cake.Realtime.chatBoxElementId_);
      var chatBox = document.getElementById(Blockly.Cake.Realtime.chatBoxElementId_);
      gapi.drive.realtime.databinding.bindString(chatText, chatBox);
      chatBox.disabled = false;
    }
  };
  Blockly.Cake.Realtime.realtimeLoader_ =
      new rtclient.RealtimeLoader(Blockly.Cake.Realtime.rtclientOptions_);
  Blockly.Cake.Realtime.realtimeLoader_.start();
};

/**
 * Setup the Blockly.Cake container for realtime authorization.
 * @param {!Element} uiContainer A DOM container element for the Blockly.Cake UI.
 * @return {!Element} The DOM element for the authorization UI.
 * @private
 */
Blockly.Cake.Realtime.addAuthUi_ = function(uiContainer) {
  // Add progess indicator to the UI container.
  uiContainer.style.background = 'url(' + Blockly.Cake.pathToBlockly +
      Blockly.Cake.Realtime.PROGRESS_URL_ + ') no-repeat center center';
  // Setup authorization button
  var blocklyDivBounds = goog.style.getBounds(uiContainer);
  var authButtonDiv = goog.dom.createDom('div');
  authButtonDiv.id = Blockly.Cake.Realtime.rtclientOptions_['authDivElementId'];
  var authText = goog.dom.createDom('p', null, Blockly.Cake.Msg.AUTH);
  authButtonDiv.appendChild(authText);
  var authButton = goog.dom.createDom('button', null, 'Authorize');
  authButton.id = Blockly.Cake.Realtime.rtclientOptions_.authButtonElementId;
  authButtonDiv.appendChild(authButton);
  uiContainer.appendChild(authButtonDiv);

  // TODO: I would have liked to set the style for the authButtonDiv in css.js
  // but that CSS doesn't get injected until after this code gets run.
  authButtonDiv.style.display = 'none';
  authButtonDiv.style.position = 'relative';
  authButtonDiv.style.textAlign = 'center';
  authButtonDiv.style.border = '1px solid';
  authButtonDiv.style.backgroundColor = '#f6f9ff';
  authButtonDiv.style.borderRadius = '15px';
  authButtonDiv.style.boxShadow = '10px 10px 5px #888';
  authButtonDiv.style.width = (blocklyDivBounds.width / 3) + 'px';
  var authButtonDivBounds = goog.style.getBounds(authButtonDiv);
  authButtonDiv.style.left =
      (blocklyDivBounds.width - authButtonDivBounds.width) / 3 + 'px';
  authButtonDiv.style.top =
      (blocklyDivBounds.height - authButtonDivBounds.height) / 4 + 'px';
  return authButtonDiv;
};

/**
 * Update the collaborators UI to include the latest set of users.
 * @private
 */
Blockly.Cake.Realtime.updateCollabUi_ = function() {
  if (!Blockly.Cake.Realtime.collabElementId) {
    return;
  }
  var collabElement = goog.dom.getElement(Blockly.Cake.Realtime.collabElementId);
  goog.dom.removeChildren(collabElement);
  var collaboratorsList = Blockly.Cake.Realtime.document_.getCollaborators();
  for (var i = 0; i < collaboratorsList.length; i++) {
    var collaborator = collaboratorsList[i];
    var imgSrc = collaborator.photoUrl ||
        Blockly.Cake.pathToBlockly + Blockly.Cake.Realtime.ANONYMOUS_URL_;
    var img = goog.dom.createDom('img',
        {
          'src': imgSrc,
          'alt': collaborator.displayName,
          'title': collaborator.displayName +
              (collaborator.isMe ? ' (' + Blockly.Cake.Msg.ME + ')' : '')});
    img.style.backgroundColor = collaborator.color;
    goog.dom.appendChild(collabElement, img);
  }
};

/**
 * Event handler for when collaborators join.
 * @param {gapi.drive.realtime.CollaboratorJoinedEvent} event The event.
 * @private
 */
Blockly.Cake.Realtime.onCollaboratorJoined_ = function(event) {
  Blockly.Cake.Realtime.updateCollabUi_();
};

/**
 * Event handler for when collaborators leave.
 * @param {gapi.drive.realtime.CollaboratorLeftEvent} event The event.
 * @private
 */
Blockly.Cake.Realtime.onCollaboratorLeft_ = function(event) {
  Blockly.Cake.Realtime.updateCollabUi_();
};

/**
 * Execute a command.  Generally, a command is the result of a user action
 * e.g., a click, drag or context menu selection.
 * @param {function()} cmdThunk A function representing the command execution.
 */
Blockly.Cake.Realtime.doCommand = function(cmdThunk) {
  // TODO(): We'd like to use the realtime API compound operations as in the
  // commented out code below.  However, it appears that the realtime API is
  // re-ordering events when they're within compound operations in a way which
  // breaks us.  We might need to implement our own compound operations as a
  // workaround.  Doing so might give us some other advantages since we could
  // then allow compound operations that span synchronous blocks of code (e.g.,
  // span multiple Blockly.Cake events).  It would also allow us to deal with the
  // fact that the current realtime API puts some operations into the undo stack
  // that we would prefer weren't there; namely local changes that occur as a
  // result of remote realtime events.
//  try {
//    Blockly.Cake.Realtime.model_.beginCompoundOperation();
//    cmdThunk();
//  } finally {
//    Blockly.Cake.Realtime.model_.endCompoundOperation();
//  }
  cmdThunk();
};

/**
 * Generate an id that is unique among the all the sessions that ever
 * collaborated on this document.
 * @param {string} extra A string id which is unique within this particular
 * session.
 * @return {string}
 */
Blockly.Cake.Realtime.genUid = function(extra) {
  /* The idea here is that we use the extra string to ensure uniqueness within
     this session and the current sessionId to ensure uniqueness across
     all the current sessions.  There's still the (remote) chance that the
     current sessionId is the same as some old (non-current) one, so we still
     need to check that our uid hasn't been previously used.

     Note that you could potentially use a random number to generate the id but
     there remains the small chance of regenerating the same number that's been
     used before and I'm paranoid.  It's not enough to just check that the
     random uid hasn't been previously used because other concurrent sessions
     might generate the same uid at the same time.  Like I said, I'm paranoid.
   */
  var potentialUid = Blockly.Cake.Realtime.sessionId_ + '-' + extra;
  if (!Blockly.Cake.Realtime.blocksMap_.has(potentialUid)) {
    return potentialUid;
  } else {
    return (Blockly.Cake.Realtime.genUid('-' + extra));
  }
};
