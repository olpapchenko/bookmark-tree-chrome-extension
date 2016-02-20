function CommentController() {
    this.getBodyMarkUp = function (commentId) {
        var COMMENT_MARK_UP = "<div class='commentWrapper'><div class='commentContainer'><textarea name='' id='value" + commentId + "'  ></textarea></div></div>";
        return COMMENT_MARK_UP;
    };

    this.getCommentOffsetTop = function () {
        return 136;
    }

    this.getCommentOffsetLeft = function () {
        return 0;
    }

    this.renderComment = function (comment) {
        this.renderEntity(comment);
    }

    this.persistEntity = function (comment) {
        comment.text = $("#value" + comment.tempId).value;
        Bookmark.addComment(comment);
    }

    this.removeEntityFromPersistanceStore = function (commentId) {
        Bookmark.removeCommentById(commentId);
    }

    this.initializeEntity = function (entity) {
        if(entity.text) {
            $("#value" + entity.commentId).value(entity.text);
        }

        $("#value" + entity.commentId).on("blur", function () {
            Bookmark.updateCommentText(entity.commentId, event.target.value);
        });
    }
}

CommentController.prototype = commentProto;
