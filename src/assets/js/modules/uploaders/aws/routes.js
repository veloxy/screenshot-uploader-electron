var plugin = require('./plugin.js');

angular.module('app.aws.routes', [router])
  .config(function($stateProvider) {
    $stateProvider
      .state('aws', {
        url: '/' + plugin.getHandler(),
        templateUrl: __dirname + '/settings.html',
        controller: function ($scope) {
          var config = plugin.getConfig();

          for (var key in config) {
            $scope[key] = config[key];
          }

          $scope.configPath = plugin.getConfigPath();

          $scope.submit = function() {
            plugin.saveConfig(this);
          }
        }
      });
  });