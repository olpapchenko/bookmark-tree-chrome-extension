var PREFERENCES_URL = "/preferences";

preferencesService = {
    preferenceTypes: {
        NOTIFICATION_INTERVAL: 1,
        EXTENSION_ENABLED: 2,
        BOOKMARK_LINKS_ENABLED: 3,
        MARKS_ENABLED: 4,
        COMMENTS_ENABLED: 5,
        NOTIFICATIONS_ENABLED: 6,
        REFRESH_PERIOD: 7
    },

    get: function () {
        var _this = this;
        return storageService.get("preferences").then(function (preferences) {
             preferences = preferences.preferences;
             if(preferences == undefined  ||
                new Date().getTime() - preferences.lastRefreshDate > preferences[_this.preferenceTypes.REFRESH_PERIOD]) {
                return Promise.resolve($.get(chrome.runtime.getManifest().endpointUrl + PREFERENCES_URL)).then(function (preferences) {
                    preferences.lastRefreshDate = new Date();
                    storageService.set({preferences: preferences});
                    return preferences;
                });
            } else {
                return preferences;
            }
        });
    },

    set: function (newPreferences) {
        return this.get().then(function (oldPreferences) {
            console.log(oldPreferences);
            return _.extend(oldPreferences, newPreferences);
        }).tap(function (preferences) {
            return storageService.set({preferences: preferences});
        })
        .then(function (preferences) {
            return Promise.resolve($.post(chrome.runtime.getManifest().endpointUrl + PREFERENCES_URL, preferences));
        }).then(function () {
            return newPreferences;
        });
    }
}