var commentController = new CommentController(),
    linkController = new LinkController();

chrome.runtime.onMessage.addListener(function (message) {
    if(message.type == MESSAGE_TYPES.MARK_MODE_START) {
        markCurrentSelection();
        enableMarker(true);
        document.body.style.cursor = "url(" +  chrome.extension.getURL('/images/mark.png') + ") 0 26, auto";
    }

    if(message.type == MESSAGE_TYPES.MARK_SELECTION) {
        markCurrentSelection();
    }

    if(message.type == MESSAGE_TYPES.MARK_MODE_END) {
        enableMarker(false);
    }

    if(message.type == MESSAGE_TYPES.COMMENT_SELECTION) {
        commentController.processSelection();
    }

    if(message.type == MESSAGE_TYPES.COMMENT_MODE_START) {
        document.body.style.cursor = "url(" +  chrome.extension.getURL('/images/comment.png') + ") 0 26, auto";
        commentController.enable(true);
    }

    if(message.type == MESSAGE_TYPES.COMMENT_MODE_END) {
        commentController.enable(false);
    }

    if(message.type == MESSAGE_TYPES.BOOKMARK_TREE_BUILDER_SELECTION) {
        linkController.processSelection();
    }

    if(message.type == MESSAGE_TYPES.BOOKMARK_TREE_BUILDER_START) {
        linkController.enable(true);
        document.body.style.cursor = "url(" +  chrome.extension.getURL('/images/bookmark.png') + ") 0 26, auto";
    }

    if(message.type == MESSAGE_TYPES.BOOKMARK_TREE_BUILDER_END) {
        linkController.enable(false);
    }
});

document.body.addEventListener("keyup", function (e) {
    document.body.style.cursor = "auto";
    linkController.enable(false);
    commentController.enable(false);
    enableMarker(false);
})