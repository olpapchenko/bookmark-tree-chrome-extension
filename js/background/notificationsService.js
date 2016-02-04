var NOTIFICATONS_URL = "/notifications",
    NOTIFICATONS_COUNT_URL = "/notifications/count";

notificationService = {

    getNotifications: function () {
        return Promise.resolve($.get(this.NOTIFICATONS_URL));
    },

    getNewNotificationsCount: function () {
        return Promise.resolve($.get(this.NOTIFICATONS_COUNT_URL));
    }
};
