(function () {
    preferencesService.get().then(function (preferences) {
        setInterval(function () {
            notificationsService.getNotificationsCount().then(function (count) {
                chrome.browserAction.setBadgeText({text: (count.size).toString()});
            });

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


