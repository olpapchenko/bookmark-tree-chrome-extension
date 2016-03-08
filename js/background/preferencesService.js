var PREFERENCES_URL = "/preferences",
    PREFERENCES_KEY = "preferences";

function getTimeout() {
    return storageService.get(PREFERENCES_KEY).then(function (preferences) {
        var preferences = preferences.preferences;

        if(preferences && preferences.entity &&  preferences.entity.preferences) {
            var refreshPeriod = preferences.entity.preferences.filter(function (preference) {
                return preference.key == preferencesService.REFRESH_PERIOD;
            })[0];
            return refreshPeriod.value || 0;
        }
        return 0;
    });
}

preferencesService = {
    EXTENSION_ENABLED: 0,
    BOOKMARK_LINKS_ENABLED: 1,
    MARKS_ENABLED: 2,
    COMMENTS_ENABLED: 3,
    NOTIFICATIONS_ENABLED: 4,
    MARK_COLOR: 5,
    REFRESH_PERIOD: 6,

    get: function () {
        return getTimeout().then(function (timeout) {
            return baseCachedAccessPoint.get(PREFERENCES_KEY, PREFERENCES_URL, timeout);
        }).then(function (preferences) {
            var flatPreferences = {};
            preferences.preferences.forEach(function (preference) {
                flatPreferences[preference.key] = {value: preference.key < 5 ?  String(preference.value) == 'true'  : preference.value, id: preference.id};
            });
            return flatPreferences;
        });
    },

    set: function (flatPreferences, replace) {
        var preferences = [];
        for(var key in flatPreferences) {
            if(flatPreferences.hasOwnProperty(key)){
                preferences.push({key: key, value: flatPreferences[key].value, id: flatPreferences[key].id});
            }
        }
        return getTimeout().then(function (timeout) {
            return baseCachedAccessPoint.set(PREFERENCES_KEY, PREFERENCES_URL, timeout, {preferences: preferences}, true);
        });
    }
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if(message.type !== "GET_PREFERENCES") {
        return;
    }
    preferencesService.get().then(sendResponse).catch(function (e) {
        sendResponse({error:  e});
    });
    return true;
});