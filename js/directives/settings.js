angular.module("app").directive("settings", ["preferencesService", function (preferencesService) {
    return {
        restrict: "E",
        templateUrl: "/html/templates/settings.html",
        link: function (scope, iElement, attr) {
            scope.preferencesTypes = preferencesService.preferencesTypes;

            preferencesService.get().then(function (preferences) {
                scope.$apply(function () {
                    scope.preferences = preferences;
                    scope.preferences[scope.preferencesTypes.REFRESH_PERIOD].value = Number(scope.preferences[scope.preferencesTypes.REFRESH_PERIOD].value);
                });
            }, function (e) {
                console.error(e);
                scope.$apply(function () {
                    scope.showErrorLoad = true;
                });
            });


            scope.savePreferences = function () {
                scope.isSavingInProgress = true;

                preferencesService.set(scope.preferences).then(function () {
                    scope.$apply(function () {
                        scope.isSavingInProgress = false;
                    });

                }, function (e) {
                    console.error(e);
                    scope.$apply(function () {
                        scope.showError = true;
                        scope.isSavingInProgress = false;
                    });
                });
            }
        }
    }
}]);