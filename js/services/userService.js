angular.module("app").service("userService", ["tabsService", function (tabsService) {
    var userServiceBackground = chrome.extension.getBackgroundPage().userService;

    this.get = function () {
        return userServiceBackground.get();
    }

    this.performLogin = function () {
         tabsService.openNewTab(userServiceBackground.getLoginUrl());
    }

    this.openProfilePage = function () {
        tabsService.openNewTab(userServiceBackground.getProfilePath());
    }

    this.performLogout = function () {
        return userServiceBackground.performLogout();
    }
}]);