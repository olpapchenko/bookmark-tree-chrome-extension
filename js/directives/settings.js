angular.module("app").directive("settings", ["preferencesService", function (preferencesService) {
    return {
        restrict: "E",
        templateUrl: "/html/templates/settings.html",
        link: function (scope, iElement, attr) {
            preferencesService.get("preferences").then(function (preferences) {
                scope.preferences = preferences;
            });

            scope.savePreferences = function () {
                preferencesService.set("preferences", scope.preferences);
            }
        }
    }
}]);