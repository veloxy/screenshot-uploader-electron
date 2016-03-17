const chokidar = require('chokidar');
/**
 * gooGl class
 * @returns {awsUploader}
 */
function fileWatcher() {

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
   * @type watcherInterface
   */
  var watcher = {};

  /**
   * Loads the fileWatcher
   * @param callback
   */
  object.load = function (callback) {
    watcher = chokidar.watch(object.getDirectory(), {
      ignored: /[\/\\]\./,
      persistent: true,
      alwaysStat: true
    });

    callback();
  };

  /**
   * Watch file changes run callback on new file
   * @param callback
   */
  object.watch = function (callback) {
    watcher.on('add', function (file, event) {
      var fileCreatedDate = new Date(event.ctime);
      var currentDate = new Date();
      var pastDate = new Date(currentDate.getTime() - 60000);

      if (fileCreatedDate >= pastDate && fileCreatedDate <= currentDate) {
        callback(file);
      }
    });
  };

  /**
   * Get user home folder
   * @returns {string}
   */
  object.getDirectory = function() {
    var config = object.getConfig();
    return config.folder;
  }

  /**
   * Get the plugin name
   * @returns {string}
   */
  object.getName = function () {
    return 'File';
  }

  /**
   * Get the icon name
   * @returns {string}
   */
  object.getIconName = function () {
    return 'folder';
  }

  /**
   * Get the plugin handler
   * @returns {string}
   */
  object.getHandler = function () {
    return 'file';
  }

  /**
   * Get config fields
   * @returns {string[]}
   */
  object.getConfigFields = function () {
    return [
      'folder',
    ];
  }

  return object;
}

/**
 * Export module
 * @type {gooGl}
 */
module.exports = new fileWatcher();