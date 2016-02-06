angular.module("app").service("tabsService", function () {
    this.openNewTab = function (url) {
        chrome.tabs.create({url: url});
    }
});