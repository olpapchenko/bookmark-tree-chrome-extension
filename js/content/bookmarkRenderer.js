 bookmarkRenderer = {
     renderBookmark: function (bookmark) {

         var compare = function (entity1, entity2) {return entity1.order - entity2.order;}

         bookmark.markers.sort(compare).forEach(this.renderMarker);
         bookmark.comments.sort(compare).forEach(this.renderComment);
         bookmark.links.sort(compare).forEach(this.renderLink);
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