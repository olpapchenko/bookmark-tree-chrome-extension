function CommentController() {
    CommentControllerBase.apply(this, arguments);
    this.getBodyMarkUp = function () {
        var COMMENT_MARK_UP = "<div class='commentWrapper'><div class='commentContainer'><textarea name='' id=''  ></textarea></div></div>";
        return COMMENT_MARK_UP;
    };

    this.getCommentOffsetTop = function () {
        return 136;
    }

    this.getCommentOffsetLeft = function () {
        return 0;
    }

}

CommentController.prototype = commentProto;
