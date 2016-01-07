var bookmark = {
    markers: [],
    bookmarks: [],
    comments: []
};

function removeById(array, id) {
    var index = bookmark.markers.map(function (item, index) {
        if (item.id == id) {
            return index;
        }
    }).filter(isFinite);

    array.splice(index, 1);
}

function addMarker(marker) {
    bookmark.markers.push(marker);
}

function removeMarker(markerClass) {
    removeById(bookmark.markers, markerClass);
}

function addBookmarkFef(bookmark) {
    bookmark.bookmarks.push(bookmark);
}

function removeBookmarkRef(bookmarkId) {
    removeById(bookmark.bookmarks, bookmarkId);

}

function addComment (comment) {
    bookmark.comments.push(comment);
}

function removeComment(commentId) {
    removeById(bookmark.comments, commentId);
}