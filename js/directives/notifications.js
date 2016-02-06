angular.module("app").directive("notifications", ["notificationsService", function (notificationsService) {
    return {
        restrict: "E",
        templateUrl: "/html/templates/notifications.html",
        link: function (scope, element, attrs) {
            notificationsService.getNotificationsCount().then(function (count) {
                scope.$apply(function () {
                    if(count  > 0) {
                        return notificationsService.getNotifications();
                    } else {
                        return;
                    }
                });
            }, function () {
                scope.$apply(function () {
                    scope.showErrorLoad = true;
                });
            });
        }
    }
}]);