var LOGIN_PATH = '/#/login',
    LOGOUT_PATH = "/logout",
    PROFILE_PATH = "#profile",
    USER_URL = "/user",
    USER_KEY = "user",
    AVATAR_PREFIX = chrome.runtime.getManifest().endpointUrl  + "/avatars/",
    DEFAULT_AVATAR = chrome.runtime.getManifest().endpointUrl + "/images/user-moderate.png";

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
        var _this = this;
        return preferencesService.get().then(function (preferences) {
            return baseCachedAccessPoint.get(USER_KEY, USER_URL, preferences[preferencesService.REFRESH_PERIOD].value);
        }).then(function (user) {
            user.avatar = _this.getAvatarPath(user.avatar);
            return user;
        });;
    },

    getAvatarPath: function (path) {
        if(path) {
            if(path.indexOf("http") ==  0) {
                return path;
            } else {
                return AVATAR_PREFIX + path;
            }
        } else {
            return DEFAULT_AVATAR;
        }
    },

    erase: function () {
        baseCachedAccessPoint.erase(USER_KEY);
    }
}