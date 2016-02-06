angular.module("app").service("friendsService", function () {
  this.get = function () {
      return chrome.extension.getBackgroundPage().friendsService.get();
  }

  this.getNewFriendsUrl = function () {
      return  chrome.extension.getBackgroundPage().friendsService.getNewFriendsUrl();
    }
});