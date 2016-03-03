var BOOKMARKS_URL = "/bookmarks",
    BOOKMARK_URL = "/bookmark",
    BOOKMARK_RIGHTS_URL= "/bookmark/share",
    BOOKMARK_KEY = "bookmarks",
    BOOKMARK_RIGHTS_KEY = "bookmark_rights";

bookmarkService = {
    save: function (bookmarkData) {
        bookmarkData.name = bookmarkData.name.slice(0, 50);
       return  preferencesService.get().then(function (preferences) {
            return baseCachedAccessPoint.set(BOOKMARK_KEY, BOOKMARK_URL, preferences[preferencesService.REFRESH_PERIOD].value, bookmarkData, true, false);
        }).then(function (success) {
            chrome.tabs.query({active: true}, function (tabs) {
                var tab = tabs[0];
                chrome.tabs.sendMessage(tab.id, MESSAGE_TYPES.SAVE_SUCCESS);
            }).catch(function () {
                chrome.tabs.sendMessage(tab.id, MESSAGE_TYPES.SAVE_FAIL);
            });
        });
    },

    get: function () {
        return preferencesService.get().then(function (preferences) {
           return baseCachedAccessPoint.get(BOOKMARK_KEY, BOOKMARKS_URL, preferences[preferencesService.REFRESH_PERIOD].value);
        });
    },

    getById: function (id) {
        Promise.resolve($.get(BOOKMARK_URL, {id: id}));
    },

    getByUrl: function (url) {
        return bookmarkService.get().then(function (bookmarks) {
            var bookmark = bookmarks.find(function (bookmark) {
                return bookmark.url == url;
            });
            return bookmark;
        })
    },

    getRights: function () {
        return preferencesService.get().then(function (preferences) {
            return baseCachedAccessPoint.get(BOOKMARK_RIGHTS_KEY, BOOKMARK_RIGHTS_URL, preferences[preferencesService.REFRESH_PERIOD].value);
        });
    },

    setRights: function (bookmarkRights) {
        return preferencesService.get().then(function (preferences) {
            return baseCachedAccessPoint.set(BOOKMARK_RIGHTS_KEY, BOOKMARK_RIGHTS_URL, preferences[preferencesService.REFRESH_PERIOD].value, bookmarkRights);
        });
    }
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    'use strict'
    if(message.type !== "GET_BOOKMARK_FOR_URL") {
        return;
    }

    bookmarkService.getByUrl(message.url).then(function (bookmark) {
        sendResponse(bookmark);
    }).catch(function (e) {
        sendResponse({error:  e});
    });
    return true;
});


chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {

    if(message.type !== "GET_BOOKMARK_BY_ID") {
        return;
    }

    bookmarkService.getById(message.id).then(function (bookmark) {
        sendResponse(bookmark);
    }).catch(function (e) {
        sendResponse({error: e});
    });
    return true;
});