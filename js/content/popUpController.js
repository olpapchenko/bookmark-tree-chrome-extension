popUpController = {
    DANGER: "popup_danger",
    INFO: "popup_info",

    createPopup: function createEditModeInstructionPopup(innerHtml, type) {
        type = type || this.INFO;

        var HIDE_POPUP_TIMEOUT = 5000;
        function hidePopup(element) {
            element.className = " transperent";
        }

        var element = document.createElement("div");
        element.className = "popup " +  (type == this.DANGER ? this.DANGER : this.INFO) ;
        element.innerHTML = innerHtml,
            removeSign = document.createElement("div");

        removeSign.className = "removeContainer";
        removeSign.style.background = "url('" + chrome.extension.getURL("/images/cross.png") +"') no-repeat";
        removeSign.style.backgroundSize = "10px";

        removeSign.addEventListener("click", function () {
            hidePopup();
        });

        element.childNodes[0].appendChild(removeSign);
        document.body.appendChild(element);
        setTimeout(function () {
            hidePopup(element);
        }, HIDE_POPUP_TIMEOUT);
    }
}