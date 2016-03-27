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

    set: function (key, endpointUrl, timeout, newEntity, replace, omitPersistLocal, replaceByPredicate) {
        var _this = this,
            resultSavedEntity;
        return Promise.resolve($.ajax({url: chrome.runtime.getManifest().endpointUrl + endpointUrl, type: "POST", data: JSON.stringify(newEntity), dataType: "text", contentType:"application/json; charset=utf-8"}))
        .then(function (response) {
            return JSON.parse(response);
        })
        .then(function (savedEntity) {
            resultSavedEntity = savedEntity;
            if (!replace) {
                return _this.get(key, endpointUrl, timeout).then(function (oldEntity) {
                    if(Array.isArray(oldEntity)) {
                        if(replaceByPredicate) {
                            oldEntity = oldEntity.map(function (entity) {
                                return replaceByPredicate(entity, savedEntity) ? savedEntity : entity;
                            });
                        }
                        return oldEntity.concat(savedEntity);
                    } else {
                        return _.extendOwn(oldEntity, savedEntity);
                    }
                });
            } else {
                return Promise.resolve(savedEntity);
            }
        }).then(function (entity) {
            if(!omitPersistLocal) {
                var keyToEntity = {};
                keyToEntity[key] = {entity: entity, lastRefreshDate: new Date().getTime()};
                return storageService.set(keyToEntity).then(function () {
                    return resultSavedEntity;
                });
            } else {
                return resultSavedEntity;
            }
        });
    },

    erase: function (key, endpointUrl, timeout, callback) {
        if(callback) {
            return get(key,  endpointUrl, timeout)
                .then(callback);
        } else {
            return  storageService.erase(key);
        }
    }
}