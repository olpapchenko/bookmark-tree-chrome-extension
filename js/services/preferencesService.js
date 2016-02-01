angular.module("app").service("preferencesService", ["$http", function ($http) {
    var preferencesURL = "/preferences";

    this.preferencesKeys = {
        enableNotifications: 1,
        enableReferences: 2,
        enableComments: 3,
        enableMarks: 4,
        enableExtension: 6,
        refreshPeriod: 7
    }

    this.get = function (keys) {
        var _this = this,
            keysArray = [];

        if(Array.isArray(keys)) {
            keysArray = keys;
        } else {
            keysArray.push(keys);
        }

        keysArray.push(this.refreshPeriod);

        return chrome.extension.getBackgroundPage().storageService.get(keysArray).then(function (preferences) {
             if(!preferences  || new Date().getTime() - preferences.lastSyncDate > preferences[_this.preferencesKeys.refreshPeriod]) {
                return $http.get(chrome.runtime.getManifest().endpoinUrl + preferencesURL).then(function (preferences) {
                    preferences.lastSyncDate = new Date();
                    return _this.set(preferences.data);
                });
             } else {
                 return preferences;
             }
        });
    }

    this.set = function (preferences) {
        return chrome.extension.getBackgroundPage().storageService.set(preferences).then(function () {
            return $http.post(chrome.runtime.getManifest().endpoinUrl + preferencesURL, preferences);
        }).then(function () {
            return preferences;
        });
    }
}]);