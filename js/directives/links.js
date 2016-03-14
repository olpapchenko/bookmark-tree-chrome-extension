angular.module("app").directive("links", function () {
    return {
        restrict: "E",
        scope: {
            bookmarks: "="
        },
        templateUrl: "/html/templates/links.html"
    }
});