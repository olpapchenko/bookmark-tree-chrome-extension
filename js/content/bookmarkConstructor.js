var commentController = new CommentController(),
    linkController = new LinkController(),
    EDIT_MODE_POPUP_HTML  = "<div class='bookmark_tree_instructions' class='extensionText'>You are at the edit mode, to exit press ESC.</div>";

bookmarkConstructor = {
        editMode: false,
        createEditModeInstructionPopup: function createEditModeInstructionPopup() {
            if(this.editMode) {
                return;
            }

            this.editMode = true;

            var HIDE_POPUP_TIMEOUT = 5000;
            function hidePopup() {
                var popups = Array.prototype.slice.apply(document.getElementsByClassName("bookmark_tree_instructions"));
                popups.forEach(function (popup) {
                    popup.className += " transperent";
                });
            }

            var element = document.createElement("div");
            element.innerHTML = EDIT_MODE_POPUP_HTML,
                removeSign = document.createElement("div");

            removeSign.className = "removeContainer";
            removeSign.style.background = "url('" + chrome.extension.getURL("/images/cross.png") +"') no-repeat";
            removeSign.style.backgroundSize = "10px";

            removeSign.addEventListener("click", function () {
                hidePopup();
            });

            element.childNodes[0].appendChild(removeSign);
            document.body.appendChild(element);
            setTimeout(function () {
                hidePopup();
            }, HIDE_POPUP_TIMEOUT);
        },

        startMarkerCreationMode: function () {
            this.markerCreationMode = true;
            this.createEditModeInstructionPopup();
            document.body.style.cursor = "url(" +  chrome.extension.getURL('/images/mark.png') + ") 0 26, auto";
            markController.markSelection(document.getSelection());
        },

        endMarkerCreationMode: function () {
            this.markerCreationMode = false;
        },

        startLinkCreationMode: function () {
            this.linkCreationMode = true;
            this.createEditModeInstructionPopup();
            document.body.style.cursor = "url(" +  chrome.extension.getURL('/images/bookmark.png') + ") 0 26, auto";
        },

        endLinkCreationMode: function () {
            this.linkCreationMode = false;
        },

        startCommentCreationMode: function () {
            this.commentCreationMode = true;
            this.createEditModeInstructionPopup();
            document.body.style.cursor = "url(" +  chrome.extension.getURL('/images/comment.png') + ") 0 26, auto";
        },

        endCommentCreationMode: function () {
            this.commentCreationMode = false;
        },

        startMarkerCreationModeTracker: function () {
            _this = this;

            document.body.addEventListener('mouseup', function () {
                if(_this.markerCreationMode) {
                    markController.markSelection(document.getSelection());
                }
            });
        },

        startLinkModeTracker: function () {
            _this = this;

            document.body.addEventListener("click", function (event) {
                if(!event.target || !_this.linkCreationMode) {
                    return;
                }

                linkController.processSelection(document.getSelection());
            });
        },

        startCommentModeTracker: function () {
            _this = this;

            document.body.addEventListener("click", function (event) {
                if(!event.target || !_this.commentCreationMode) {
                    return;
                }

                commentController.processSelection(document.getSelection());
            });
        }
}

bookmarkConstructor.startMarkerCreationModeTracker();
bookmarkConstructor.startLinkModeTracker();
bookmarkConstructor.startCommentModeTracker();

document.body.addEventListener("keyup", function (e) {
    document.body.style.cursor = "auto";
    bookmarkConstructor.editMode = false;
    bookmarkConstructor.endCommentCreationMode();
    bookmarkConstructor.endLinkCreationMode();
    bookmarkConstructor.endMarkerCreationMode();
});