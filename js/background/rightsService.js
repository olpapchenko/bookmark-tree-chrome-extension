var RIGHTS_URL = "/bookmark/share"

rightsService = {
    grantOwnership: function (userId, bookmarkId) {
        return Promise.resolve($.ajax({url: chrome.runtime.getManifest().endpointUrl + RIGHTS_URL, type: "POST", data: JSON.stringify({id: bookmarkId, owners: [userId]}), dataType: "text", contentType:"application/json; charset=utf-8"}));
    },
    
    grantObserver: function (userId, bookmarkId) {
        return Promise.resolve($.ajax({url: chrome.runtime.getManifest().endpointUrl + RIGHTS_URL, type: "POST", data: JSON.stringify({id: bookmarkId, observers: [userId]}), dataType: "text", contentType:"application/json; charset=utf-8"}));
    },

    makePublic: function (bookmarkId) {
        return Promise.resolve($.ajax({url: chrome.runtime.getManifest().endpointUrl + RIGHTS_URL, type: "POST", data: JSON.stringify({id: bookmarkId, isPublic: true}), dataType: "text", contentType:"application/json; charset=utf-8"}));
    },
    prohibitRights: function (userId, bookmarkId) {
        return Promise.resolve($.ajax({url: chrome.runtime.getManifest().endpointUrl + RIGHTS_URL, type: "POST", data: JSON.stringify({id: bookmarkId, removed: [userId]}), dataType: "text", contentType:"application/json; charset=utf-8"}));
    }
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {

    if(message.type !== "GRAND_OWNERSHIP") {
        return;
    }

    rightsService.grantOwnership(message.userId, message.bookmarkId).then(function () {
        sendResponse(true);
    }).catch(function (e) {
        sendResponse({error:  e});
    });
    return true;
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {

    if(message.type !== "GRAND_OBSERVER") {
        return;
    }

    rightsService.grantObserver(message.userId, message.bookmarkId).then(function () {
        sendResponse(true);
    }).catch(function (e) {
        sendResponse({error:  e});
    });
    return true;
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {

    if(message.type !== "MAKE_PUBLIC") {
        return;
    }

    rightsService.makePublik(message.bookmarkId).then(function () {
        sendResponse(true);
    }).catch(function (e) {
        sendResponse({error:  e});
    });
    return true;
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {

    if(message.type !== "PROHIBIT_RIGHTS") {
        return;
    }

    rightsService.prohibitRights(message.userId, message.bookmarkId).then(function () {
        sendResponse(true);
    }).catch(function (e) {
        sendResponse({error:  e});
    });
    return true;
});
