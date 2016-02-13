angular.module("app",[]).controller("appController", ["$scope", "userService", "notificationsService", function ($scope, userService, notificationsService) {

    $scope.performLogin = function () {
        userService.performLogin();
    }

    $scope.performLogout = function () {
        userService.performLogout().then(function () {
            $scope.$apply(function () {
                $scope.user = null;
            });
        })
    }

    $scope.openProfile = function () {
        userService.openProfilePage();
    }

    notificationsService.getNotificationsCount().then(function (notificationsCount) {
        $scope.size = notificationsCount.size;
    });
    userService.get().then(function (user) {
        $scope.$apply(function () {
          $scope.user = user;
        });
    }, function (error) {
        console.log(error);
        if(error.status == 400) {
            $scope.notLoggedError = true;
        } else {
            $scope.showErrorLoad = true;
        }
    });
}]);