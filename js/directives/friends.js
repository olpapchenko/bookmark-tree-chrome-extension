angular.module("app").directive("friends", ["friendsService", "tabsService", "bookmarkService", "rightsService",
    function (friendsService, tabsService, bookmarkService, rightsService) {
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

            bookmarkService.getCurrentBookmark().then(function(bookmark){
                scope.$apply(function () {
                    scope.owners = bookmark.owners;
                    scope.observers = bookmark.observers;
                    scope.bookmarkId = bookmark.id;
                    scope.currentUserIsOwner = bookmark && bookmark.isOwner;
                });
            });

            scope.isOwner = function (id) {
                console.log(scope.owners);
                return scope.owners && scope.owners.some(function (owner) {
                    return owner.id == id;
                })
            }

            scope.isObserver = function (id) {
                return scope.observers && scope.observers.some(function (owner) {
                        return owner.id == id;
                });
            }

            scope.hasRight = function (id) {
                return scope.isObserver(id) || scope.isOwner(id);
            }

            scope.shareWithOwnership = function (userId) {
                rightsService.grantOwnership(userId, scope.bookmarkId);
            }

            scope.shareWithoutOwnership = function (userId) {
                rightsService.grantObserver(userId, scope.bookmarkId);
            }
            
            scope.removeRight = function (userId) {
                rightsService.prohibitRights(userId, scope.bookmarkId);
            }
            
            scope.makePublic = function (bookmarkId) {
                rightsService.makePublic(bookmarkId);
            }
        }
    }
}]);

