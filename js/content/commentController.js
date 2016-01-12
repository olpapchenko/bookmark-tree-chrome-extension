function CommentController() {
    CommentControllerBase.apply(this, arguments);
    this.getBodyMarkUp = function () {
        var COMMENT_MARK_UP = "<div class='commentWrapper'><div class='commentContainer'><textarea name='' id=''  ></textarea></div></div>";
        return COMMENT_MARK_UP;
    }
}

CommentController.prototype = commentProto;
