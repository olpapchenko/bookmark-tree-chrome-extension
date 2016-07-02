var BOOKMARKS_URL = "/bookmarks",
    BOOKMARK_URL = "/bookmark",
    BOOKMARK_RIGHTS_URL= "/bookmark/share",
    BOOKMARK_KEY = "bookmarks",
    BOOKMARK_RIGHTS_KEY = "bookmark_rights";


var MARKERS = 'markers',
    COMMENTS = 'comments',
    LINKS = 'links';
bookmarkService = {
    getMainPath: function () {
        return chrome.runtime.getManifest().endpointUrl;
    },

    save: function (bookmarkData) {
        bookmarkData.name = bookmarkData.name.slice(0, 50);

       return preferencesService.get().then(function (preferences) {
           return baseCachedAccessPoint.set(BOOKMARK_KEY, BOOKMARK_URL, preferences[preferencesService.REFRESH_PERIOD].value, bookmarkData, false, false,
               function (bookmark, newBookmark) {return bookmark.url == newBookmark.url;});
       })
       .tap(function (success, error) {
            chrome.tabs.query({active: true}, function (tabs) {
                var tab = tabs[0];
                if(success) {
                    chrome.tabs.sendMessage(tab.id, MESSAGE_TYPES.SAVE_SUCCESS);
                } else {
                    chrome.tabs.sendMessage(tab.id, MESSAGE_TYPES.SAVE_FAIL);
                }
            });
        });
    },

    remove: function (id) {
        var _this = this;
         return Promise.resolve($.post(chrome.runtime.getManifest().endpointUrl + BOOKMARK_URL + "/remove", {id: id}))
             .then(function () {
                 return _this.get();
             }).then(function (bookmarks) {
                 var saveBookmark = bookmarks.filter(function (bookmark) {
                     return bookmark.id != id;
                 });
                 var keyToEntity = {};
                 keyToEntity[key] = {entity: saveBookmark, lastRefreshDate: new Date().getTime()};
                 return storageService.set(keyToEntity);
             });
    },

    get: function () {
        return preferencesService.get().then(function (preferences) {
           return baseCachedAccessPoint.get(BOOKMARK_KEY, BOOKMARKS_URL, preferences[preferencesService.REFRESH_PERIOD].value);
        });
    },

    getAllEntitiesCount: function getAllEntitiesCount(bookmark) {
        return bookmark ? this.getDisplayebleEntities(MARKERS, bookmark).length +
            this.getDisplayebleEntities(LINKS, bookmark).length +
            this.getDisplayebleEntities(COMMENTS, bookmark).length
            :0;
    },

    getDisplayebleEntities: function getDisplayebleEntities(entityName, bookmark) {
        return bookmark[entityName].filter(function (entity) {
            return entity.display;
        })
    },

    getById: function (id) {
        return Promise.resolve($.get(chrome.runtime.getManifest().endpointUrl + BOOKMARK_URL, {id: id}));
    },

    getByUrl: function (url) {
        'use strict'
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
        if(!bookmark) {
            updateExtensionBadge(0);
        } else {
            updateExtensionBadge(bookmarkService.getAllEntitiesCount(bookmark));
        }

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


chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {

    if(message.type !== "SAVE_BOOKMARK") {
        return;
    }

    bookmarkService.save(message.bookmark).then(function (bookmark) {
        sendResponse(bookmark);
    }).catch(function (e) {
        sendResponse({error: e});
    });
    return true;
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {

    if(message.type !== "REMOVE_BOOKMARK") {
        return;
    }

    bookmarkService.remove(message.bookmark.id).then(function (bookmark) {
        sendResponse(bookmark);
    }).catch(function (e) {
        sendResponse({error: e});
    });
    return true;
});


