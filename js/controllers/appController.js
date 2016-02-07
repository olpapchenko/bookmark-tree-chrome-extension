angular.module("app",[]).controller("appController", ["$scope", "userService", function ($scope, userService) {

    $scope.performLogin = function () {
        console.log("perf log");
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