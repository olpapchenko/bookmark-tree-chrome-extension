var markModeEnabled = false,
    selectorGenerator = new CssSelectorGenerator();


function getMarkClass(markterId) {
    return "bookmarkTreeMarkId"  + markterId;
}

function getMarkerStartMarkUp (markerId) {
    return "<span style='color: red !important; background-color: #ffff00' class = '" + getMarkClass(markerId) + "'>"
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

function removeMarkerFromUI(markerClass) {
    $("." + markerClass).each(function () {
        $(this).replaceWith(escapeText(this.textContent));
    });
    removeMarker(markerClass);
}

function markText (range, markerId) {
    var startContainer = getFirstOfTextType(range.startContainer),
        endContainer =  getLastOfTextType(range.endContainer),
        startContainerEscaped = escapeText(startContainer.text()),
        endContainerEscaped = escapeText(endContainer.text()),
        startPosition = range.startContainer.nodeType == 3 ? range.startOffset : 0,
        endPosition = range.startContainer.nodeType == 3 ? range.endOffset : endContainer.length - 1,
        commonAncestorContainer = $(range.commonAncestorContainer);

    endPosition += getMarkerStartMarkUp(markerId).length;

    var startPositionStartContainer = startPosition,
        baseNodeFound = false;

    console.log(startContainer[0]);
    console.log(endContainer[0]);
    forEachTextChildNode(commonAncestorContainer, function (idx, node) {
        var node = $(node)[0];

        if(startContainer[0] == endContainer[0] || /^\s+$/.test(node.textContent) || node.textContent.length == 0) {
            return;
        }

        if(baseNodeFound) {
            wrapTextNodes(node, getMarkerStartMarkUp(markerId) + getEndMarkUp());
        }

        if(node == startContainer[0]) {
            console.log("found base node");
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
        endPositionStartContainer = startContainerEscaped.length + getMarkerStartMarkUp(markerId).length;

        var textEnd = endContainerEscaped.insertAtPosition(0, getMarkerStartMarkUp(markerId))
            .insertAtPosition(endPosition, getEndMarkUp());
        endContainer.replaceWith(textEnd);
    }

    var textStart = startContainerEscaped.insertAtPosition(startPositionStartContainer, getMarkerStartMarkUp(markerId))
        .insertAtPosition(endPositionStartContainer, getEndMarkUp());

    var newStartContainer = $("<span>" + textStart + "</span>");
    startContainer.replaceWith(newStartContainer);
    addRemoveListener(markerId, getMarkClass(markerId));

    createRemoveSign(newStartContainer.find("." + getMarkClass(markerId))[0], markerId, getMarkClass(markerId), function (entityClass) {
        removeMarkerFromUI(entityClass);
    });
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
    selection.empty();
});