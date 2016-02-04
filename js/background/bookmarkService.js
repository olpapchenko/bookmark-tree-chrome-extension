var BOOKMARK_URL = "/bookmarks",
    BOOKMARK_SHARE = "/bookmark/share";

bookmarkService = {
    save: function (bookmarkData) {
        return Promise.resolve($.post(chrome.runtime.getManifest().endpointUrl + BOOKMARK_URL, bookmarkData)).then(function (success) {
            chrome.tabs.query({active: true}, function (tabs) {
                var tab = tabs[0];
                chrome.tabs.sendMessage(tab.id, MESSAGE_TYPES.SAVE_SUCCESS);
            }).catch(function () {
                chrome.tabs.sendMessage(tab.id, MESSAGE_TYPES.SAVE_FAIL);
            })
        });
    },

    share: function (bookmarkRights) {
        return Promise.resolve($.post(chrome.runtime.getManifest().endpointUrl + BOOKMARK_SHARE, bookmarkRights));
    }
}