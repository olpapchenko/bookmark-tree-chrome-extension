angular.module("app").service("notificationsService", function () {
   var backgroundNotificationService = chrome.extension.getBackgroundPage().notificationsService;

    this.getNotifications = function () {
       return backgroundNotificationService.getNotifications();
   }

    this.getNotificationsCount = function () {
        return backgroundNotificationService.getNotificationsCount();
    }

    this.readAll = function () {
        return backgroundNotificationService.readAll();
    }
});