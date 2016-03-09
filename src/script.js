//noinspection JSUnresolvedFunction
const electron = require('electron'),
  app = electron.app,
  tray = electron.Tray,
  browserWindow = electron.BrowserWindow,
  ncp = require("copy-paste");

app.dock.hide();

var watcherHandler = require('./libs/watcherHandler.js'),
  uploaderHandler = require('./libs/uploaderHandler.js'),
  urlShortenerHandler = require('./libs/urlShortenerHandler.js');

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
  uploaderHandler.upload(file);
})

var menuTray = null;

app.on('ready', function(){
  window = new browserWindow({ width: 1, height: 1, show: false });

  window.loadURL('file://' + __dirname + '/index.html');
  window.webContents.on('did-finish-load', function () {
    menuTray = new tray(__dirname + '/assets/icons/trayTemplate.png');
    menuTray.on('drop-files', function(event, files) {
      files.map(function(file) {
        watcherHandler.emit('newFile', file);
      });
    });
  });
});