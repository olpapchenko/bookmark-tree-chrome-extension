var LOGIN_PATH = '/#/login',
    LOGOUT_PATH = "/logout",
    PROFILE_PATH = "#profile",
    USER_URL = "/user",
    USER_KEY = "user";

userService = {
    getLoginUrl: function () {
        return  chrome.runtime.getManifest().endpointUrl + LOGIN_PATH;
    },

    performLogout: function () {
        return baseCachedAccessPoint.erase(USER_KEY).then(function () {
            return Promise.resolve($.post(chrome.runtime.getManifest().endpointUrl + LOGOUT_PATH));
        });
    },

    getProfilePath: function () {
        return chrome.runtime.getManifest().endpointUrl + PROFILE_PATH;
    },

    get: function () {
        return preferencesService.get().then(function (preferences) {
            return baseCachedAccessPoint.get(USER_KEY, USER_URL, preferences[preferencesService.REFRESH_PERIOD]);
        });
    }
}