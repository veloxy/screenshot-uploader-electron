var I = require('methodical');

/**
 * Uploader Interface
 */
var uploaderInterface = new I({
  required: {
    upload: I.function,
    getName: I.function
  },
  optional: {
    load: I.function
  }
});

/**
 * Export module
 */
module.exports = uploaderInterface;