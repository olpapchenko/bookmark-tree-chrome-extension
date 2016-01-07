chrome.runtime.onMessage.addListener(function (message) {
    if(message.type == MESSAGE_TYPES.MARK_MODE_START) {
        markCurrentSelection();
        enableMarker(true);
        document.body.style.cursor = "url(" +  chrome.extension.getURL('/images/mark.png') + ") 0 26, auto";
    }
    console.log("message" + message.type);
    if(message.type == MESSAGE_TYPES.MARK_SELECTION) {
        markCurrentSelection();
    }

    if(message.type == MESSAGE_TYPES.MARK_MODE_END) {
        enableMarker(false);
        document.body.style.cursor = "default";
    }

    if(message.type == MESSAGE_TYPES.COMMENT_MODE_START) {
        document.body.style.cursor = "text";
    }

    if(message.type == MESSAGE_TYPES.COMMENT_MODE_END) {
        document.body.style.cursor = "default";
    }
});