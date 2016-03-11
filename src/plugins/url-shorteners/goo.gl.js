const GoogleURL = require('google-url')
  fs = require('fs'),
  configurationFile = appRoot + '/plugins/url-shorteners/goo.gl.json';

/**
 * gooGl class
 * @returns {awsUploader}
 */
function gooGl() {

  /**
   * gooGl object
   * @type {gooGl}
   */
  var object = {};

  /**
   * Config
   * @todo Load dynamically from prefs
   */
  var config = JSON.parse(
    fs.readFileSync(configurationFile)
  );

  /**
   *
   * @type {null}
     */
  var googleUrl = new GoogleURL({key: config.key});

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
    callback();
  }

  /**
   * Get the plugin name
   * @returns {string}
   */
  object.getName = function () {
    return 'Goo.gl URL Shortener';
  }

  return object;
}

/**
 * Export module
 * @type {gooGl}
 */
module.exports = new gooGl();