var I = require('methodical');

/**
 * Watcher Interface
 */
var watcherInterface = new I({
  required: {
    watch: I.function,
    getName: I.function,
    load: I.function
  },
  optional: {}
});

/**
 * Export module
 */
module.exports = watcherInterface;