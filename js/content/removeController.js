function addRemoveListener (removeSignId, entityClass) {
    $("." + entityClass).hover(function () {
        $("#" + removeSignId).fadeIn();
    }, function () {
        setTimeout(function () {
            if(!$("#" + removeSignId).is(":hover")) {
                $("#" + removeSignId).fadeOut();
            }
        }, 1000);
    });
}

function createRemoveSign(contextContainer, removeSignId, entityClass, removeCallback) {
    var node = $(contextContainer);

    var removeContainer = document.createElement("div");
    removeContainer.className = "removeContainer";

    removeContainer.id = removeSignId;
    removeContainer.style.background = "url('" + chrome.extension.getURL("/images/cross.png") +"') no-repeat";
    removeContainer.style.top = getElementDistance(node[0], true) - 20 + "px";
    removeContainer.style.left = getElementDistance(node[0], false) - 20  + "px";

    $(removeContainer).hover(function () {
    }, function () {
        $("#" + removeSignId).fadeOut();
    });

    $(removeContainer).on("click", function () {removeCallback(entityClass)});

    document.body.appendChild(removeContainer);
}