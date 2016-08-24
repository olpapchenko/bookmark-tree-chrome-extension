angular.module("app").directive("edit", ["bookmarkService", "branchService", "$timeout", function (bookmarkService, branchService, $timeout) {
    return {
        restrict: "E",
        templateUrl: "/html/templates/edit.html",
        link: function (scope, attrs, element) {

            var switchMode = function (activeMode) {
                getActiveTab(function (tab) {
                    chrome.tabs.sendMessage(tab[0].id,
                        {type: MESSAGE_TYPES.COMMENT_MODE_START == activeMode ? MESSAGE_TYPES.COMMENT_MODE_START : MESSAGE_TYPES.COMMENT_MODE_END},
                        null,
                        function () {
                            window.close();
                        }
                    );

                    chrome.tabs.sendMessage(tab[0].id,
                        {type: MESSAGE_TYPES.BOOKMARK_TREE_BUILDER_START == activeMode ? MESSAGE_TYPES.BOOKMARK_TREE_BUILDER_START : MESSAGE_TYPES.BOOKMARK_TREE_BUILDER_END},
                        null,
                        function () {
                            window.close();
                    });

                    chrome.tabs.sendMessage(tab[0].id,
                        {type: MESSAGE_TYPES.MARK_MODE_START == activeMode ? MESSAGE_TYPES.MARK_MODE_START : MESSAGE_TYPES.MARK_MODE_END},
                        null,
                        function () {
                            window.close();
                    });

                    setTimeout(function () {
                        window.close();
                    }, 50);
                });
            };

            scope.comment = function () {
                switchMode(MESSAGE_TYPES.COMMENT_MODE_START);
            };
            
            scope.mark = function () {
                switchMode(MESSAGE_TYPES.MARK_MODE_START);
            };
            
            scope.link = function () {
                switchMode(MESSAGE_TYPES.BOOKMARK_TREE_BUILDER_START);
            }

            scope.save = function () {
                scope.spinner = true;
                bookmarkService.save().then(function () {
                    window.close();
                    scope.$apply(function () {
                        scope.spinner = false;
                        scope.isBookmarkForUrl = true;
                    });
                }, function () {
                    scope.$apply(function () {
                        scope.spinner = false;
                        scope.showSaveError = true;
                    });
                });
            }

            scope.remove = function () {
                scope.spinner = true;
                bookmarkService.remove(scope.bookmark.id).then(function ( ){
                    scope.$apply(function () {
                        window.close();
                        scope.spinner = false;
                        scope.isBookmarkForUrl = false;
                    });
                }, function (e) {
                    scope.$apply(function () {
                        scope.spinner = false;
                        scope.showRemoveError = true;
                    });
                });
            }

            bookmarkService.getCurrentBookmark().then(function(bookmark){
                scope.$apply(function () {
                    scope.bookmark = bookmark;
                    scope.branch =  bookmark &&  bookmark.branch_id && String(bookmark.branch_id);
                });
            });

            branchService.all().then(function (branches) {
                $timeout(function () {
                    scope.branches = branches;
                     if(!scope.branch) {
                        var branch = branches.filter(function (branch) {
                            return branch.default;
                        })[0];
                        scope.branch = (scope.branch || branch) && String(branch.id);
                    }
                }, 0)
            });

            scope.$watch("branch", function (id) {
                bookmarkService.updateBranch(id);
            });

            scope.$watch("bookmark.name", function (name) {
               bookmarkService.updateBookmarkName(name);
            });

            bookmarkService.getByUrl().then(function (bookmark) {
                 scope.$apply(function () {
                    scope.isBookmarkForUrl = bookmark;
                });
            });

        }
    }
}]);