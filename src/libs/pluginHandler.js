var events = require('events'),
  fs = require('fs');

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
    var plugins = fs.readdirSync(appRoot + '/plugins/' + type );
    var pluginObjects = [];

    for (key in plugins) {
      var plugin = require(appRoot + '/plugins/' + type + '/' + plugins[key]);
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
