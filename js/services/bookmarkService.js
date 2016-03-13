angular.module("app").service("bookmarkService", function () {
    var backgroundPage = chrome.extension.getBackgroundPage().bookmarkService;

    this.get = backgroundPage.get;

    this.getRights = backgroundPage.getRights;

    this.setRights = backgroundPage.setRights;

    this.getByUrl = function () {
        return new Promise(function (resolve, reject) {
            chrome.tabs.query({active: true}, resolve);
        }).then(function (tabs) {
            var tab = tabs[0];
            return backgroundPage.getByUrl(tab.url);
        });

    }

    this.updateBookmarkName = function (name) {
        return new Promise(function (resolve, reject) {
            getActiveTab(function (tab) {
                chrome.tabs.sendMessage(tab[0].id, {type: "UPDATE_BOOKMARK_NAME", name: name}, null, function (res) {
                    resolve(res);
                });
            });
        });
    }

    this.updateBranch = function (id) {
        return new Promise(function (resolve, reject) {
            getActiveTab(function (tab) {
                chrome.tabs.sendMessage(tab[0].id, {type: "UPDATE_BOOKMARK_BRANCH", branch_id: id}, null, function (res) {
                    resolve(res);
                });
            });
        });
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

    this.remove = function () {
        return new Promise (function (resolve, reject) {
            chrome.tabs.query({active: true}, function (tabs) {
                var tab = tabs[0];
                chrome.tabs.sendMessage(tab.id, {type: "REMOVE_CURRENT_BOOKMARK"}, null, function (message) {
                    if(message && message.error) {
                        reject(message.error);
                    } else {
                        resolve(message);
                    }
                });
            });
        });
    }

    this.save = function () {
        return new Promise (function (resolve, reject) {
            chrome.tabs.query({active: true}, function (tabs) {
                var tab = tabs[0];
                chrome.tabs.sendMessage(tab.id, {type: "SAVE_CURRENT_BOOKMARK"}, null, function (message) {
                    if(message && message.error) {
                        reject(message.error);
                    } else {
                        resolve(message);
                    }
                });
            });
        })
    }
});