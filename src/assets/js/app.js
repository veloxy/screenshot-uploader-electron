var path = require('path');
const ipc = require('electron').ipcRenderer;

global.angular = require('angular');
global.router = require('angular-ui-router');
global.appRoot = path.resolve(__dirname);

require(__dirname + '/assets/js/modules/uploaders/aws/module.js');
require(__dirname + '/assets/js/modules/url-shorteners/goo.gl/module.js');
require(__dirname + '/assets/js/modules/watchers/file/module.js');

var app = angular.module('app', [router, 'app.aws', 'app.googl', 'app.file']);

app.factory("pluginService", function() {
  var pluginHandler = require(__dirname + '/libs/pluginHandler.js');

  return {
    getPlugins: function(type) {
      var plugins = pluginHandler.getPlugins(type);
      var items = [];

      for (var key in plugins) {
        items.push({
          name: plugins[key].getName(),
          icon: plugins[key].getIconName(),
          handler: plugins[key].getHandler()
        })
      }

      return items;
    },
    getUploaders: function() {
      return this.getPlugins('uploaders');
    },
    getUrlShorteners: function() {
      return this.getPlugins('url-shorteners');
    },
    getWatchers: function() {
      return this.getPlugins('watchers');
    },
  };
});

app.controller('pluginController', function($scope, pluginService) {
  $scope.plugins = {};
  $scope.plugins.uploaders = pluginService.getUploaders();
  $scope.plugins.watchers = pluginService.getWatchers();
  $scope.plugins.urlShorteners = pluginService.getUrlShorteners();
});

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/home');
  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'pages/home.html',
      controller: 'loggerController'
    })
    .state('logs', {
      url: '/logs',
      templateUrl: 'pages/logger.html'
    })
});

ipc.on('notification', function(event, options) {
  /**
   * Fix for notification sound because it doesn't seem to work
   * in electron.
   */
  if (options.sound) {
    options.silent = true;
    var audio = new Audio(options.sound);
    audio.play();
    options.sound = null;
  }
  new Notification(options.title, options);
});

ipc.on('play-sound', function(event, soundFile) {
  var audio = new Audio(soundFile);
  audio.play();
});