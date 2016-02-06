angular.module("app").directive("settings", ["preferencesService", function (preferencesService) {
    return {
        restrict: "E",
        templateUrl: "/html/templates/settings.html",
        link: function (scope, iElement, attr) {
            preferencesService.get().then(function (preferences) {
                scope.$apply(function () {
                    scope.preferences = preferences;
                });
            }, function (e) {
                console.error(e);
                scope.$apply(function () {
                    scope.showErrorLoad = true;
                });
            });

            scope.preferencesTypes = preferencesService.preferencesTypes;

            scope.savePreferences = function () {
                scope.isSavingInProgress = true;

                preferencesService.set(scope.preferences).then(function () {
                    scope.$apply(function () {
                        scope.isSavingInProgress = false;
                    });

                }, function () {
                    scope.$apply(function () {
                        scope.showError = true;
                        scope.isSavingInProgress = false;
                    });
                });
            }
        }
    }
}]);