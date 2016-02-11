angular.module("app").directive("colorModel", function () {
    return {
        restrict: "A",
        require: "?ngModel",
        link: function (scope, attr, element, ngModel) {
            if (!ngModel) return;

            ngModel.$render = function() {
                element.value = ngModel.$viewValue;
            };

            element.on("blur keyup change", function () {
                ngModel.$setViewValue(element.value);
            });
        }
    }
});