branchService = {
    getDefault : function () {
        return new Promise(function (resolve, reject) {
            chrome.runtime.sendMessage({type: "GET_DEFAULT_BRANCH"}, null, function (message) {
                if(message && message.error) {
                    reject(message.error);
                }
                resolve(message);
            })
        });
    }
}