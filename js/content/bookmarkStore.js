function BookmarkClass () {
    var MARKERS = 'markers',
        COMMENTS = 'comments',
        LINKS = 'links';
    var _this = this;

    this.name = document.title;
    this.url = document.location.href;
    this.maxOrder = 0;
    this.isOwner = true;

    this.pageShouldBeReloaded = false;

    branchService.getDefault().then(function (defaultBranch) {
        this.branch_id = defaultBranch.id;
    })

    function addEntity(entityName, entity) {
        entity.order = ++_this.maxOrder;
        _this[entityName].push(entity);

        chrome.runtime.sendMessage({type: "SET_BADGE", text: getAllEntitiesCount()}, null, function (message) {
            if(message && message.error){
                console.log(message.error);
            }
        });
    }

    function getAllEntitiesCount() {
        return getDisplayebleEntities(MARKERS).length +
            getDisplayebleEntities(LINKS).length +
            getDisplayebleEntities(COMMENTS).length
    }

    function getDisplayebleEntities(entityName) {
        return _this[entityName].filter(function (entity) {
            return entity.display;
        })
    }

    function removeEntityById(entityName, id) {
        'use strict'
        var index = _this[entityName].findIndex(function (entity) {
            return entity.id == id || entity.tempId == id;
        });
        _this[entityName][index].display = false;

        var text = getAllEntitiesCount();
        text = _this.persisted && text == 0 ? "+" : text;

        chrome.runtime.sendMessage({type: "SET_BADGE", text: text}, null, function (message) {
            if(message && message.error){
                console.log(message.error);
            }
        });
    }

    function updateEntityId(entity, newEntity) {
        var comparator = entity == MARKERS ? markerComparator : commentComparator;

        var entities = _this[entity].filter(function (oldEntity) {
            return comparator.equals(newEntity, oldEntity);
        });

        if(entities.length == 0) {
            console.log("marker for ID update is not found");
            return;
        } else {
            var entity = entities[0];
        }

        entity.id = newEntity.id;
    }

    function getMaxOrderOfEntity() {
        var entities = _this[MARKERS].concat(_this[COMMENTS]).concat(_this[LINKS]);
        return entities.reduce(function (max, entity) {
            return max > entity.order ? max : entity.order;
        }, 0);
    }

    function clearRights(id) {
        var indexObservers = _this.observers.findIndex(function (observer) {
            return observer.id == id;
        });

        var indexOwners = _this.owners.findIndex(function (owner) {
            return owner.id == id;
        });

        if(indexObservers >= 0) {
            _this.observers.splice(indexObservers, 1);
        }

        if(indexOwners >= 0) {
            _this.owners.splice(indexOwners, 1);
        }
    }

    BookmarkClass.prototype.updateMarkerId = function (newMarker) {
        updateEntityId(MARKERS, newMarker);
    }

    BookmarkClass.prototype.updateCommentId = function (newComment) {
        updateEntityId(COMMENTS, newComment)
    }

    BookmarkClass.prototype.updateLinkId = function (newLink) {
        updateEntityId(LINKS, newLink);
    }


    BookmarkClass.prototype.setName = function (name) {
        this.name = name;
    }

    BookmarkClass.prototype.setBranch = function (branch) {
        this.branch_id = branch;
    }

    BookmarkClass.prototype.addMarker = function (marker) {
        addEntity(MARKERS, marker);
    }

    BookmarkClass.prototype.addLink = function (marker) {
        addEntity(LINKS, marker);
    }

    BookmarkClass.prototype.addComment = function (marker) {
        addEntity(COMMENTS, marker);
    }

    BookmarkClass.prototype.removeMarkerById = function (id) {
        removeEntityById(MARKERS, id);
    }

    BookmarkClass.prototype.removeCommentById = function (id) {
        removeEntityById(COMMENTS, id);
    }

    BookmarkClass.prototype.removeLinkById = function (id) {
        removeEntityById(LINKS, id);
    };

    BookmarkClass.prototype.updateCommentText = function (commentId, newValue) {
        var comment = this[COMMENTS].find(function (comment) {
            return comment.id == commentId || comment.tempId == commentId;
        });

        if(comment) {
            comment.text = newValue;
        }
    }

    BookmarkClass.prototype.updateLinkHeader = function (linkId, newHeader) {
        var link = this[LINKS].find(function (link) {
            return link.id == linkId || link.tempId == linkId;
        });

        if(link) {
            link.header = newHeader;
        }
    }

    BookmarkClass.prototype.updateLink = function (linkId, newLink) {
        var link = this[LINKS].find(function (link) {
            return link.id == linkId || link.tempId == linkId;
        });

        if(link) {
            link.link = newLink;
        }
    }

    BookmarkClass.prototype.addOwner = function (id) {
        clearRights(id);
        this.owners.push({id: id});
    }

    BookmarkClass.prototype.addObserver = function (id) {
        clearRights(id);
        this.observers.push({id: id});
    }

    BookmarkClass.prototype.removeRights = function (id) {
        clearRights(id);
    }

    BookmarkClass.prototype.getBookmark = function (forBackEnd) {
         var bookmark =  {
            persisted: this.persisted,
            id: this.id,
            branch_id: this.branch_id,
            name: this.name,
            url: this.url,
            markers: this.markers.map(function (marker) {var omit = ["type", "text"]; if(forBackEnd) {omit = omit.concat(["isNew", "tempId"]);} return _.omit(marker, omit)}),
            links: this.links.map(function (links) {var omit = ["type"]; if(forBackEnd) {omit =omit.concat(["isNew", "tempId"]);} return _.omit(links, omit)}),
            comments: this.comments.map(function (comments) {var omit = ["type"]; if(forBackEnd) {omit =omit.concat(["isNew", "tempId"]);} return _.omit(comments, omit)}),
            owners: this.owners,
            observers: this.observers,
            isOwner: this.isOwner
         }
        if(!forBackEnd) {
            bookmark.markers = bookmark.markers.map(function (marker) {
                marker.text = findTextNodeAtPosition($(marker.startContainerSelector)[0], marker.startTextNodePosition).textContent;
                return marker;
            });
        }
        return bookmark;
    }
    
    BookmarkClass.prototype.construct = function (bookmark) {
        this.persisted = true;
        this.id = bookmark.id;
        this.branch_id = bookmark.branch_id;
        this.name = bookmark.name;
        this.markers = bookmark.markers;
        this.comments = bookmark.comments;
        this.links = bookmark.links;
        this.maxOrder = getMaxOrderOfEntity();
        this.branch_id = bookmark.branch_id;
        this.isOwner = bookmark.isOwner;
        this.owners = bookmark.owners;
        this.observers = bookmark.observers;
    }

    this[MARKERS] = [];
    this[COMMENTS] = [];
    this[LINKS] = [];
}

Bookmark = new BookmarkClass();
//function BookmarkClassStore () {
//    var _this = this;
//    var MARKERS = 'markers',
//        COMMENTS = 'comments',
//        LINKS = 'links';
//
//    function addEntity (entityName, entity) {
//        var BookmarkClass = _this.getBookmarkClassByTabIdOrCreate(entity.tabId);
//        BookmarkClass[entityName].push(entity);
//    }
//
//    function removeEntityById(entityName, entity) {
//        var BookmarkClass = _this.getBookmarkClassByTabId(entity.tabId);
//        BookmarkClass['remove' + _(entityName).capitalize() + 'ById'].apply(BookmarkClass, entity.id);
//    }
//
//    this.BookmarkClasss = [];
//
//    BookmarkClassStore.prototype.getBookmarkClassByTabId = function (tabId) {
//        var indexOf = this.BookmarkClass.indexOf(function (BookmarkClass) {
//            return BookmarkClass.tabId == tabId;
//        })
//        if(indexOf == -1) {
//            return null
//        } else {
//            return this.BookmarkClasss[indexOf];
//        }
//    }
//
//    BookmarkClassStore.prototype.getBookmarkClassByTabIdOrCreate = function (tabId) {
//        var BookmarkClass = this.getBookmarkClassByTabId(tabId);
//        if(!BookmarkClass) {
//            var BookmarkClass = new BookmarkClass(tabId);
//            this.BookmarkClasss.push(BookmarkClass);
//        }
//
//        return BookmarkClass;
//    }
//
//    BookmarkClass.prototype.addMarker = function (marker) {
//        addEntity(MARKERS, marker);
//    }
//
//    BookmarkClass.prototype.removeMarkById = function (marker) {
//        removeEntityById(MARKERS, marker);
//    };
//
//    BookmarkClass.prototype.addBookmarkClassLink = function (marker) {
//        addEntity(LINKS, marker);
//    }
//
//    BookmarkClass.prototype.removeBookmarkClassLinkById = function (marker) {
//        removeEntityById(LINKS, marker);
//    };
//
//    BookmarkClass.prototype.addComment = function (marker) {
//        addEntity(COMMENTS, marker);
//    }
//
//    BookmarkClass.prototype.removeCommentById = function (marker) {
//        removeEntityById(COMMENTS, marker);
//    };
//}


