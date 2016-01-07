getActiveTab = function (callback) {
    chrome.tabs.query({active: true}, callback);
}