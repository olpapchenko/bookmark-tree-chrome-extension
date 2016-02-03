angular.module("app").directive("settings", ["preferencesService", function (preferencesService) {
    return {
        restrict: "E",
        templateUrl: "/html/templates/settings.html",
        link: function (scope, iElement, attr) {
            preferencesService.get().then(function (preferences) {
                scope.preferences = preferences;
                console.log(scope.preferences);
            }, function (e) {console.log(e)});

            scope.preferencesTypes = preferencesService.preferencesTypes;
             scope.savePreferences = function () {
                preferencesService.set(scope.preferences);
            }
        }
    }
}]);