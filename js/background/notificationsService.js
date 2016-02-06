var NOTIFICATONS_URL = "/notifications",
    NOTIFICATONS_COUNT_URL = "/notifications/count",
    NOTIFICATIONS_KEY = "notifications";

notificationsService = {

    getNotifications: function () {
        return preferencesService.get().then(function (preferences) {
            return baseCachedAccessPoint.get(NOTIFICATIONS_KEY, NOTIFICATONS_URL, preferences[preferencesService.REFRESH_PERIOD]);
        });
    },

    getNotificationsCount: function () {
        return preferencesService.get().then(function (preferences) {
            return baseCachedAccessPoint.get(NOTIFICATIONS_KEY, NOTIFICATONS_COUNT_URL, preferences[preferencesService.REFRESH_PERIOD]);
        });
    }
};
