angular.module("app").service("notificationsService", function () {
   this.getNotifications = function () {
       return chrome.extension.getBackgroundPage().notificationService.getNotifications();
   }

    this.getNotificationsCount = function () {
        return chrome.extension.getBackgroundPage().notificationsService.getNotificationsCount();
    }
});