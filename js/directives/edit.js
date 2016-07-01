angular.module("app").directive("edit", ["bookmarkService", "branchService", function (bookmarkService, branchService) {
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
                            console.log("response");
                            window.close();
                        }
                    );

                    chrome.tabs.sendMessage(tab[0].id,
                        {type: MESSAGE_TYPES.BOOKMARK_TREE_BUILDER_START == activeMode ? MESSAGE_TYPES.BOOKMARK_TREE_BUILDER_START : MESSAGE_TYPES.BOOKMARK_TREE_BUILDER_END},
                        null,
                        function () {
                            console.log("response");
                            window.close();
                    });

                    chrome.tabs.sendMessage(tab[0].id,
                        {type: MESSAGE_TYPES.MARK_MODE_START == activeMode ? MESSAGE_TYPES.MARK_MODE_START : MESSAGE_TYPES.MARK_MODE_END},
                        null,
                        function () {
                            console.log("response");
                            window.close();
                    });
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
                scope.$apply(function () {
                    scope.branches = branches;
                    console.log(scope.branch);
                     if(!scope.branch) {
                        var branch = branches.filter(function (branch) {
                            return branch.default;
                        })[0];
                         console.log(branch);
                        scope.branch = scope.branch || String(branch.id);
                    }
                })
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