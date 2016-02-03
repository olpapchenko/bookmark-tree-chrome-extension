notificationService = {
    NOTIFICATONS_URL: "/notifications",
    NOTIFICATONS_COUNT_URL: "/notifications/count",
    
    getNotifications: function () {
        _this = this;
        return Promise.resolve($.get(this.NOTIFICATONS_URL));
    },

    getNewNotificationsCount: function () {
        return Promise.resolve($.get(this.NOTIFICATONS_COUNT_URL));
    }
};

persistanceService = {
    PERSIST_URL: "/bookmarks",

    save: function (bookmarkData) {
        Promise.resolve($.post(this.PERSIST_URL, bookmarkData)).then(function (success) {
            chrome.tabs.query({active: true}, function (tabs) {
                var tab = tabs[0];
                chrome.tabs.sendMessage(tab.id, MESSAGE_TYPES.SAVE_SUCCESS);
            }).catch(function () {
                chrome.tabs.sendMessage(tab.id, MESSAGE_TYPES.SAVE_FAIL);
            })
        });
    }
};

(function () {
    setInterval(function () {
        notificationService.getNewNotificationsCount().then(function (count) {
            chrome.browserAction.setBadgeText(count);
        })
    }, 10000);//preferencesService.get(preferencesService.NOTIFICATION_INTERVAL));
}) ();

chrome.contextMenus.create({"title": "Mark Text", "contexts":["selection"],
    "onclick": function() {
        getActiveTab(function (tab) {
            chrome.tabs.sendMessage(tab[0].id, {type: MESSAGE_TYPES.MARK_SELECTION});
        })
}});

chrome.contextMenus.create({"title": "Create comment", "contexts":["selection"],
    "onclick": function() {
        getActiveTab(function (tab) {
            chrome.tabs.sendMessage(tab[0].id, {type: MESSAGE_TYPES.COMMENT_SELECTION});
        })
}});

chrome.contextMenus.create({"title": "Create link", "contexts":["selection"],
    "onclick": function() {
        getActiveTab(function (tab) {
            chrome.tabs.sendMessage(tab[0].id, {type: MESSAGE_TYPES.BOOKMARK_TREE_BUILDER_SELECTION});
        })
}});


