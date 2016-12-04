chrome.runtime.onInstalled.addListener(function (object) {
    //if(object.reason === 'install') {
        chrome.tabs.create({url: "/html/welcome.html"}, function (tab) {
            console.log("New tab launched with http://yoursite.com/");
        });
    //}
});