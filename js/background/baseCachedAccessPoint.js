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
        var _this = this;
        return Promise.resolve($.ajax({url: chrome.runtime.getManifest().endpointUrl + endpointUrl, type: "POST", data: JSON.stringify(newEntity), dataType: "text", contentType:"application/json; charset=utf-8"}))
        .then(function (savedEntity) {
                savedEntity = JSON.parse(savedEntity);
                if (!replace) {
                    return _this.get(key, endpointUrl, timeout).then(function (oldEntity) {
                        return Array.isArray(oldEntity) ? oldEntity.concat(savedEntity) : _.extendOwn(oldEntity, savedEntity);
                    });
                } else {
                    return Promise.resolve(savedEntity);
                }
        }).then(function (entity) {
                if(!omitPersistLocal) {
                    var keyToEntity = {};
                    keyToEntity[key] = {entity: entity, lastRefreshDate: new Date().getTime()};
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