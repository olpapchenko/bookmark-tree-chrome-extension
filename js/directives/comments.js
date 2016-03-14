angular.module("app").directive("comments",["bookmarkService", function (bookmarkService) {
    return {
        restrict: "E",
        templateUrl: "/html/templates/comments.html",
        link: function ($scope) {
            bookmarkService.getCurrentBookmark().then(function(bookmark){
                $scope.$apply(function () {
                    console.log(bookmark);
                    $scope.bookmark = bookmark;
                });
            });

            $scope.removeCommentById = function (id) {
                bookmarkService.removeCommentById(id);
                setTimeout(function () {
                    bookmarkService.getCurrentBookmark().then(function(bookmark){
                        $scope.$apply(function () {
                            console.log(bookmark);
                            $scope.bookmark = bookmark;
                        });
                    });
                }, 100);
            }
        }
    }
}]);