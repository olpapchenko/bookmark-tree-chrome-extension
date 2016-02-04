angular.module("app").directive("loader", function () {
    return {
        restrict: "E",
        scope: {isLoaded: "="},
        templateUrl: "/html/templates/loader.html",
        link: function (scope, attrs, element) {

        }
    }
});