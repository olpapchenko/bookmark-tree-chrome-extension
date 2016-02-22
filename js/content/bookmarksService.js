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