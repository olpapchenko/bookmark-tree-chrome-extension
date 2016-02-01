storageService = {
    get: function  get(key) {
        var promise =  new Promise(function (resolve, reject) {
            chrome.storage.sync.get(key, resolve);
        });
        return promise;
    },

    set: function (entry) {
        var promise = new Promise(function (resolve, reject) {
            chrome.storage.sync.set(entry, resolve);
        });
        return promise;
    }
}

