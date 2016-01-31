var commentController = new CommentController(),
    linkController = new LinkController(),
    EDIT_MODE_POPUP_HTML  = "<div id='bookmark_tree_instructions' class='extensionText'>You are at the edit mode, to exit press ESC.</div>";

function createEditModeInstructionPopup() {
    var HIDE_POPUP_TIMEOUT = 400000;
    function hidePopup() {
        console.log(document.querySelector("#bookmark_tree_instructions"));
        document.querySelector("#bookmark_tree_instructions").className = " transperent";
    }

    var element = document.createElement("div");
        element.innerHTML = EDIT_MODE_POPUP_HTML,
        removeSign = document.createElement("div");

    removeSign.className = "removeContainer";
    removeSign.style.background = "url('" + chrome.extension.getURL("/images/cross.png") +"') no-repeat";
    removeSign.style.backgroundSize = "10px";

    removeSign.addEventListener("click", function () {
        console.log("clicked");
        hidePopup();
    });

    element.childNodes[0].appendChild(removeSign);
    document.body.appendChild(element);
    setTimeout(function () {
        hidePopup();
    }, HIDE_POPUP_TIMEOUT);
}
//Listeners section
chrome.runtime.onMessage.addListener(function (message) {
    if(message.type == MESSAGE_TYPES.MARK_MODE_START) {
        createEditModeInstructionPopup();
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
        createEditModeInstructionPopup();
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
        createEditModeInstructionPopup();
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