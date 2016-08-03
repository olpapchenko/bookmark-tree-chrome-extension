var BOOKMARK_LOAD_ERROR = "<div class='extensionText'>Bookmark is not loaded, possibly it was removed</div>",
    NOT_MAPPED_ENTITIES = "<div class='extensionText'>Web page changed since last loading, some entities may be not displayed</div>";

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
});

function applyBookmarkOnUrl() {
    bookmarksService.getBookmarkForUrl(document.location.href).then(function(bookmark){
        if(bookmark) {
            return bookmarksService.getBookmarkById(bookmark.id);
        }
        return null;
    }).then(function (bookmark) {
        if(bookmark) {
            Bookmark.construct(bookmark);
            try {
                bookmarkRenderer.renderBookmark(bookmark);
            } catch(e) {
                popUpController.createPopup(NOT_MAPPED_ENTITIES, popUpController.DANGER)
            }
        }
    }, function (e) {
        if(e.status != 400) {
            popUpController.createPopup(BOOKMARK_LOAD_ERROR, popUpController.DANGER);
        }
    });
}

window.onhashchange = applyBookmarkOnUrl;

$(document).ready(applyBookmarkOnUrl);

