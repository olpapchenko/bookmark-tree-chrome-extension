var PREFERENCES_URL = "/preferences",
    PREFERENCES_KEY = "preferences";

function getTimeout() {
    return storageService.get(PREFERENCES_KEY).then(function (preferences) {
        var preferences = preferences.preferences;
        if(preferences && preferences[preferencesService.REFRESH_PERIOD]) {
            return preferences[preferencesService.REFRESH_PERIOD];
        }
        return 0;
    });
}

preferencesService = {
    EXTENSION_ENABLED: 1,
    BOOKMARK_LINKS_ENABLED: 2,
    MARKS_ENABLED: 3,
    COMMENTS_ENABLED: 4,
    NOTIFICATIONS_ENABLED: 5,
    MARK_COLOR: 6,
    REFRESH_PERIOD: 7,

    get: function () {
        return getTimeout().then(function (timeout) {
            return baseCachedAccessPoint.get(PREFERENCES_KEY, PREFERENCES_URL, timeout);
        });
    },

    set: function (newPreferences, replace) {
        return getTimeout().then(function (timeout) {
            return baseCachedAccessPoint.set(PREFERENCES_KEY, PREFERENCES_URL, timeout, newPreferences, replace);
        });
    }
}