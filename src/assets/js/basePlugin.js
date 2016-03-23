const ElectronSettings = require('electron-settings');
  settings = new ElectronSettings({
    configDirPath: new basePlugin().getConfigPath(),
    debouncedSaveTime: 1
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

  object.watchConfigFieldChanges = function () {
    log('Watching config changes for ' + object.getHandler() + '.*');
    settings.watch(object.getHandler() + '.*', function() {
      log('Reloading app after config changes');
      ipc.send('load-app', true);
    })
  }

  object.getConfig = function () {
    // settings.destroy();
    // settings = new ElectronSettings({
    //   configDirPath: new basePlugin().getConfigPath()
    // });

    // object.watchConfigFieldChanges();

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
    log('Saving config data');

    var fields = object.getConfigFields();

    for (var key in fields) {
      log('Setting ' + object.getHandler() + '.' + fields[key] + ' to ' + data[fields[key]]);
      settings.set(object.getHandler() + '.' + fields[key], data[fields[key]]);
    }

    ipc.emit('loadApp');

    log('Config data saved and app reload triggered');
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