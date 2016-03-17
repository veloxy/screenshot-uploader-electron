var path = require('path');

global.angular = require('angular');
global.router = require('angular-ui-router');
global.appRoot = path.resolve(__dirname);

require(__dirname + '/assets/js/modules/uploaders/aws/module.js');
require(__dirname + '/assets/js/modules/url-shorteners/goo.gl/module.js');

var app = angular.module('app', [router, 'app.aws', 'app.googl']);

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
      templateUrl: 'pages/home.html'
    })
});