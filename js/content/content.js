chrome.runtime.onMessage.addListener(function (message) {
    if(message.type == MESSAGE_TYPES.MARK_MODE_START) {
        enableMarker()
        document.body.style.cursor = "url(" +  chrome.extension.getURL('/images/mark.png') + ") 0 26, auto";
    }
});

chrome.runtime.onMessage.addListener(function (message) {
    if(message.type == MESSAGE_TYPES.MARK_MODE_END) {
        document.body.style.cursor = "default";
    }
});

chrome.runtime.onMessage.addListener(function (message) {
    if(message.type == MESSAGE_TYPES.COMMENT_MODE_START) {
        document.body.style.cursor = "text";
    }
});

chrome.runtime.onMessage.addListener(function (message) {
    if(message.type == MESSAGE_TYPES.COMMENT_MODE_END) {
        document.body.style.cursor = "default";
    }
});