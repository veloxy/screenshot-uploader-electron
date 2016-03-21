const ElectronSettings = require('electron-settings');
  settings = new ElectronSettings({
    configDirPath: new basePlugin().getConfigPath()
  });

/**
 * awsUploader class
 * @returns {awsUploader}
 */
function basePlugin() {

  /**
   * awsUploader object
   * @type {awsUploader}
   */
  var object = {};

  object.getConfig = function () {
    var fields = object.getConfigFields();
    var config = {};

    for (var key in fields) {
      var value = settings.get(object.getHandler() + '.' + fields[key]);

      if (!value) {
        value = '';
      }

      config[fields[key]] = value;
    }

    return config;
  }

  object.saveConfig = function (data) {
    var fields = object.getConfigFields();
    for (var key in fields) {
      settings.set(object.getHandler() + '.' + fields[key], data[fields[key]]);
    }
    ipc.send('load-app', true);
  }

  object.getConfigPath = function () {
    var electron = require('electron');
    var app = electron.app || electron.remote.app;
    return app.getPath('userData');
  }

  return object;
}

/**
 * Export module
 * @type {awsUploader}
 */
module.exports = basePlugin;