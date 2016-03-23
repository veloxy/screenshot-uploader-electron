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
  object.loadUrlShortener = function (reload) {
    if (reload) {
      object.destroy();
    }
    /**
     * @todo Dynamically load the urlShortener from a config.
     */
    urlShortener = require(appRoot + '/assets/js/modules/url-shorteners/goo.gl/plugin.js');
    urlShortenerInterface.check(urlShortener);
    urlShortenerInterface.complete(urlShortener);
    urlShortener.load(function () {
      log(urlShortener.getName() + ' loaded.');
    });
  };

  object.shorten = function (url, callback) {
    urlShortener.shorten(url, function(shortenedUrl) {
      callback(shortenedUrl);
    });
  }

  /**
   * Destroy the urlshortener
   */
  object.destroy = function () {
    object.removeAllListeners();
    if (typeof urlShortener.destroy === 'function') {
      urlShortener.destroy();
      log('Destroying url-shortener ' + urlShortener.getName());
    }
    delete urlShortener;
  }

  return object;
}

/**
 * Export module
 * @type {urlShortenerHandler}
 */
module.exports = new urlShortenerHandler();