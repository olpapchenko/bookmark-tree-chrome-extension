angular.module("app").directive("friends", ["friendsService", "tabsService", function (friendsService, tabsService) {
    return {
        restrict: "E",
        templateUrl: "/html/templates/friends.html",
        link: function (scope, element, attrs) {
            friendsService.get().then(function (friends) {
                scope.$apply(function () {
                   scope.friends = friends;
                });
            }, function () {
                scope.showErrorLoad = true;
            });

            scope.addNewFriends = function ()  {
                tabsService.openNewTab(friendsService.getNewFriendsUrl());
            }
        }
    }
}]);

