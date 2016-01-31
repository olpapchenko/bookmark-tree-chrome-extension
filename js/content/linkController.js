function LinkController() {
    CommentControllerBase.apply(this, arguments);
    this.getBodyMarkUp = function () {
        var LINK_MARK_UP = "<div class='linkWrapper'><div class='commentContainer'><img src=" + chrome.extension.getURL("/images/bookmark.png") + "></div></div>";
        return LINK_MARK_UP;
    }

    this.getCommentOffsetTop = function () {
        return 70;
    }

    this.getCommentOffsetLeft = function () {
        return 0;
    }
    
    this.linkSelection = function () {
        
    }
}

LinkController.prototype = commentProto;
