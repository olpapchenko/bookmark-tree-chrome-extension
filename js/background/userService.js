var LOGIN_PATH = '/login',
    PROFILE_PATH = "/profile";

userService = {
    getLoginPath: function () {
        return chrome.runtime.getManifest().enpointUrl + LOGIN_PATH;
    },

    getProfilePath: function () {
        return chrome.runtime.getManifest().enpointUrl + PROFILE_PATH;
    }
}