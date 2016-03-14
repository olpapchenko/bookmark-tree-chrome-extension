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
                    $scope.bookmark = bookmark;
                });
            });

            $scope.removeLinkById = function (id) {
                bookmarkService.removeLinkById(id);
                setTimeout(function () {
                    bookmarkService.getCurrentBookmark().then(function(bookmark){
                        $scope.$apply(function () {
                            $scope.bookmark = bookmark;
                        });
                    });
                }, 100);
            }
        }
    }
}]);