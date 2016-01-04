var START_MARK_UP = "<span style='color: red !important; background-color: #ffff00'>",
    END_MARK_UP = "</span>";

var markModeEnabled = false,
    selectorGenerator = new CssSelectorGenerator();

String.prototype.insertAtPosition =  function insertAtPosition(idx, insertString) {
    return this.slice(0, idx) + insertString + this.slice(idx);
}

function getMarkId(markterId) {
    return "bookmarkTreeMarkId"  + markterId;
}

function getMarkerStartMarkUp (markerId) {
    return "<span style='color: red !important; background-color: #ffff00' id = '" + getMarkId(markerId) + "'>"
}

function getEndMarkUp() {
    return "</span>";
}

function enableMarker(flag) {
    markModeEnabled = flag;
}

function markTextBySelector (selectorObject) {
    markText({ startContainer: $(selectorObject.startContainer)[0],
               endContainer: $(selectorObject.endContainer)[0],
               startOffset: selectorObject.startOffset,
               endOffset: selectorObject.endOffset
    });
}

function removeMarkerFromUI(markerId) {
    removeMarker(markerId);
}

function addRemoveListener (markerId) {
    $("#" + getMarkId(markerId)).hover(function () {
        $("#" + markerId).fadeIn();
        console.log("show marker");
    }, function () {
        setTimeout(function () {
            $("#" + markerId).fadeOut();
            console.log("hide marker");
        }, 1000);
    });
}

function createRemoveSign(node, markerId) {
    var node = $(node);

    var removeContainer = document.createElement("div");
    removeContainer.className = "removeContainer";

    removeContainer.id = markerId;
    removeContainer.style.background = "url('" + chrome.extension.getURL("/images/cross.png") +"') no-repeat";
    removeContainer.style.top = node[0].offsetTop - 30;
    removeContainer.style.left = node[0].offsetLeft - 30;

    $(removeContainer).on("click", function () {
        removeMarkerFromUI(markerId);
    })

    document.body.appendChild(removeContainer);
}

function markText (range, markerId) {
    var startContainer = getFirstOfTextType(range.startContainer),
        endContainer =  getLastOfTextType(range.endContainer),
        startPosition = range.startContainer.nodeType == 3 ? range.startOffset : 0,
        endPosition = range.startContainer.nodeType == 3 ? range.endOffset : endContainer.length - 1,
        commonAncestorContainer = $(range.commonAncestorContainer);

    endPosition += getMarkerStartMarkUp(markerId).length;

    var startPositionStartContainer = startPosition;

    var baseNodeFound = false;

    forEachTextChildNode(commonAncestorContainer, function (idx, node) {
        var node = $(node)[0];

        if(startContainer[0] == endContainer[0] || /^\s+$/.test(node.textContent) || node.textContent.length == 0) {
            return;
        }

        if(baseNodeFound) {
            wrapTextNodes(node, getMarkerStartMarkUp(markerId) + getEndMarkUp());
        }

        if(node == startContainer[0]) {
            baseNodeFound = true;
        }

        if(node == endContainer[0]) {
            baseNodeFound = false;
        }
    });



    if(range.startContainer == range.endContainer) {
        if(endPosition - startPosition == 0) {
            return;
        }
        var endPositionStartContainer = endPosition;
    } else {
        endPositionStartContainer = startContainer.text().length + getMarkerStartMarkUp(markerId).length;

        var textEnd = endContainer.text().insertAtPosition(0, getMarkerStartMarkUp(markerId))
            .insertAtPosition(endPosition, getEndMarkUp());

        endContainer.replaceWith(textEnd);

    }

    var textStart = startContainer.text().insertAtPosition(startPositionStartContainer, getMarkerStartMarkUp(markerId))
        .insertAtPosition(endPositionStartContainer, getEndMarkUp());

    startContainer.replaceWith(textStart);
    addRemoveListener(markerId);

    createRemoveSign(startContainer, markerId);
}

document.body.addEventListener('mouseup', function () {
    var selection = document.getSelection(),
        range = selection.getRangeAt(0);

    if(!markModeEnabled || !selection || selection.collapsed) {
        return;
    }

    var marker = {
        startContainerSelector: selectorGenerator.getSelector(range.startContainer),
        endContainerSelector: selectorGenerator.getSelector(range.endContainer),
        commonContainer: selectorGenerator.getSelector(range.commonContainer),
        startOffset: range.startOffset,
        endOffset: range.endOffset,
        id: uuid.v1()
    }

    addMarker(marker);

    markText(range, marker.id);
});