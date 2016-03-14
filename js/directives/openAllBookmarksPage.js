angular.module("app").directive("allBookmarksPage", ["bookmarkService", function (bookmarkService) {
    return {
        restrict: "E",
        template: "<button ng-click='path()' style='width: 100%; margin-bottom: 20px;'' class='btn btn-success media'>View all bookmarks</button>",
        link: function (scope, attrs) {
            scope.path = bookmarkService.openMainPage;
        }
    }
}]);