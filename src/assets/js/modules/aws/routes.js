const ElectronSettings = require('electron-settings');

var settings = new ElectronSettings();

angular.module('app.aws.routes', [router])
  .config(function($stateProvider) {
    $stateProvider
      .state('aws', {
        url: '/aws',
        templateUrl: __dirname + '/settings.html',
        controller: function ($scope) {
          var fields = [
            'accessKeyId',
            'secretAccessKey',
            'bucket',
            'region'
          ];

          for (key in fields) {
            $scope[fields[key]] = settings.get(fields[key], this[fields[key]]);
          }

          $scope.submit = function() {
            for (key in fields) {
              settings.set(fields[key], this[fields[key]]);
            }
          }
        }
      });
  });