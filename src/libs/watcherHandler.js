var watcherInterface = require('./watcherInterface.js'),
  events = require('events'),
  fileWatcher = require(appRoot + '/assets/js/modules/watchers/file/plugin.js');

/**
 * watcherHandler class
 * @returns {*|EventEmitter|a}
 */
function watcherHandler () {
  /**
   * watcherHandler object
   * @type {*|EventEmitter|a}
     */
  var object = new events.EventEmitter;

  /**
   * watcherInterface[] Watchers
   * @type {*[]}
     */
  var watchers = [
    fileWatcher
  ];

  /**
   * Load watchers
   */
  object.loadWatchers = function() {
    for (var key in watchers) {
      var watcher = watchers[key];
      object.load(watcher);
    }
  };

  /**
   * Load a watcher
   * @param watcherInterface watcher
     */
  object.load = function (watcher) {
    watcherInterface.check(watcher);
    watcher.load(function() {
      object.init(watcher);
    });
  };

  /**
   * Initialize the watcher
   * @param watcherInterface watcher
     */
  object.init = function (watcher) {
    log(watcher.getName() + ' loaded.');
    watcher.watch(function(file) {
      object.emit('newFile', file);
    });
  }

  return object;
}

/**
 * Export module
 * @type {watcherHandler}
 */
module.exports = new watcherHandler();