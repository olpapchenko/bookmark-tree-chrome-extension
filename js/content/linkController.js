function LinkController() {
    this.getBodyMarkUp = function (linkId) {
        var LINK_MARK_UP = "<div class='linkWrapper'><div class='commentContainer'><img src=" + chrome.extension.getURL("/images/bookmark.png") + "></div></div>";
        return LINK_MARK_UP;
    }

    this.getCommentOffsetTop = function () {
        return 70;
    }

    this.getCommentOffsetLeft = function () {
        return 0;
    },

    this.renderLink = function (link) {
        this.render(link);
    }

    this.persistEntity = function (link) {
        Bookmark.addLink(link);
    }

    this.removeEntityFromPersistanceStore = function (linkId) {
        Bookmark.removeLinkById(linkId);
    }

    this.initializeEntity = function (entity) {
        
    }
}

LinkController.prototype = commentProto;
