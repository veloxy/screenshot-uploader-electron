//noinspection JSUnresolvedFunction
const electron = require('electron');
const AWS = require('aws-sdk');
const path = require('path');
const app = electron.app;
const ncp = require("copy-paste");
const mime = require('mime');
const tray = electron.Tray;
const browserWindow = electron.BrowserWindow;
const chokidar = require('chokidar');

AWS.config.loadFromPath('src/config/config.json');

var watcher = chokidar.watch('/Users/kevinvandenborne/Desktop', {
  ignored: /[\/\\]\./,
  persistent: true,
  alwaysStat: true
});

watcher.on('add', function (file, event) {
  console.log('file add')
  $fileCreatedDate = new Date(event.ctime);
  $currentDate = new Date();
  $pastDate = new Date($currentDate.getTime() - 60000);

  if ($fileCreatedDate >= $pastDate && $fileCreatedDate <= $currentDate) {

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
      console.log(err);
      console.log(data);
      console.log("Successfully uploaded data to myBucket/myKey");
      ncp.copy(data.Location, function () {
        console.log("url pasted to clipboard");
      })
    });
  }
});

//app.dock.hide();

app.on('ready', function(){
  window = new browserWindow({ width: 1, height: 1, show: false });

  window.loadURL('file://' + __dirname + '/index.html');

  window.webContents.on('did-finish-load', function() {
    //menuTray = new tray(path.join(__dirname, 'pomodoro-w.png'));
    menuTray = new tray(null);
    menuTray.setTitle('');
  });
});