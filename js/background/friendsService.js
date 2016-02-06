var FRIENDS_URL = "/friends",
    FRIENDS_KEY = "friends";

friendsService = {
    get: function () {
        return preferencesService.get().then(function (preferences) {
            return baseCachedAccessPoint.get(FRIENDS_KEY, FRIENDS_URL, preferences[preferencesService.REFRESH_PERIOD]);
        });
    },

    getNewFriendsUrl: function () {
        return chrome.runtime.getManifest().endpointUrl + "#friends";
    }
}