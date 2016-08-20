 bookmarkRenderer = {
     renderBookmark: function (bookmark) {
         var _this = this;
         var RENDER_INTERVAL_MS = 150;

        return preferencesService.get(preferencesService.MARKS_ENABLED).then(function (preference) {
             if(!preference[preferencesService.EXTENSION_ENABLED].value) {
                 return;
             }
             var compare = function (entity1, entity2) {return entity1.order - entity2.order;}

             var entities = {
                 markers: bookmark.markers,
                 comments: bookmark.comments,
                 links: bookmark.links
             }
             var allEntities = [];

             Object.keys(entities).forEach(function (key){
                 if(!entities[key]) {
                     return;
                 }
                 var res = entities[key].map(function (entity) {
                     entity.type = key
                     return entity;
                 });

                 if(res.length > 0) {
                     allEntities =  allEntities.concat(res);
                 }
             });
             var time = 0;
             var renderPromises = [];

             allEntities.sort(compare).forEach(function (entity) {
                     var promise = new Promise(function(resolve, reject) {
                         setTimeout(function () {
                             if(entity.type == "markers") {
                                 if(!preference[preferencesService.MARKS_ENABLED].value){
                                     resolve();
                                     return;
                                 }
                                 try {
                                     return _this.renderMarker(entity, bookmark.isOwner);
                                 } catch(e) {
                                     reject(e);
                                     return;
                                 }
                                 resolve();
                             } else if (entity.type == "comments") {
                                 if(!preference[preferencesService.COMMENTS_ENABLED].value){
                                     return;
                                 }
                                 try {
                                     _this.renderComment(entity, bookmark.isOwner);
                                 } catch(e) {
                                     reject(e);
                                     return;
                                 }
                                 resolve();
                             } else if (entity.type == "links") {
                                 if(!preference[preferencesService.BOOKMARK_LINKS_ENABLED].value){
                                     return;
                                 }
                                 try {
                                     _this.renderLink(entity, bookmark.isOwner);
                                 } catch(e) {
                                     reject(e);
                                     return;
                                 }
                                 resolve();
                             }
                         }, time);
                     });
                     renderPromises.push(promise);
                     time += RENDER_INTERVAL_MS;
             });
            return Promise.all(renderPromises);
         });
     },

     reconcileBookmark: function (bookmark) {
         bookmark.markers.forEach(function (marker) {
             markController.reconcileMarker(marker);
         });

         bookmark.comments.forEach(function (comment) {
             commentController.reconcileEntity(comment);
         });

         bookmark.links.forEach(function (comment) {
             linkController.reconcileEntity(comment);
         });
     },

     renderMarker: function (marker, isOwner) {
       return markController.renderMarker(marker, isOwner);
     },

     renderLink: function (link, isOwner) {
        linkController.renderLink(link, isOwner);
     },

     renderComment: function (comment, isOwner) {
        commentController.renderComment(comment, isOwner);
     },

     removeAllFromUI: function () {
         markController.removeAllFromUI();
         linkController.removeAll();
         commentController.removeAll();
     }
 }