storageService = {
    get: function  get(keys) {
        var promise =  new Promise(function (resolve, reject) {
            chrome.storage.local.get(keys, resolve);
        }).then(function(serializedObject) {
            var deserializedObject = {};
            for(key in serializedObject) {
                    if(serializedObject.hasOwnProperty(key)) {
                        deserializedObject[key] = JSON.parse(serializedObject[key]);
                    }
            }
            return _.pick(deserializedObject, keys);
        });
        return promise;
    },

    set: function (entries) {
        var jsonObject = {};
        for(entry in entries) {
            if(entries.hasOwnProperty(entry)) {
                jsonObject[entry] = JSON.stringify(entries[entry]);
            }
        }
        var promise = new Promise(function (resolve, reject) {
            chrome.storage.local.set(jsonObject, resolve);
        });
        return promise;
    },

    erase: function () {
        return new Promise(function (resolve, reject) {
            chrome.storage.local.remove(key, resolve);
        });
    }
}

