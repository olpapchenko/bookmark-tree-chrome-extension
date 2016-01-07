angular.module("app").directive("edit", function () {
    return {
        restrict: "E",
        templateUrl: "/html/templates/edit.html",
        link: function (scope, attrs, element) {

            var switchMode = function (activeMode) {
                getActiveTab(function (tab) {
                    chrome.tabs.sendMessage(tab[0].id, {type: MESSAGE_TYPES.COMMENT_MODE_START == activeMode ? MESSAGE_TYPES.COMMENT_MODE_START : MESSAGE_TYPES.COMMENT_MODE_END});
                    chrome.tabs.sendMessage(tab[0].id, {type: MESSAGE_TYPES.BOOKMARK_TREE_BUILDER_START == activeMode ? MESSAGE_TYPES.BOOKMARK_TREE_BUILDER_START : MESSAGE_TYPES.BOOKMARK_TREE_BUILDER_END});
                    chrome.tabs.sendMessage(tab[0].id, {type: MESSAGE_TYPES.MARK_MODE_START == activeMode ? MESSAGE_TYPES.MARK_MODE_START : MESSAGE_TYPES.MARK_MODE_END});
                })
            };

            scope.comment = function () {
                switchMode(MESSAGE_TYPES.COMMENT_MODE_START);
            };
            
            scope.mark = function () {
                console.log("mark");
                switchMode(MESSAGE_TYPES.MARK_MODE_START);
            };
            
            scope.bookmark = function () {
                switchMode(MESSAGE_TYPES.BOOKMARK_TREE_BUILDER_START);
            }
            
        }
    }
});