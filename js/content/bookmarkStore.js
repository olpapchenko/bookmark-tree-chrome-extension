function Bookmark () {
    var MARKERS = 'markers',
        COMMENTS = 'comments',
        LINKS = 'links';
    var _this = this;

    function addEntity(entityName, entity) {
        _this[entityName].push(entity);
    }

    function removeEntityById(entityName, id) {
        'use strict'
        var index = _this[entityName].findIndex(function (entity) {
            return entity.id == id;
        });
        if(index != -1) {
            _this[entityName].splice(index);
        }
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

    this[MARKERS] = [];
    this[COMMENTS] = [];
    this[LINKS] = [];
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


