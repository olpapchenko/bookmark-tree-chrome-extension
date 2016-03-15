angular.module("app").service("rightsService", function () {
    var background = chrome.extension.getBackgroundPage().rightsService;

    this.grantOwnership =  background.grantOwnership;
    this.grantObserver = background.grantObserver;
    this.makePublic = background.makePublic;
    this.prohibitRights = background.prohibitRights;
});