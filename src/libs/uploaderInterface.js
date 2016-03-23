var I = require('methodical');

/**
 * Uploader Interface
 */
var uploaderInterface = new I({
  required: {
    upload: I.function,
    getName: I.function,
    getHandler: I.function,
    getIconName: I.function
  },
  optional: {
    load: I.function,
    destroy: I.function
  }
});

/**
 * Export module
 */
module.exports = uploaderInterface;