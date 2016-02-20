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

    this.persistEntity = function (comment, commentId) {
        comment.text = $("#value" + commentId).value();
        Bookmark.addComment(comment);
    }

    this.removeEntityFromPersistanceStore = function (commentId) {
        Bookmark.removeCommentById(commentId);
    }
}

CommentController.prototype = commentProto;
