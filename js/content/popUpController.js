popUpController = {
    DANGER: "popup_danger",
    INFO: "popup_info",

    createPopup: function createEditModeInstructionPopup(innerHtml, type) {
        type = type || this.INFO;

        var HIDE_POPUP_TIMEOUT = 5000;

        function hidePopup(element) {
            element.className = " transperent";
        }

        var container = document.createElement("div"),
            root = container.createShadowRoot();

        root.innerHTML = this.getStyles() + this.getHtml(innerHtml, type);

        root.querySelector(".removeContainer").addEventListener("click", function () {
            hidePopup(root.querySelector(".popup"));
        });

        document.body.appendChild(container);

        setTimeout(function () {
            hidePopup(root.querySelector(".popup"));
        }, HIDE_POPUP_TIMEOUT);
    },

    getHtml: function (innerHtml, type) {
        var popupClass =  type == this.DANGER ? this.DANGER : this.INFO;

        return `<div class="popup ${popupClass}">
                    ${innerHtml}
                    <div class="removeContainer" style="background: url('${chrome.extension.getURL("/images/cross.png")}') no-repeat; background-size: 10px;"></div>
                </div>`;
    },

    getStyles: function () {
        return `<style>
            .extensionText {
                font-family: Arial;
                font-weight: normal;
                font-size: 13px;
            }
            .removeContainer {
                position: absolute;
                height: 25px;
                width: 25px;
                z-index: 10000;
                opacity: 0.7;
                display: none;
                cursor: pointer;
             }
             .popup_info {
                color: #8a6d3b;
                background-color: #fcf8e3;
                border-color: #faebcc;
            }

            .popup_danger {
                color: #c81815;
                background-color: #F3ABA0;
                border-color: #fa2d1d
            }

            .popup {
                transition: all 0.3s ease-out 0.5s;
                z-index: 10000;
                position: fixed;
                margin-left: 30%;
                text-align: center;
                top: 20px;
                width: 40%;
                padding: 15px;
                border: 1px solid transparent;
                border-radius: 4px;
            }

            .popup .removeContainer {
                top: 10px;
                right: 10px;
                height: 10px;
                width: 10px;
                display: block;
            }
            .transperent {
               opacity: 0;
            }</style>`;
    }
};