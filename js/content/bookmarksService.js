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
            chrome.runtime.sendMessage({type: "SAVE_BOOKMARK", bookmark: Bookmark.getBookmark(true)}, null, function(message)
            {
                if(message && message.error) {
                    reject(message.error);
                }

                bookmarkRenderer.reconcileBookmark(message);
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
                bookmarkRenderer.removeAllFromUI();
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
    if(message.type == "UPDATE_OWNERSHIP") {
        Bookmark.addOwner(message.owner);
        sendResponse(true);
    }
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if(message.type == "UPDATE_OBSERVER") {
        Bookmark.addObserver(message.observer);
        sendResponse(true);
    }
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if(message.type == "REMOVE_RIGHTS") {
        Bookmark.removeRights(message.user);
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

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if(message.type == "REMOVE_MARKER_BY_ID") {
        markController.removeMarkerById(message.id, message.isNew);
    }
    return true;
});


chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if(message.type == "REMOVE_COMMENT_BY_ID") {
        commentController.removeById(message.id, message.isNew);
    }
    return true;
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if(message.type == "REMOVE_LINK_BY_ID") {
        linkController.removeById(message.id, message.isNew);
    }
    return true;
});
