baseCachedAccessPoint = {
    get: function (key, enpointURL, timeout) {
        return storageService.get(key).then(function (entity) {
            console.log("get entity" + JSON.stringify(entity) + "key: " + key);
            entity = entity[key];
            if(entity == undefined || !entity.lastRefreshDate || new Date().getTime() - entity.lastRefreshDate > timeout * 1000 * 60 * 10) {
                console.log("retriving from server: " + enpointURL);
                return Promise.resolve($.get(chrome.runtime.getManifest().endpointUrl + enpointURL)).then(function (entity) {
                    console.log(entity);
                    console.log(enpointURL);
                    var keyToEntity = {}
                    keyToEntity[key] = entity;
                    entity.lastRefreshDate = new Date().getTime();
                    storageService.set(keyToEntity);
                    return entity;
                });
            } else {
                return entity;
            }
        });
    },

    set: function (key, endpointUrl, timeout, newEntity, replace) {

        if(!replace) {
            var promise = this.get(key, endpointUrl, timeout).then(function (oldEntity) {
                return _.extend(oldEntity, newEntity);
            });
        } else {
            var promise = Promise.resolve(newEntity);
        }

        return promise.tap(function (entity) {
            var keyToEntity = {};
            keyToEntity[key] = entity;
            return storageService.set(keyToEntity);
        }).then(function (entity) {
            return Promise.resolve($.post(chrome.runtime.getManifest().endpointUrl + endpointUrl, entity));
        });
    },

    erase: function (key) {
        console.log("perfom logout");
        var keyToEntity = {};
        keyToEntity[key] = "";
        return  storageService.set(keyToEntity);
    }
}