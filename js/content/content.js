chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if(message.type == MESSAGE_TYPES.MARK_MODE_START) {
        bookmarkConstructor.startMarkerCreationMode();
    }

    if(message.type == MESSAGE_TYPES.MARK_SELECTION) {
        markController.markSelection(document.getSelection());
    }

    if(message.type == MESSAGE_TYPES.MARK_MODE_END) {
        bookmarkConstructor.endMarkerCreationMode();
    }

    if(message.type == MESSAGE_TYPES.COMMENT_SELECTION) {
        commentController.processSelection(document.getSelection());
    }

    if(message.type == MESSAGE_TYPES.COMMENT_MODE_START) {
        bookmarkConstructor.startCommentCreationMode();
    }

    if(message.type == MESSAGE_TYPES.COMMENT_MODE_END) {
        bookmarkConstructor.endCommentCreationMode();
    }

    if(message.type == MESSAGE_TYPES.BOOKMARK_TREE_BUILDER_SELECTION) {
        linkController.processSelection(document.getSelection());
    }

    if(message.type == MESSAGE_TYPES.BOOKMARK_TREE_BUILDER_START) {
        bookmarkConstructor.startLinkCreationMode();
    }

    if(message.type == MESSAGE_TYPES.BOOKMARK_TREE_BUILDER_END) {
        bookmarkConstructor.endLinkCreationMode();
    }
    sendResponse(true);
});


$(document).ready(function () {
    bookmarksService.getBookmarkForUrl(document.location.href).then(function(bookmark){
        if(bookmark) {
            bookmarkRenderer.renderBookmark(bookmark);
        }
    });
});

