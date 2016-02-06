angular.module("app").service("bookmarkService", function () {
   this.get = function () {
       return chrome.extension.getBackgroundPage().bookmarkService.get();
   }

    this.save = function (bookmark) {
        return chrome.extension.getBackgroundPage().bookmarkService.save(bookmark);
    }

    this.getRights = function () {
        return chrome.extension.getBackgroundPage().bookmarkService.getRights();
    }

    this.setRights = function (rights) {
        return chrome.extension.getBackgroundPage().bookmarkService.setRights(rights);
    }
});