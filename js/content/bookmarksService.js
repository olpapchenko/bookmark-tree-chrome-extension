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
        return Promise(function (resolve, reject) {
            chrome.runtime.sendMessage({type: "GET_BOOKMARK_BY_HEADER_OR_TAG"}, null, function (message) {
                if(message && message.error) {
                    reject(message.error);
                }
                resolve(message);
            })
        });
    },

    getBookmarkById: function (id) {
        return Promise(function (resolve, reject) {
            chrome.runtime.sendMessage({type: "GET_BOOKMARK_BY_ID", id: id}, null, function (message) {
                if(message && message.error) {
                    reject(message.error);
                }
                resolve(message);
            })
        });
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
