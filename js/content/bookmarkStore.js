function Bookmark () {
    var MARKERS = 'markers',
        COMMENTS = 'comments',
        LINKS = 'links';
    var _this = this;

    this.name = document.title;
    this.url = document.location.href;
    this.maxOrder = 0;

    branchService.getDefault().then(function (defaultBranch) {
        this.branch_id = defaultBranch.id;
    })

    function addEntity(entityName, entity) {
        entity.order = ++_this.maxOrder;
        _this[entityName].push(entity);
    }

    function removeEntityById(entityName, id) {
        'use strict'
        var index = _this[entityName].findIndex(function (entity) {
            return entity.id == id || entity.tempId == id;
        });

        if(index != -1) {
            _this[entityName].splice(index);
            if(_this.id ) {
                _this.remove[entityName].push(id);
                _this.maxOrder--;
            }
        }
        console.log(_this);
    }

    function getMaxOrderOfEntity() {
        var entities = _this[MARKERS].concat(_this[COMMENTS]).concat(_this[LINKS]);
        return entities.reduce(function (max, entity) {
            return max > entity.order ? max : entity.order;
        }, 0);
    }

    Bookmark.prototype.setName = function (name) {
        this.name = name;
    }

    Bookmark.prototype.setBranch = function (branch) {
        this.branch_id = branch;
    }

    Bookmark.prototype.addMarker = function (marker) {
        addEntity(MARKERS, marker);
    }

    Bookmark.prototype.addLink = function (marker) {
        addEntity(LINKS, marker);
    }

    Bookmark.prototype.addComment = function (marker) {
        addEntity(COMMENTS, marker);
    }

    Bookmark.prototype.removeMarkerById = function (id) {
        removeEntityById(MARKERS, id);
    }

    Bookmark.prototype.removeCommentById = function (id) {
        removeEntityById(COMMENTS, id);
    }

    Bookmark.prototype.removeLinkById = function (id) {
        removeEntityById(LINKS, id);
    };

    Bookmark.prototype.updateCommentText = function (commentId, newValue) {
        var comment = this[COMMENTS].find(function (comment) {
            return comment.id == commentId || comment.tempId == commentId;
        });

        if(comment) {
            comment.text = newValue;
        }
    }

    Bookmark.prototype.updateLinkHeader = function (linkId, newHeader) {
        var link = this[LINKS].find(function (link) {
            return link.id == linkId || link.tempId == linkId;
        });

        if(link) {
            link.header = newHeader;
        }
    }

    Bookmark.prototype.updateLink = function (linkId, newLink) {
        var link = this[LINKS].find(function (link) {
            return link.id == linkId || link.tempId == linkId;
        });

        if(link) {
            link.link = newLink;
        }
    }

    Bookmark.prototype.getBookmark = function () {
        return {
            id: this.id,
            branch_id: this.branch_id,
            name: this.name,
            url: this.url,
            markers: this.markers.map(function (marker) {return _.omit(marker, "tempId")}),
            links: this.links.map(function (links) {return _.omit(links, "tempId")}),
            comments: this.comments.map(function (comment) {return _.omit(comment, "tempId")}),
            remove: this.remove
        }
    }
    
    Bookmark.prototype.construct = function (bookmark) {
        this.id = bookmark.id;
        this.branch_id = bookmark.branch_id;
        this.name = bookmark.name;
        this.markers = bookmark.markers;
        this.comments = bookmark.comments;
        this.links = bookmark.links;
        this.maxOrder = getMaxOrderOfEntity();
        this.branch_id = bookmark.branch_id;
    }

    this[MARKERS] = [];
    this[COMMENTS] = [];
    this[LINKS] = [];
    this.remove = {};

    this.remove[MARKERS] = [];
    this.remove[COMMENTS] = [];
    this.remove[LINKS] = [];
}

Bookmark = new Bookmark();
//function BookmarkStore () {
//    var _this = this;
//    var MARKERS = 'markers',
//        COMMENTS = 'comments',
//        LINKS = 'links';
//
//    function addEntity (entityName, entity) {
//        var bookmark = _this.getBookmarkByTabIdOrCreate(entity.tabId);
//        bookmark[entityName].push(entity);
//    }
//
//    function removeEntityById(entityName, entity) {
//        var bookmark = _this.getBookmarkByTabId(entity.tabId);
//        bookmark['remove' + _(entityName).capitalize() + 'ById'].apply(bookmark, entity.id);
//    }
//
//    this.bookmarks = [];
//
//    BookmarkStore.prototype.getBookmarkByTabId = function (tabId) {
//        var indexOf = this.bookmark.indexOf(function (bookmark) {
//            return bookmark.tabId == tabId;
//        })
//        if(indexOf == -1) {
//            return null
//        } else {
//            return this.bookmarks[indexOf];
//        }
//    }
//
//    BookmarkStore.prototype.getBookmarkByTabIdOrCreate = function (tabId) {
//        var bookmark = this.getBookmarkByTabId(tabId);
//        if(!bookmark) {
//            var bookmark = new Bookmark(tabId);
//            this.bookmarks.push(bookmark);
//        }
//
//        return bookmark;
//    }
//
//    Bookmark.prototype.addMarker = function (marker) {
//        addEntity(MARKERS, marker);
//    }
//
//    Bookmark.prototype.removeMarkById = function (marker) {
//        removeEntityById(MARKERS, marker);
//    };
//
//    Bookmark.prototype.addBookmarkLink = function (marker) {
//        addEntity(LINKS, marker);
//    }
//
//    Bookmark.prototype.removeBookmarkLinkById = function (marker) {
//        removeEntityById(LINKS, marker);
//    };
//
//    Bookmark.prototype.addComment = function (marker) {
//        addEntity(COMMENTS, marker);
//    }
//
//    Bookmark.prototype.removeCommentById = function (marker) {
//        removeEntityById(COMMENTS, marker);
//    };
//}


