 bookmarkRenderer = {
     renderBookmark: function (bookmark) {
         var _this = this;

         preferencesService.get(preferencesService.MARKS_ENABLED).then(function (preference) {
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
             var time = 200;

             allEntities.sort(compare).forEach(function (entity) {
                 if(entity.type == "markers")  {
                     setTimeout(function () {
                         if(!preference[preferencesService.MARKS_ENABLED].value){
                             return;
                         }
                         _this.renderMarker(entity, bookmark.isOwner);
                     }, time);
                     time += 200;
                 } else if(entity.type == "comments") {
                     setTimeout(function () {
                         if(!preference[preferencesService.COMMENTS_ENABLED].value){
                             return;
                         }
                         _this.renderComment(entity, bookmark.isOwner);
                     }, time);
                     time += 200;
                 } else if (entity.type == "links") {
                     setTimeout(function () {
                         if(!preference[preferencesService.BOOKMARK_LINKS_ENABLED].value){
                             return;
                         }
                         _this.renderLink(entity, bookmark.isOwner);
                     }, time);
                     time += 200;
                 }
             });
         });

     },

     reconcileBookmark: function (bookmark) {
         bookmark.markers.forEach(function (marker) {
             markController.reconcileMarker(marker);
         })
     },

     renderMarker: function (marker, isOwner) {
        markController.renderMarker(marker, isOwner);
     },

     renderLink: function (link, isOwner) {
        linkController.renderLink(link, isOwner);
     },

     renderComment: function (comment, isOwner) {
        commentController.renderComment(comment, isOwner);
     }
 }