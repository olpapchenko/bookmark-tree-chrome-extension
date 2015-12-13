angular.module("app").directive("bookmarks", function () {
    return {
        restrict: "E",
        scope: {
            bookmarks: "="
        },
        templateUrl: "/html/templates/bookmarks.html"
    }
});