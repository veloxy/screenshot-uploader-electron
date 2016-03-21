localStorage.setItem('logs', JSON.stringify([]));
app.controller('loggerController', ['$scope', function($scope) {
  if (localStorage.getItem('logs')) {
    $scope.logs = JSON.parse(localStorage.getItem('logs'));
  } else {
    $scope.logs = [];
  }

  ipc.on('newLog', function (event, log) {
    var logs = JSON.parse(localStorage.getItem('logs'));
    if (logs.length <= 0) {
      logs = [];
    }
    logs.push(log);
    localStorage.setItem('logs', JSON.stringify(logs));
    $scope.logs = logs;
  });
}]);