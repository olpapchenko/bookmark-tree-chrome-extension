preferencesService = {
    EXTENSION_ENABLED: 1,
    BOOKMARK_LINKS_ENABLED: 2,
    MARKS_ENABLED: 3,
    COMMENTS_ENABLED: 4,
    NOTIFICATIONS_ENABLED: 5,
    MARK_COLOR: 6,
    REFRESH_PERIOD: 7,

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
