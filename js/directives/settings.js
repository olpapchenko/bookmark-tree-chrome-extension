angular.module("app").directive("settings", ["preferencesService", function (preferencesService) {
    return {
        restrict: "E",
        templateUrl: "/html/templates/settings.html",
        link: function (scope, iElement, attr) {
            preferencesService.get().then(function (preferences) {
                scope.preferences = preferences;
                console.log("successful load");
            }, function (e) {
                console.log("error load");
                scope.showError = true;
            });

            scope.preferencesTypes = preferencesService.preferencesTypes;
            scope.savePreferences = function () {
                scope.isSavingInProgress = true;

                preferencesService.set(scope.preferences).then(function () {
                    scope.$apply(function () {
                        scope.isSavingInProgress = false;
                    });
                    console.log("success save");

                }, function () {
                    scope.$apply(function () {
                        scope.showError = true;
                        scope.isSavingInProgress = false;
                    });
                    console.log("save error");
                });
            }
        }
    }
}]);