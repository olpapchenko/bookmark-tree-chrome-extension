angular.module("app").service("branchService", function () {
    var backgroundPageService = chrome.extension.getBackgroundPage().branchService;

    this.all = backgroundPageService.all;

    this.getBranchById = backgroundPageService.getBranchById;


});