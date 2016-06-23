function addRemoveListener (entityElements, entityId) {
    var entityId = entityId || $(entityElements).attr("data-id");
    entityElements.hover(function () {
        $("#" + entityId).fadeIn();
    }, function () {
        setTimeout(function () {
            $("#" + entityId).fadeOut();
        }, 1000);
    });
}

function hideRemoveSign(id) {
    $("#" + id).css({display: "none"});
}

function createRemoveSign(contextContainer, removeSignId, topOffset, rightOffset, removeCallback) {
    var node = $(contextContainer);

    if(!node) {
        return;
    }

    var removeContainer = document.createElement("div");
    removeContainer.className = "removeContainer";

    removeContainer.id = removeSignId;
    removeContainer.style.background = "url('" + chrome.extension.getURL("/images/cross.png") +"') no-repeat";
    removeContainer.style.top = topOffset + getElementDistance(node[0], true)   + "px";
    removeContainer.style.left = rightOffset + getElementDistance(node[0], false)   + "px";

    $(removeContainer).attr("data-id", removeSignId);
    $(removeContainer).hover(function () {
    }, function () {
        $("#" + removeSignId).fadeOut();
    });

    $(removeContainer).on("click", function () {
        _this
        removeCallback($(removeContainer).attr("data-id"));

        //remove sign itself
        $("#" + $(removeContainer).attr("data-id")).remove();
    });

    document.body.appendChild(removeContainer);

    return removeContainer;
}