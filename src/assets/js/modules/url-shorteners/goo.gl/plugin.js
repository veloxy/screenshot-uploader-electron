var GoogleURL = require('google-url');

/**
 * gooGl class
 * @returns {awsUploader}
 */
function gooGl() {

  /**
   * Base plugin
   */
  var basePlugin = new (require(appRoot + '/assets/js/basePlugin.js'))();

  /**
   * gooGl object
   * @type {gooGl}
   */
  var object = basePlugin;

  /**
   *
   * @type {null}
     */
  var googleUrl = {};

  /**
   * Shorten URL
   * @param url
   * @param callback
     */
  object.shorten = function (url, callback) {
    googleUrl.shorten(url, function(err, shortUrl) {
      callback(shortUrl);
    });
  }

  /**
   * Load the url shortener
   * @param callback
   */
  object.load = function (callback) {
    var config = object.getConfig();
    googleUrl = new GoogleURL({key: config.key});
    callback();
  }

  /**
   * Get the plugin name
   * @returns {string}
   */
  object.getName = function () {
    return 'Goo.gl URL Shortener';
  }

  /**
   * Get the icon name
   * @returns {string}
   */
  object.getIconName = function () {
    return 'gplus';
  }

  /**
   * Get the plugin handler
   * @returns {string}
   */
  object.getHandler = function () {
    return 'googl';
  }

  /**
   * Get config fields
   * @returns {string[]}
   */
  object.getConfigFields = function () {
    return [
      'key'
    ];
  }

  return object;
}

/**
 * Export module
 * @type {gooGl}
 */
module.exports = new gooGl();