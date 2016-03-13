bookmarksService = {
    getBookmarkForUrl: function (url) {
        return new Promise(function (resolve, reject) {
            chrome.runtime.sendMessage({type: "GET_BOOKMARK_FOR_URL", url: url}, null, function (message) {
                if(message && message.error){
                    reject(message.error);
                }
                resolve(message);
            });
        });
    },

    getBookmarkByHeaderOrTag: function () {
        return new Promise(function (resolve, reject) {
            chrome.runtime.sendMessage({type: "GET_BOOKMARK_BY_HEADER_OR_TAG"}, null, function (message) {
                if(message && message.error) {
                    reject(message.error);
                }
                resolve(message);
            })
        });
    },

    getBookmarkById: function (id) {
        return new Promise(function (resolve, reject) {
            chrome.runtime.sendMessage({type: "GET_BOOKMARK_BY_ID", id: id}, null, function (message) {
                if(message && message.error) {
                    reject(message.error);
                }
                resolve(message);
            })
        });
    },

    save: function () {
        return new Promise(function (resolve, reject) {
            chrome.runtime.sendMessage({type: "SAVE_BOOKMARK", bookmark: Bookmark.getBookmark()}, null, function(message)
            {
                if(message && message.error) {
                    reject(message.error);
                }
                Bookmark.id = message.id;
                resolve(message);
            });
        })
    },

    remove: function () {
        return new Promise(function (resolve, reject) {
            chrome.runtime.sendMessage({type: "REMOVE_BOOKMARK", bookmark: Bookmark.getBookmark()}, null, function(message)
            {
                if(message && message.error) {
                    reject(message.error);
                }
                Bookmark = new BookmarkClass()
                resolve(message);
            });
        })
    }
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if(message.type == "GET_BOOKMARK") {
        sendResponse(Bookmark.getBookmark());
    }
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if(message.type == "UPDATE_BOOKMARK_NAME") {
        Bookmark.setName(message.name);
        sendResponse(true);
    }
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if(message.type == "UPDATE_BOOKMARK_BRANCH") {
        Bookmark.setBranch(message.branch_id);
        sendResponse(true);
    }
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if(message.type == "SAVE_CURRENT_BOOKMARK") {
        bookmarksService.save().then(function () {
           sendResponse(Bookmark.getBookmark());
        });
    }
    return true;
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if(message.type == "REMOVE_CURRENT_BOOKMARK") {
        bookmarksService.remove().then(function () {
            sendResponse(Bookmark.getBookmark());
        });
    }
    return true;
});
