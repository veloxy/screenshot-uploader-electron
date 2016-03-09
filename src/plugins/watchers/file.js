const chokidar = require('chokidar');

/**
 * fileWatcher class
 * @returns fileWatcher
 */
function fileWatcher() {

  /**
   * fileWatcher object
   * @type {fileWatcher}
     */
  var object = {};

  /**
   * @type watcherInterface
   */
  var watcher = {};

  /**
   * Returns the fileWatcher plugin name
   * @returns {string}
   */
  object.getName = function () {
    return 'File Watcher';
  }

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
   * @todo Read the directory from a config or some kind of preferences
   * @returns {*}
   */
  object.getDirectory = function() {
    var homeFolder = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
    return homeFolder + '/Dropbox/Screenshots';
  }

  return object;
}

/**
 * Export module
 * @type {fileWatcher}
 */
module.exports = new fileWatcher();