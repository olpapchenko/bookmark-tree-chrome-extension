var START_TERMINATOR = '$',
    END_TERMINATOR = '^';

var markModeEnabled = false;

function insertAtPosition(idx, string, insertString) {
    return string.slice(0, idx) + insertString + string.slice(idx);
}

function enable(flag) {
    markModeEnabled = flag;
}

function markText (range) {
    var startPosition = range.startOffset,
        endPosition = range.endOffset;

    if(range.startContainer == range.endContainer) {
        if(endPosition - startPosition == 0 ) {
            return;
        }
        endPosition++;
    }

    range.startContainer.textContent = insertAtPosition(startPosition, range.startContainer.textContent, '^');
    range.endContainer.textContent = insertAtPosition(endPosition, range.endContainer.textContent, '$');
    var html = document.body.innerHTML;
    document.body.innerHTML = html.replace("^", "<marker style='color: red'>").replace("$", "</marker>");
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