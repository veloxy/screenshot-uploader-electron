var I = require('methodical');

/**
 * URL Shortener Interface
 */
var UrlShortenerInterface = new I({
  required: {
    shorten: I.function,
    getName: I.function,
    load: I.function
  },
  optional: {
    destroy: I.function
  }
});

/**
 * Export module
 */
module.exports = UrlShortenerInterface;