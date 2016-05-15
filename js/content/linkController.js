function LinkController() {
    var link2NodeList = [];

    this.getBodyMarkUp = function (linkId) {
        var LINK_MARK_UP = "<div class='linkWrapper'><div class='commentContainer'>" +
            "<img src=" + chrome.extension.getURL("/images/bookmark.png") + ">" +
            "<input placeholder='Name' type='text' class='link-header bookmark-tree-control'>" +
            "<input placeholder='Link URL' type='text' class='link bookmark-tree-control'>" +
            "<div class='.completions-container'></div>" +
            "<hr/>"+
            "<a href='#' target='_blank' class='click-link'>Click me</a>"
            "</div>" +
            "</div>";
        return LINK_MARK_UP;
    }

    this.getCommentOffsetTop = function () {
        return 120;
    }

    this.getEntity2NodesList = function () {
        return link2NodeList;
    }

    this.getCommentOffsetLeft = function () {
        return 0;
    },

    this.renderLink = function (link, isOwner) {
        this.renderEntity(link, isOwner);
    }

    this.persistEntity = function (link, isOwner) {
        Bookmark.addLink(link,isOwner);
    }

    this.removeEntityFromPersistanceStore = function (linkId, isNew) {
        Bookmark.removeLinkById(linkId, isNew);
    }

    this.reconcileInnerHtml = function () {

    }

    this.updateEntityAtPersistStore = function (newLink) {
        Bookmark.updateLinkId(newLink);
    }

    this.initializeEntity = function (entity, classId) {
        'use strict'
        var linkId = this.getCommentContainerId(entity.id);
        var linkHeader = $("#" + linkId + " .link-header");
        var link = $("#" + linkId + " .link");
        var clickLink = $("#" + linkId + " a");

        linkHeader.val(entity.header);
        link.val(entity.link);
        if(entity.link && !entity.link.startsWith("http")) {
            entity.link = "http://" + entity.link;
        }
        clickLink.attr("href", entity.link);

        linkHeader.on("blur", function (event) {
            Bookmark.updateLinkHeader(entity.id, event.target.value);
        });

        link.on("blur", function (event) {
            Bookmark.updateLink(entity.id, event.target.value);
        });

        //linkHeader.on("change", function () {
        //    var entry = "<div class='bookmark-link-completions' </div>";
        //    var results = [];
        //
        //   bookmarkService.getBookmarkByHeaderOrTag(this.val()).then(function (bookmarks) {
        //        bookmarks.forEach(function (bookmark) {
        //            var bookmarkEntry = $(entry);
        //            bookmarkEntry.text(bookmark.header);
        //            bookmarkEntry.attr("header", bookmark.header);
        //            bookmarkEntry.attr("link", bookmark.link);
        //
        //            bookmarkEntry.on("click", function () {
        //                linkHeader.val(this.attr("header"));
        //                link.text(this.attr("link"));
        //            });
        //            results.push(bookmarkEntry);
        //        });
        //
        //       if(results) {
        //            var completions = $("." + classId + " .completions-container");
        //            results.forEach(function (result) {
        //                completions.appendChild(result);
        //            });
        //
        //           completions.appendChild(completions);
        //       }
        //   });
        //});
    }
}

LinkController.prototype = commentProto;
