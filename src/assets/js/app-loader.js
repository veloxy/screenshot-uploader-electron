var ncp = require("copy-paste");

var watcherHandler = null,
  uploaderHandler = null,
  urlShortenerHandler = null;

watcherHandler = require('./libs/watcherHandler.js'),
uploaderHandler = require('./libs/uploaderHandler.js'),
urlShortenerHandler = require('./libs/urlShortenerHandler.js');

function loadApp(reload) {
  if (reload) {
    log('Reloading app');
  } else {
    log('Loading app');
  }

  // Load handlers
  log('Loading handlers.');
  uploaderHandler.loadUploader(reload);
  urlShortenerHandler.loadUrlShortener(reload);
  watcherHandler.loadWatchers(reload);

  log('Initialize fileUpload callback.');
  /**
   * Run on file upload
   * @todo Multiple configurable callbacks
   */
  uploaderHandler.on('fileUploaded', function (location) {
    log('Original file location ' + location);
    urlShortenerHandler.shorten(location, function (url) {
      ncp.copy(url, function() {
        log('URL pasted to clipboard ' + url);
        ipc.send('notification', {
          title: 'Uploaded',
          body: 'URL pasted to clipboard ' + url,
          sound: path.join(__dirname, 'assets/sound/bell.mp3')
        });
      });
    });
  });

  log('Initialize newFile callback.');
  /**
   * Run on new file
   */
  watcherHandler.on('newFile', function (file) {
    log('New file ' + file);
    uploaderHandler.upload(file);
  });
}

ipc.on('loadApp', function() {
  loadApp(true);
});

ipc.on('newFile', function(event, file) {
  log('Received new dropped file');
  watcherHandler.emit('newFile', file);
});

loadApp();
