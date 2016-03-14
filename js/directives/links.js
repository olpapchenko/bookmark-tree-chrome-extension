angular.module("app").directive("links", ["bookmarkService", function (bookmarkService) {
    return {
        restrict: "E",
        scope: {
            bookmarks: "="
        },
        templateUrl: "/html/templates/links.html",
        link: function ($scope) {
            bookmarkService.getCurrentBookmark().then(function(bookmark){
                $scope.$apply(function () {
                    console.log(bookmark);
                    $scope.bookmark = bookmark;
                });
            });

            $scope.removeLinkById = bookmarkService.removeLinkById;
        }
    }
}]);