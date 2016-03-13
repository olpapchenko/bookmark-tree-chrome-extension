function LinkController() {
    this.getBodyMarkUp = function (linkId) {
        var LINK_MARK_UP = "<div class='linkWrapper'><div class='commentContainer'>" +
            "<img src=" + chrome.extension.getURL("/images/bookmark.png") + ">" +
            "<input type='text' class='link-header'>" +
            "<div class='.completions-container'></div>" +
            "<hr/>"+
            "<span href='#' class='link'>Link to he </span>"
            "</div>" +
            "</div>";
        return LINK_MARK_UP;
    }

    this.getCommentOffsetTop = function () {
        return 70;
    }

    this.getCommentOffsetLeft = function () {
        return 0;
    },

    this.renderLink = function (link) {
        this.renderEntity(link);
    }

    this.persistEntity = function (link) {
        Bookmark.addLink(link);
    }

    this.removeEntityFromPersistanceStore = function (linkId, isNew) {
        Bookmark.removeLinkById(linkId, isNew);
    }

    this.initializeEntity = function (entity, classId) {
        var linkHeader = $("." + classId + " .link-header");
        var link = $("." + classId + " .link");

        linkHeader.val(entity.header);
        link.text(entity.link);

        linkHeader.on("blur", function () {
            Bookmark.updateLinkHeader(entity.commentId, this.val());
        });

        linkHeader.on("change", function () {
            var entry = "<div class='bookmark-link-completions' </div>";
            var results = [];

           bookmarkService.getBookmarkByHeaderOrTag(this.val()).then(function (bookmarks) {
                bookmarks.forEach(function (bookmark) {
                    var bookmarkEntry = $(entry);
                    bookmarkEntry.text(bookmark.header);
                    bookmarkEntry.attr("header", bookmark.header);
                    bookmarkEntry.attr("link", bookmark.link);

                    bookmarkEntry.on("click", function () {
                        linkHeader.val(this.attr("header"));
                        link.text(this.attr("link"));
                    });
                    results.push(bookmarkEntry);
                });

               if(results) {
                    var completions = $("." + classId + " .completions-container");
                    results.forEach(function (result) {
                        completions.appendChild(result);
                    });

                   completions.appendChild(completions);
               }
           });
        });

        link.on("dblclick", function () {
            this.contentEditable = true;
        });

        link.on("blur", function () {
            Bookmark.updateLink(entity.commentId, this.text());
        })

        $(".class ").on("click")
    }
}

LinkController.prototype = commentProto;
