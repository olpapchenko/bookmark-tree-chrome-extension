 bookmarkRenderer = {
     renderBookmark: function (bookmark) {
         var _this = this;
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
                    _this.renderMarker(entity);
                }, time);
                time += 200;
            } else if(entity.type == "comments") {
                setTimeout(function () {
                    _this.renderComment(entity);
                }, time);
                time += 200;
            } else if (entity.type == "links") {
                setTimeout(function () {
                    _this.renderLink(entity);
                }, time);
                time += 200;
            }
         });
     },

     renderMarker: function (marker) {
        markController.renderMarker(marker);
     },

     renderLink: function (link) {
        linkController.renderLink(link);
     },

     renderComment: function (comment) {
        commentController.renderComment(comment);
     }
 }