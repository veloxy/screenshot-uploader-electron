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
  object.loadWatchers = function(reload) {
    if (reload) {
      object.destroy();
    }

    watchers = [fileWatcher];

    for (var key in watchers) {
      if (watchers.hasOwnProperty(key)) {
        var watcher = watchers[key];
        log('Loading ' + watcher.getName() + 'Watcher.');
        object.load(watcher);
      }
    }
  };

  /**
   * Load a watcher
   * @param watcherInterface watcher
     */
  object.load = function (watcher) {
    watcherInterface.check(watcher);
    watcherInterface.complete(watcher);
    watcher.load(function () {
      log(watcher.getName() + 'Watcher loaded.');
      object.init(watcher);
    });
  };

  /**
   * Initialize the watcher
   * @param watcherInterface watcher
     */
  object.init = function (watcher) {
    log(watcher.getName() + 'Watcher initialized.');
    watcher.watch(function (file) {
      object.emit('newFile', file);
    });
  }

  /**
   * Destroy a watcher
   */
  object.destroy = function () {
    object.removeAllListeners();
    for (var key in watchers) {
      var watcher = watchers[key];
      if (typeof watcher.destroy === 'function') {
        watcher.destroy();
        log('Destroying watcher ' + watcher.getName());
      }
    }
    delete watchers;
  }

  return object;
}

/**
 * Export module
 * @type {watcherHandler}
 */
module.exports = new watcherHandler();