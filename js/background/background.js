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
} 

preferencesService = {
    PREFERENCES_URL: "/preferences",
    cache: {},

    preferencesTypes: {
        NOTIFICATION_INTERVAL: 1,
        EXTENSION_ENABLED: 2,
        BOOKMARK_ENABLED: 3,
        MARKS_ENABLED: 4,
        COMMENTS_ENABLED: 5,
        NOTIFICATIONS_ENABLED: 6
    },

    get: function (key, cache) {
        if(cache && cache[key]) {
            return cache[key];
        }

        return Promise.resolve($.get(this.PREFERENCES_URL)).then(function (value) {
            if(cache) {
                this.cache[key] = value;
            }
        });
    },

    set: function (preferenceKey, preferenceValue) {
        return Promise.resolve($.post(this.PREFERENCES_URL, {key: preferenceKey, value: preferenceValue}));
    }
};

(function controller () {
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


