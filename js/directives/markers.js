angular.module("app").directive("markers", ["bookmarkService", function (bookmarkService) {
    return {
        restrict: "E",
        scope: {
            bookmarks: "="
        },
        templateUrl: "/html/templates/markers.html",
        link: function ($scope) {
            bookmarkService.getCurrentBookmark().then(function(bookmark){
                $scope.$apply(function () {
                    console.log(bookmark);
                    $scope.bookmark = bookmark;
                    $scope.markers = bookmark.markers.filter(function (marker) {
                        return marker.display;
                    });
                });
            });

            $scope.removeMarkerById = function (id) {
                bookmarkService.removeMarkerById(id);
                setTimeout(function () {
                    bookmarkService.getCurrentBookmark().then(function(bookmark){
                        $scope.$apply(function () {
                            $scope.bookmark = bookmark;
                            $scope.markers = bookmark.markers.filter(function (marker) {
                                return marker.display;
                            });
                        });
                    });
                }, 100);
            }
        }
    }
}]);