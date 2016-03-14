angular.module("app",[]).controller("appController", ["$scope", "userService", "notificationsService", "bookmarkService", function ($scope, userService, notificationsService, bookmarkService) {

    $scope.performLogin = function () {
        userService.performLogin();
    }

    $scope.performLogout = function () {
        userService.performLogout().then(function () {
            $scope.$apply(function () {
                $scope.user = null;
                chrome.extension.getBackgroundPage().userService.erase();
            });
        })
    }

    $scope.openProfile = function () {
        userService.openProfilePage();
    }

    notificationsService.getNotificationsCount().then(function (notificationsCount) {
        $scope.size = notificationsCount.size;
    });

    bookmarkService.getCurrentBookmark().then(function(bookmark){
        $scope.$apply(function () {
            $scope.isOwner = bookmark.isOwner;
        });
    });

    userService.get().then(function (user) {
        $scope.$apply(function () {
          $scope.user = user;
            if(!$scope.user) {
                $scope.notLoggedError = true;
            }
            console.log(user);
        });
    }, function (error) {
        $scope.$apply(function () {
            if(error.status == 400) {
                $scope.notLoggedError = true;
            } else {
                $scope.showErrorLoad = true;
            }
        });
    });
}]);