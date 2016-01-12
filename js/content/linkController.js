function LinkController() {
    CommentControllerBase.apply(this, arguments);
    this.getBodyMarkUp = function () {
        var LINK_MARK_UP = "";
        return LINK_MARK_UP;
    }
}

LinkController.prototype = commentProto;
