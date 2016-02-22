angular.module("app").service("bookmarkService", function () {
    var backgroundPage = chrome.extension.getBackgroundPage().bookmarkService;

    this.get = backgroundPage.get;

    this.getByUrl = backgroundPage.getByUrl;

    this.save = backgroundPage.save;

    this.getRights = backgroundPage.getRights;

    this.setRights = backgroundPage.setRights;

    this.updateBookmarkName = function (name) {
        return new Promise(function (resolve, reject) {
            getActiveTab(function (tab) {
                chrome.tabs.sendMessage(tab[0].id, {type: "UPDATE_BOOKMARK_NAME", name: name}, null, function (res) {
                    resolve(res);
                });
            })
        })
    }

    this.getCurrentBookmark = function () {
        return new Promise (function (resolve, reject) {
            getActiveTab(function (tab) {
                chrome.tabs.sendMessage(tab[0].id, {type: "GET_BOOKMARK"}, null, function (bookmark) {
                    resolve(bookmark);
                });
            });
        });
    }

    this.save = function () {
        return getCurrentBookmark().then(function (bookmark) {
            console.log(bookmark);
        });
    }
});