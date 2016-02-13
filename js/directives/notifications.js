angular.module("app").directive("notifications", ["notificationsService", function (notificationsService) {
    return {
        restrict: "E",
        templateUrl: "/html/templates/notifications.html",
        link: function (scope, element, attrs) {

            scope.readAll = function () {
                notificationsService.readAll().then(function () {
                   scope.$apply(function () {
                       scope.notifications = null;
                   });
                });
            },

            notificationsService.getNotificationsCount().then(function (count) {
                console.log(count.size);
                if(count.size  > 0) {
                    console.log("get ");
                    return notificationsService.getNotifications();
                } else {
                    return;
                }
            }, function (e) {
                console.error(e);
                scope.$apply(function () {
                    scope.showErrorLoad = true;
                });
            }).then(function (notifications) {
                console.log(notifications);
                scope.$apply(function () {
                    notifications.map(function (notification) {
                        notification.relativeTime = moment(notification.created_at).fromNow();
                       return notification;
                    });
                    scope.notifications = notifications;
                });
            });
        }
    }
}]);