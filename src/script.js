//noinspection JSUnresolvedFunction
const electron = require('electron'),
  app = electron.app,
  tray = electron.Tray,
  menu = electron.Menu,
  browserWindow = electron.BrowserWindow,
  ncp = require("copy-paste"),
  ipc = require('electron').ipcMain;
  path = require('path');

/**
 * Remove the dock icon
 */
app.dock.hide();

global.appRoot = path.resolve(__dirname);
global.log = function (message) {
  window.webContents.send('newLog', {
    time: new Date().toLocaleString(),
    message: message
  });
}

var watcherHandler = null,
  uploaderHandler = null,
  urlShortenerHandler = null;

ipc.on('load-app', function(event, arg) {
  console.log('Loading App 111');
  loadApp(true);
});

var menuTray = null;

/**
 * App is ready
 */
app.on('ready', function(){
  global.window = new browserWindow({ width: 800, height: 500, show: false });

  window.loadURL('file://' + __dirname + '/index.html');
  window.webContents.on('did-finish-load', function () {
    loadApp();
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

  // window.toggleDevTools();
});

function loadApp(reload) {
  log('Loading App');
  if (reload) {
    console.log('Reloading app');
  } else {
    console.log('Loading app');
  }

  delete watcherHandler;
  delete uploaderHandler;
  delete urlShortenerHandler;

  watcherHandler = require('./libs/watcherHandler.js'),
  uploaderHandler = require('./libs/uploaderHandler.js'),
  urlShortenerHandler = require('./libs/urlShortenerHandler.js');

  // Load handlers
  uploaderHandler.loadUploader(reload);
  urlShortenerHandler.loadUrlShortener(reload);
  watcherHandler.loadWatchers(reload);

  /**
   * Run on file upload
   * @todo Multiple configurable callbacks
   */
  uploaderHandler.on('fileUploaded', function (location) {
    log('Original file location ' + location);
    urlShortenerHandler.shorten(location, function (url) {
      ncp.copy(url, function() {
        log('URL pasted to clipboard ' + url);
        window.webContents.send('notification', {
          title: 'Uploaded',
          body: 'URL pasted to clipboard ' + url,
          sound: path.join(__dirname, 'assets/sound/bell.mp3') });
      });
    });
  });

  /**
   * Run on new file
   */
  watcherHandler.on('newFile', function (file) {
    log('New file ' + file);
    uploaderHandler.upload(file);
  });
}