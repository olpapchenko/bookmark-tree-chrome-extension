function CommentController() {
    var comment2NodeList = [];

    this.getBodyMarkUp = function (commentId) {
        var COMMENT_MARK_UP = `<div class='commentWrapper'>
                                    <div class='commentContainer'>
                                    <textarea name='' id='value${commentId}'  >
                                    </textarea>
                                    </div>
                                <style>
                                    .commentWrapper  {
                                        position: absolute;
                                        width: 240px;
                                        height: 120px;
                                    }
                                    ${this.getStyles()}
                                </style></div>`;
        return COMMENT_MARK_UP;
    };

    this.getEntity2NodesList = function () {
        return comment2NodeList;
    }

    this.getCommentOffsetTop = function () {
        return 136;
    }

    this.getCommentOffsetLeft = function () {
        return 0;
    }

    this.getRemoveSignOffsetTop = function () {
        return -140;
    }

    this.getRemoveSignOffsetRight = function () {
        return -25;
    }

    this.renderComment = function (comment, isOwner) {
        this.renderEntity(comment, isOwner);
    }

    this.persistEntity = function (comment) {
        comment.text = $("#value" + comment.tempId).value;
        Bookmark.addComment(comment);
    }

    this.removeEntityFromPersistanceStore = function (commentId) {
        Bookmark.removeCommentById(commentId);
    }

    this.initializeEntity = function (entity, ctxContainer) {
        var textarea = $(ctxContainer).find("#value" + entity.id);

        if(entity.text) {
            textarea.val(entity.text);
        }

        moveCursorToBeginingOnClick(textarea);

        textarea.on("keypress", function () {
            Bookmark.updateCommentText(entity.id, event.target.value);
        });
    }
    
    this.reconcileInnerHtml = function (newEntity, container) {
        $(container).find("textarea").attr("id", "value" + newEntity.id);
    }

    this.updateEntityAtPersistStore = function (newComment) {
        Bookmark.updateCommentId(newComment);
    }

    function moveCursorToBeginingOnClick(input) {
        $(input).click(function (e) {
            if(e.target.value.trim()) {
                return;
            }
            e.target.focus();
            e.target.setSelectionRange(0, 0);
        });
    }
}

CommentController.prototype = commentProto;
