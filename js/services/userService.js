angular.module("app").service("userService", ["tabsService", function (tabsService) {
    var userServiceBackground = chrome.extension.getBackgroundPage().userService;

    this.get = function () {
        return userServiceBackground.get();
    }

    this.performLogin = function () {
        console.log("perfrom lign");
        tabsService.openNewTab(userServiceBackground.getLoginUrl());
    }

    this.performLogout = function () {
        return userServiceBackground.performLogout();
    }

    this.getProfilePath = function () {
        return userServiceBackground.getProfilePath();
    }
}]);