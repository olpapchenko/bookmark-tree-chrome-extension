var START_MARK_UP = "<span style='color: red !important; background-color: #ffff00'>",
    END_MARK_UP = "</span>";

var markModeEnabled = true;

String.prototype.insertAtPosition =  function insertAtPosition(idx, insertString) {
    return this.slice(0, idx) + insertString + this.slice(idx);
}

function enable(flag) {
    markModeEnabled = flag;
}

function markTextBySelector (selectorObject) {
    markText({ startContainer: $(selectorObject.startContainer)[0],
               endContainer: $(selectorObject.endContainer)[0],
               startOffset: selectorObject.startOffset,
               endOffset: selectorObject.endOffset
    });
}

function markText (range) {
    var startContainer = getFirstOfTextType(range.startContainer),
        endContainer =  getLastOfTextType(range.endContainer),
        startPosition = range.startContainer.nodeType == 3 ? range.startOffset : 0,
        endPosition = range.startContainer.nodeType == 3 ? range.endOffset : endContainer.length - 1,
        commonAncestorContainer = $(range.commonAncestorContainer);

    endPosition += START_MARK_UP.length;

    var startPositionStartContainer = startPosition;

    var baseNodeFound = false;

    forEachTextChildNode(commonAncestorContainer, function (idx, node) {
        var node = $(node)[0];

        console.log(node);
        if(startContainer[0] == endContainer[0] || /^\s+$/.test(node.textContent) || node.textContent.length == 0) {
            return;
        }

        if(baseNodeFound) {
            wrapTextNodes(node, START_MARK_UP + END_MARK_UP);
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
        endPositionStartContainer = startContainer.text().length + START_MARK_UP.length;

        var textEnd = endContainer.text().insertAtPosition(0, START_MARK_UP)
            .insertAtPosition(endPosition, END_MARK_UP);
        endContainer.replaceWith(textEnd);
    }

    var textStart = startContainer.text().insertAtPosition(startPositionStartContainer, START_MARK_UP)
        .insertAtPosition(endPositionStartContainer, END_MARK_UP);

    startContainer.replaceWith(textStart);
}

document.body.addEventListener('mouseup', function () {
    if(!markModeEnabled) {
        return;
    }

    var selection = document.getSelection(),
        range = selection.getRangeAt(0)

    if(!selection || selection.collapsed) {
        return;
    }

    markText(range);
});