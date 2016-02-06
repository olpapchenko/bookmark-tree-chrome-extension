angular.module("app").service("friendsService", function () {
  this.get = function () {
      return chrome.extension.getBackgroundPage().friendsService.get();
  }
});