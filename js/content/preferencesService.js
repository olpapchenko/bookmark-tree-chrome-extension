preferencesService = {
    EXTENSION_ENABLED: 0,
    BOOKMARK_LINKS_ENABLED: 1,
    MARKS_ENABLED: 2,
    COMMENTS_ENABLED: 3,
    NOTIFICATIONS_ENABLED: 4,
    MARK_COLOR: 5,
    REFRESH_PERIOD: 6,

    get: function getPreferences () {
        return new Promise(function (resolve, reject) {
            chrome.runtime.sendMessage({type: "GET_PREFERENCES"},null , function (message) {
                if(message.error){
                    reject(message.error);
                }
                resolve(message);
            });
        });
    }
}
