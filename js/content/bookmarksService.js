bookmarksService = {
    getBookmarkForUrl: function (url) {
        return new Promise(function (resolve, reject) {
            chrome.runtime.sendMessage({type: "GET_BOOKMARK_FOR_URL", url: url}, null, function (message) {
                if(message.error){
                    reject(message.error);
                }
                resolve(message);
            });
        });
    }
}