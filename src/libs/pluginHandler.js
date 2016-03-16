var events = require('events'),
  fs = require('fs'),
  path = require('path');

/**
 * pluginHandler class
 * @returns {*|EventEmitter|a}
 */
function pluginHandler () {
  /**
   * uploadHandler object
   * @type {*|EventEmitter|a}
   */
  var object = new events.EventEmitter;

  /**
   * Get installed plugin for type
   * @param type
   * @returns {Array}
     */
  object.getPlugins = function (type) {
    var plugins = fs.readdirSync(appRoot + '/assets/js/modules/' + type );
    var pluginObjects = [];

    for (var key in plugins) {
      var plugin = require(appRoot + '/assets/js/modules/' + type + '/' + plugins[key] + '/plugin.js');
      pluginObjects.push(plugin);
    }

    return pluginObjects;
  }

  return object;
}

/**
 * Export module
 * @type {pluginHandler}
 */
module.exports = new pluginHandler();
