 bookmarkRenderer = {
     renderBookmark: function (bookmark) {
         bookmark.marks.forEach(this.renderMarker());
         bookmark.comments.forEach(this.renderComment);
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