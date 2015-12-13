angular.module("app").directive("comments", function () {
    return {
        restrict: "E",
        scope: {
            comments: "="
        },
        templateUrl: "/html/templates/comments.html"
    }
});