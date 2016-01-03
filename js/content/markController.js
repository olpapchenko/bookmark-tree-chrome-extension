var START_TERMINATOR = '$',
    END_TERMINATOR = '^',
    START_MARK_UP = "<span style='color: red !important; background-color: #ffff00'>",
    END_MARK_UP = "</span>";

var markModeEnabled = true;

function insertAtPosition(idx, string, insertString) {
    return string.slice(0, idx) + insertString + string.slice(idx);
}

function enable(flag) {
    markModeEnabled = flag;
}

function markText (range) {
    var startContainer = getFirstOfTextType(range.startContainer),
        endContainer =  getLastOfTextType(range.endContainer),
        startPosition = range.startContainer.nodeType == 3 ? range.startOffset : 0,
        endPosition = range.startContainer.nodeType == 3 ? range.endOffset : endContainer.length - 1,
        commonAncestorContainer = $(range.commonAncestorContainer);

    endPosition++;
    if(range.startContainer == range.endContainer) {
        if(endPosition - startPosition == 0) {
            return;
        }
    } else {
        endContainer[0].textContent =  insertAtPosition(0, endContainer.text(), '^');
        startContainer[0].textContent = insertAtPosition(startContainer.text().length, startContainer.text(), '$');
    }

    console.log("start container " + startContainer[0].textContent );
    console.log("end container " + endContainer[0].textContent );
    startContainer[0].textContent =  insertAtPosition(startPosition, startContainer.text(), '^');
    endContainer[0].textContent =  insertAtPosition(endPosition, endContainer.text(), '$');

    var baseNodeFound = false;

    console.log(commonAncestorContainer[0]);
    console.log(startContainer[0]);
    forEachTextChildNode(commonAncestorContainer, function (idx, node) {
        var node = $(node)[0];

        if(startContainer[0] == endContainer[0] || /^\s+$/.test(node.textContent) || node.textContent.length == 0) {
            return;
        }

        if(baseNodeFound) {
            wrapTextNodes(node, START_MARK_UP + END_MARK_UP);
        }

        if(node == startContainer[0]) {
            console.log("found node");
            baseNodeFound = true;
        }

        if(node == endContainer[0]) {
            baseNodeFound = false;
            console.log("found end;");
        }


    });

    startContainer.replaceWith(startContainer.text().replace("^", START_MARK_UP).replace("$", END_MARK_UP));
    endContainer.replaceWith(endContainer.text().replace("^", START_MARK_UP).replace("$", END_MARK_UP));
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