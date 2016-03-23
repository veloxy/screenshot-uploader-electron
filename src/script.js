//noinspection JSUnresolvedFunction
const electron = require('electron'),
  app = electron.app,
  tray = electron.Tray,
  menu = electron.Menu,
  browserWindow = electron.BrowserWindow,
  ipc = require('electron').ipcMain;
  path = require('path');

/**
 * Remove the dock icon
 */
app.dock.hide();

global.appRoot = path.resolve(__dirname);
global.log = function (message) {
  console.log('[' + new Date().toLocaleString() + '] ' + message);
  window.webContents.send('newLog', {
    time: new Date().toLocaleString(),
    message: message
  });
}

ipc.on('loadApp', function() {
  window.webContents.send('loadApp');
  log('App reloaded because of settings changes.');
  log('App reload finished.');
});

ipc.on('newLog', function (event, message) {
  log(message);
})

ipc.on('notification', function (event, data) {
  window.webContents.send('notification', data);
})

var menuTray = null;

/**
 * App is ready
 */
app.on('ready', function(){
  global.window = new browserWindow({ width: 800, height: 500, show: false });

  window.loadURL('file://' + __dirname + '/index.html');
  window.webContents.on('did-finish-load', function () {
    menuTray = new tray(__dirname + '/assets/icons/trayTemplate.png');
    menuTray.on('drop-files', function(event, files) {
      log('Files dropped on tray');
      files.map(function(file) {
        log('Sending new dropped file ' + file);
        window.webContents.send('newFile', file);
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

  window.toggleDevTools();
});