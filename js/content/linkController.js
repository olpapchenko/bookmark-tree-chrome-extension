function LinkController() {
    var link2NodeList = [];

    this.getBodyMarkUp = function (linkId) {
        var LINK_MARK_UP = `
                            <div class='linkWrapper'><div class='commentContainer'>
                                <img src="${chrome.extension.getURL("/images/bookmark.png")}">
                                <input placeholder='Name' type='text' class='link-header bookmark-tree-control'>
                                <input placeholder='Link URL' type='text' class='link bookmark-tree-control'>
                                <div class='.completions-container'></div>
                                <hr/>
                                <a href='#' target='_blank' class='click-link'>Link</a>
                                </div>
                            <style>
                                .linkWrapper {
                                    position: absolute;
                                    width: 230px;
                                    height: 100px;
                                }

                                .linkWrapper .commentContainer {
                                    height: 30%;
                                    width: 25%;
                                }

                                .linkWrapper .commentContainer img {
                                    opacity: 1;
                                    transition: all 0.3s ease-out 0.5s;
                                    margin-left: 30%;
                                    margin-top: 10%;
                                }

                                .linkWrapper .commentContainer input {
                                    transition: 0s all;
                                    margin-top: 5px;
                                    padding: 4px;
                                    width: 96%;
                                }

                                .linkWrapper .commentContainer:hover input {
                                    transition-delay: 0.5s;
                                    display: block;
                                    opacity: 1;
                                }

                                .linkWrapper .commentContainer:hover .click-link {
                                    cursor: pointer;
                                    display: block;
                                    opacity: 1;
                                }

                                .linkWrapper .commentContainer:hover hr {
                                    display: block;
                                    opacity: 1;
                                }

                                .linkWrapper .commentContainer:hover img {
                                    transition-delay: 0.5s;
                                    position: absolute;
                                    opacity: 0;
                                }
                                .linkWrapper a {
                                    transition: 0.5s all;
                                    opacity: 0;
                                }

                                .linkWrapper .commentContainer:hover a {
                                    transition-delay: 0.5s;
                                    opacity: 1;
                                    display: inline-block;
                                }
                                ${this.getStyles()}
                            </style></div>`;
        return LINK_MARK_UP;
    }

    this.getRemoveSignOffsetTop = function () {
        return -120;
    }

    this.getRemoveSignOffsetRight = function () {
        return -25;
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
        Bookmark.addLink(link, isOwner);
    }

    this.removeEntityFromPersistanceStore = function (linkId) {
        Bookmark.removeLinkById(linkId);
    }

    this.reconcileInnerHtml = function () {

    }

    this.updateEntityAtPersistStore = function (newLink) {
        Bookmark.updateLinkId(newLink);
    }

    this.initializeEntity = function (entity, ctxContainer) {
        'use strict'
        var linkId = this.getCommentContainerId(entity.id);
        var linkHeader = $(ctxContainer).find(".link-header");
        var link = $(ctxContainer).find(".link");
        var clickLink = $(ctxContainer).find("a");

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
