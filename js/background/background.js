function updateNotificationsBadge(intervalObj, oldRefreshPeriod) {
    preferencesService.get().then(function (freshPreferences) {
        if(!freshPreferences[preferencesService.NOTIFICATIONS_ENABLED] || !freshPreferences[preferencesService.EXTENSION_ENABLED]) {
            return;
        }
        var newRefreshPeriod = freshPreferences[preferencesService.REFRESH_PERIOD].value;
        console.log(newRefreshPeriod);
        if(oldRefreshPeriod != newRefreshPeriod) {
            clearInterval(intervalObj.intervalId);
            var newIntevalObj = {};
            newIntevalObj.intervalId = setInterval(function (){updateNotificationsBadge(newIntevalObj, newRefreshPeriod)}, newRefreshPeriod * 1000 * 60);
        }
        console.log("setting badge");

        bookmarkService.get().catch(function (e) {
            console.error("can not update bookmarks list " + JSON.stringify(e));
        });

        notificationsService.getNotificationsCount().then(function (count) {
            chrome.browserAction.setBadgeText({text: (count.size).toString()});
        }, function (e) {
            console.error("cannot set notifications badge " + JSON.stringify(e));
        });
    });

}

(function () {
    preferencesService.get().then(function (preferences) {
        var intervalObj = {};
        intervalObj.intervalId = setInterval(function () {
            updateNotificationsBadge(intervalObj, preferences[preferencesService.REFRESH_PERIOD].value)
        }, preferences[preferencesService.REFRESH_PERIOD].value * 1000 * 60);
    }, function (e) {console.error("can not set notifications count badge error: " + JSON.stringify(e));});
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


