//noinspection JSUnresolvedFunction
const electron = require('electron'),
  app = electron.app,
  tray = electron.Tray,
  menu = electron.Menu,
  browserWindow = electron.BrowserWindow,
  ncp = require("copy-paste"),
  path = require('path');

/**
 * Remove the dock icon
 */
app.dock.hide();

global.appRoot = path.resolve(__dirname);

var watcherHandler = require('./libs/watcherHandler.js'),
  uploaderHandler = require('./libs/uploaderHandler.js'),
  urlShortenerHandler = require('./libs/urlShortenerHandler.js');
  pluginHandler = require('./libs/pluginHandler.js');

//pluginHandler.getPlugins('uploaders');

// Load handlers
uploaderHandler.loadUploader();
urlShortenerHandler.loadUrlShortener();
watcherHandler.loadWatchers();

/**
 * Run on file upload
 * @todo Multiple configurable callbacks
 */
uploaderHandler.on('fileUploaded', function (location) {
  console.log('Original file location ' + location);
  urlShortenerHandler.shorten(location, function (url) {
    ncp.copy(url, function() {
      console.log("URL pasted to clipboard " + url);
    });
  });
});

/**
 * Run on new file
 */
watcherHandler.on('newFile', function (file) {
  console.log('New file ' + file);
  uploaderHandler.upload(file);
})

var menuTray = null;

/**
 * App is ready
 */
app.on('ready', function(){
  window = new browserWindow({ width: 800, height: 500, show: false });

  window.loadURL('file://' + __dirname + '/index.html');
  window.webContents.on('did-finish-load', function () {
    menuTray = new tray(__dirname + '/assets/icons/trayTemplate.png');
    menuTray.on('drop-files', function(event, files) {
      files.map(function(file) {
        watcherHandler.emit('newFile', file);
      });
    });

    /**
     * Tray menu
     */
    menuTray.setContextMenu(menu.buildFromTemplate([
      {
        label: 'Settings',
        click: function() {
          window.show();
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Quit Application',
        click: function () {
          window.forceClose = true;
          app.quit();
        },
      }
    ]));
  });

  /**
   * When closing the settings windows
   */
  window.on('close', function (e) {
    if (window.forceClose) return;
    e.preventDefault();
    window.hide();
  });

  //window.toggleDevTools();
});