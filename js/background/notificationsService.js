var NOTIFICATONS_URL = "/notifications",
    NOTIFICATONS_COUNT_URL = "/notifications/count",
    NOTIFICATONS_READ_ALL_URL = "/notifications/read",
    NOTIFICATIONS_KEY = "notifications",
    NOTIFICATIONS_COUNT_KEY = "notifications_count";

notificationsService = {

    getNotifications: function () {
        return preferencesService.get().then(function (preferences) {
            return baseCachedAccessPoint.get(NOTIFICATIONS_KEY, NOTIFICATONS_URL, preferences[preferencesService.REFRESH_PERIOD].value);
        });
    },

    getNotificationsCount: function () {
        return preferencesService.get().then(function (preferences) {
            return baseCachedAccessPoint.get(NOTIFICATIONS_COUNT_KEY, NOTIFICATONS_COUNT_URL, preferences[preferencesService.REFRESH_PERIOD].value);
        });
    },

    readAll: function () {
        return Promise.resolve($.post(chrome.runtime.getManifest().endpointUrl + NOTIFICATONS_READ_ALL_URL)).then(function () {
            baseCachedAccessPoint.erase(NOTIFICATIONS_KEY);
            baseCachedAccessPoint.erase(NOTIFICATIONS_COUNT_KEY);
        });
    }
};
