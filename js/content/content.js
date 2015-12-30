chrome.runtime.onMessage.addListener(function (message) {
    if(message.type == MESSAGE_TYPES.MARK_MODE_START) {
        console.log("mark");
        document.body.style.cursor = "url(/images/mark.png), auto";
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