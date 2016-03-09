var urlShortenerInterface = require('./urlShortenerInterface.js'),
  events = require('events');

/**
 * urlShortenerHandler class
 * @returns {*|EventEmitter|a}
 */
function urlShortenerHandler () {

  /**
   * urlShortener
   * @type {urlShortenerInterface}
     */
  var urlShortener = null;

  /**
   * urlShortenerHandler object
   * @type {*|EventEmitter|a}
   */
  var object = new events.EventEmitter;

  /**
   * Setup and Load urlShortener
   */
  object.loadUrlShortener = function () {
    /**
     * @todo Dynamically load the urlShortener from a config.
     */
    urlShortener = require('../plugins/url-shorteners/goo.gl.js');
    urlShortenerInterface.check(urlShortener);
    urlShortener.load(function () {
      console.log(urlShortener.getName() + ' loaded.');
    });
  };

  object.shorten = function (url, callback) {
    urlShortener.shorten(url, function(shortenedUrl) {
      callback(shortenedUrl);
    });
  }

  return object;
}

/**
 * Export module
 * @type {urlShortenerHandler}
 */
module.exports = new urlShortenerHandler();