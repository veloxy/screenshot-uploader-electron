var uploaderInterface = require('./uploaderInterface.js'),
  events = require('events');

/**
 * uploadHandler class
 * @returns {*|EventEmitter|a}
 */
function uploaderHandler () {

  /**
   * uploadHandler object
   * @type {*|EventEmitter|a}
   */
  var object = new events.EventEmitter;

  /**
   * Uploader
   * @type uploaderInterface
   */
  var uploader = null;

  /**
   * Setup and Load uploader
   */
  object.loadUploader = function (reload) {
    if (reload) {
      object.destroy();
      delete uploader;
    }
    /**
     * @todo Dynamically load the uploader from a config.
     */
    uploader = require(appRoot + '/assets/js/modules/uploaders/aws/plugin.js');

    uploaderInterface.check(uploader);

    uploader.load(function () {
      log(uploader.getName() + ' loaded.');
    });
  };

  /**
   * Upload given file
   * @param file
   */
  object.upload = function (file) {
    uploader.upload(file, function(location) {
      object.emit('fileUploaded', location);
    });
  }

  /**
   * Get the uploaders
   * @returns uploaderInterface uploader
   */
  object.getUploader = function () {
    return uploader;
  }

  /**
   * Destroy the uploader
   */
  object.destroy = function () {
    object.removeAllListeners();
    if (typeof uploader.destroy === 'function') {
      log('Destroying uploader ' + uploader.getName());
      uploader.destroy();
    }
    delete uploader;
  }

  return object;
}

/**
 * Export module
 * @type {uploaderHandler}
 */
module.exports = new uploaderHandler();