function addRemoveListener (entityElements) {
    entityElements.hover(function () {
        $("#" + $(entityElements).attr("data-id")).fadeIn();
    }, function () {
        setTimeout(function () {
            $("#" + $(entityElements).attr("data-id")).fadeOut();
        }, 1000);
    });
}

function createRemoveSign(contextContainer, removeSignId, entityClass, removeCallback) {
    var node = $(contextContainer);

    if(!node) {
        return;
    }

    var removeContainer = document.createElement("div");
    removeContainer.className = "removeContainer";

    removeContainer.id = removeSignId;
    removeContainer.style.background = "url('" + chrome.extension.getURL("/images/cross.png") +"') no-repeat";
    removeContainer.style.top = getElementDistance(node[0], true) - 20 + "px";
    removeContainer.style.left = getElementDistance(node[0], false) - 20  + "px";

    $(removeContainer).attr("data-id", removeSignId);
    $(removeContainer).hover(function () {
    }, function () {
        $("#" + removeSignId).fadeOut();
    });

    $(removeContainer).on("click", function () {
        _this
        removeCallback(entityClass, $(removeContainer).attr("data-id"));

        //remove sign itself
        $("#" + $(removeContainer).attr("data-id")).remove();
    });

    document.body.appendChild(removeContainer);

    return removeContainer;
}