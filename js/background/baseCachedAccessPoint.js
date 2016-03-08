baseCachedAccessPoint = {
    get: function (key, enpointURL, timeout) {
        return storageService.get(key).then(function (entity) {
            entity = entity[key];
            if(entity == undefined || !entity.entity || !entity.lastRefreshDate || new Date().getTime() - entity.lastRefreshDate > timeout * 1000 * 60) {
                return Promise.resolve($.get(chrome.runtime.getManifest().endpointUrl + enpointURL)).then(function (entity) {
                    var keyToEntity = {}
                    keyToEntity[key] = {entity: entity, lastRefreshDate: new Date().getTime()};
                    storageService.set(keyToEntity);
                    return entity;
                });
            } else {
                return entity.entity;
            }
        });
    },

    set: function (key, endpointUrl, timeout, newEntity, replace, omitPersistLocal) {
        if(!replace) {
            var promise = this.get(key, endpointUrl, timeout).then(function (oldEntity) {
                return _.extend(oldEntity, newEntity);
            });
        } else {
            var promise = Promise.resolve(newEntity);
        }

        return promise.tap(function (entity) {
            return Promise.resolve($.ajax({url: chrome.runtime.getManifest().endpointUrl + endpointUrl, type: "POST", data: JSON.stringify(entity), dataType: "text", contentType:"application/json; charset=utf-8"}));
        }).then(function (savedEntity) {
            if(!omitPersistLocal) {
                var keyToEntity = {};
                keyToEntity[key] = {entity: savedEntity, lastRefreshDate: new Date().getTime()};
                return storageService.set(keyToEntity);
            } else {
                return true;
            }
        });
    },

    erase: function (key) {
        return  storageService.erase(key);
    }
}