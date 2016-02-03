storageService = {
    get: function  get(keys) {
        var promise =  new Promise(function (resolve, reject) {
            chrome.storage.sync.get(keys, resolve);
        }).then(function(serializedObject) {
                console.log(serializedObject);
            var deserializedObject = {};
            for(key in serializedObject) {
                    if(serializedObject.hasOwnProperty(key)) {
                        deserializedObject[key] = JSON.parse(serializedObject[key]);
                        console.log("set key " + key);
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
            chrome.storage.sync.set(jsonObject, resolve);
        });
        return promise;
    }
}

