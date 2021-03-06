var BRANCH_KEY = "BRANCHES",
    BRANCHES_URL = "/branches";

branchService = {
    all: function () {
        return Promise.resolve($.get(chrome.runtime.getManifest().endpointUrl + BRANCHES_URL));
    },

    getBranchById: function (id) {
        'use strict'
        if(!id) {
            return this.getDefaultBranch();
        }
        return this.all().then(function (branches) {
            if(branches) {
                return branches.find(function (branch) {
                    return branch.id == id;
                });
            }
            return null;
        });
    },

    getDefaultBranch: function () {
        'use strict'
      return this.all().then(function (branches) {
          return branches.find(function (branch) {
              return branch.default;
          })
      })
    }
}


chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    'use strict'
    if(message.type !== "GET_DEFAULT_BRANCH") {
        return;
    }

    branchService.getDefaultBranch().then(function (branch) {
        sendResponse(branch);
    }).catch(function (e) {
        sendResponse({error:  e});
    });
    return true;
});