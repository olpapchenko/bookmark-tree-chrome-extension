//wrapper for background preferences service
angular.module("app").service("preferencesService",  [function ( ) {
    this.preferencesTypes = chrome.extension.getBackgroundPage().preferencesService;

    this.get = function () {
         return chrome.extension.getBackgroundPage().preferencesService.get();
    }

    this.set = function (preferences) {
        return chrome.extension.getBackgroundPage().preferencesService.set(preferences);
    }
}]);