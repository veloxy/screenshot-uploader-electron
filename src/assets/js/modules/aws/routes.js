angular.module('app.aws.routes', [router])
  .config(function($stateProvider) {
    $stateProvider
      .state('aws', {
        url: '/aws',
        templateUrl: __dirname + '/settings.html'
      });
  });