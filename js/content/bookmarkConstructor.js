var commentController = new CommentController(),
    linkController = new LinkController(),
    EDIT_MODE_POPUP_HTML  = "<div  class='extensionText'>You are at the edit mode, to exit press ESC.</div>";
    RELOAD_PAGE_HTML  = "<div  class='extensionText'>Before editing you must reload page.</div>";

bookmarkConstructor = {
        editMode: false,
        createEditModeInstructionPopup: function createEditModeInstructionPopup() {
            popUpController.createPopup(EDIT_MODE_POPUP_HTML, popUpController.INFO);
        },

        createReloadPagePopup: function () {
            popUpController.createPopup(RELOAD_PAGE_HTML, popUpController.DANGER);
        },

        startMarkerCreationMode: function () {
            if(Bookmark.pageShouldBeReloaded) {
                this.createReloadPagePopup();
                return;
            }

            this.markerCreationMode = true;
            this.createEditModeInstructionPopup();
            document.body.style.cursor = "url(" +  chrome.extension.getURL('/images/mark.png') + ") 0 26, auto";
            markController.markSelection(document.getSelection());
        },

        endMarkerCreationMode: function () {
            this.markerCreationMode = false;
        },

        startLinkCreationMode: function () {
            if(Bookmark.pageShouldBeReloaded) {
                this.createReloadPagePopup();
                return;
            }
            this.linkCreationMode = true;
            this.createEditModeInstructionPopup();
            document.body.style.cursor = "url(" +  chrome.extension.getURL('/images/bookmark.png') + ") 0 26, auto";
        },

        endLinkCreationMode: function () {
            this.linkCreationMode = false;
        },

        startCommentCreationMode: function () {
            if(Bookmark.pageShouldBeReloaded) {
                this.createReloadPagePopup();
                return;
            }
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
