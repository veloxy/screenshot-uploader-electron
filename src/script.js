//noinspection JSUnresolvedFunction
const electron = require('electron'),
  AWS = require('aws-sdk'),
  path = require('path'),
  app = electron.app,
  ncp = require("copy-paste"),
  mime = require('mime'),
  tray = electron.Tray,
  browserWindow = electron.BrowserWindow,
  chokidar = require('chokidar');

AWS.config.loadFromPath('src/config/config.json');

var watcher = chokidar.watch('/Users/kevin/Dropbox/Screenshots', {
  ignored: /[\/\\]\./,
  persistent: true,
  alwaysStat: true
});

watcher.on('add', function (file, event) {
console.log('File added')
  $fileCreatedDate = new Date(event.ctime);
  $currentDate = new Date();
  $pastDate = new Date($currentDate.getTime() - 60000);

  if ($fileCreatedDate >= $pastDate && $fileCreatedDate <= $currentDate) {

    console.log('New file added to folder /Users/kevin/Dropbox/Screenshots');

    var fs = require('fs');

    var s3 = new AWS.S3({
      params: {
        Bucket: 'sourcebox-screenshots',
        Key: path.parse(file).base
      }
    });

    s3.upload({
      Body: fs.createReadStream(file),
      ACL: "public-read",
      ContentType: mime.lookup(file)
    }, function (err, data) {

      console.log('File uploaded to sourcebox-screenshots/' + path.parse(file).base);

      ncp.copy(data.Location, function () {

        console.log("S3 URL pasted to clipboard " + data.Location);

      })
    });
  }
});

app.dock.hide();

app.on('ready', function(){
  window = new browserWindow({ width: 1, height: 1, show: false });

  window.loadURL('file://' + __dirname + '/index.html');

  window.webContents.on('did-finish-load', function() {
    var menuTray = new tray(path.join(__dirname, 'assets/icons/trayTemplate.png'));
    menuTray.setTitle('');

    menuTray.on('drag-enter', function(event, test) {
      console.log('drag-enter!');
      console.log(event);
      console.log(test);
    });

    menuTray.on('drag-leave', function(event, test) {
      console.log('drag-leave!');
      console.log(event);
      console.log(test);
    });

    menuTray.on('drag-end', function(event, test) {
      console.log('drag-end!');
      console.log(event);
      console.log(test);
    });

    menuTray.on('drop-files', function(event, files) {
      console.log('drop-files!');
      console.log(event);
      console.log(files);
    });

    menuTray.on('drop', function(event) {
      console.log('drop!');
      console.log(event);
    });
  });
});