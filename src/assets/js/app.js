global.angular = require('angular');
global.router = require('angular-ui-router');

require(__dirname + '/assets/js/modules/aws/module.js');

var app = angular.module('app', [router, 'app.aws']);

app.factory("pluginService", function() {
  return {
    getUploaders: function() {
      return [{
        name: 'Amazon S3',
        icon: 'upload',
        handler: 'aws',
      }, {
        name: 'Dropbox',
        icon: 'dropbox',
        handler: 'dropbox'
      }, {
        name: 'Instagram',
        icon: 'instagram',
        handler: 'instagram'
      }];
    },
    getUrlShorteners: function() {
      return [{
        name: 'Goo.gl',
        icon: 'gplus',
        handler: 'google',
      }];
    },
    getWatchers: function() {
      return [{
        name: 'File',
        icon: 'folder',
        handler: 'file',
      }, {
        name: 'Dribbble',
        icon: 'dribbble-circled',
        handler: 'dibbble'
      }, {
        name: 'Dropbox',
        icon: 'dropbox',
        handler: 'dropbox'
      }];
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