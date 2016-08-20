String.prototype.insertAtPosition =  function insertAtPosition(idx, insertString) {
    return this.slice(0, idx) + insertString + this.slice(idx);
}

String.prototype.escapeTextRange = function (start, end) {
    return this.slice(0, start) + escapeText(this.slice(start, end)) + this.slice(end);
}

function escapeText(text) {
    return $("<div></div>").text(text).html();
}

function filterTextNodes(node) {
    var node = $(node);

    if(node[0].nodeType == 3) {
        return node;
    }

    return node.contents().filter(function () {return this.nodeType == 3});
}

function forEachTextChildNode(node, callback) {
    var node = $(node);

    if(node[0].nodeType == 3) {
        callback(0, node);
        return;
    }

    node.contents().each(function (idx, child) {
        forEachTextChildNode(child, callback);
    });
}

function wrapTextNodes(node, wrapTemplate) {
    forEachTextChildNode(node, function (idx, textNode) {
        $(textNode).wrap(wrapTemplate);
    });
}

//wraps complete words
function wrapWordUnderIdx(text, wrapTextStart, wrapTextEnd, idx) {
    var startIdx = idx,
        endIdx = idx;

    while(startIdx != 0 && !/\s/.test(text[startIdx])) {
        startIdx--;
    }

    while(!/\s/.test(text[endIdx]) && endIdx == text.length) {
        endIdx++;
    }

    return  text.insertAtPosition(endIdx, wrapTextEnd).insertAtPosition(startIdx, wrapTextStart);
}

function getAllTextNodes(node) {
    var nodes = [];


    forEachTextChildNode(node, function (idx, node) {
        nodes.push(node);
    });
    return nodes;
}

function getLastOfTextType(node) {
    var nodes = getAllTextNodes(node);
    return $(nodes[nodes.length-1]);
}

function getFirstOfTextType(node) {
    var nodes = getAllTextNodes(node);
    return $(nodes[0]);
}

function getElementDistance (elem, top) {
    var location = 0;
    if (elem.offsetParent) {
        do {
            location += top ? elem.offsetTop : elem.offsetLeft;
            elem = elem.offsetParent;
        } while (elem);
    }
    return location >= 0 ? location : 0;
};

function findTextNodePosition(parent, textNode) {
    return getAllTextNodes(parent).findIndex(function (node) {
        return node[0] == textNode;
    });
}

function findTextNodeAtPosition(parent, position) {
    return getAllTextNodes(parent)[position][0];
}

function getMD5OfNode (node) {
    function normilizeText(text) {
        if(!text) {
            return text;
        }

       text = text.replace(/\s+/gi, "");
       return text.toLowerCase();
    }
    console.log(normilizeText(node.textContent));
    return md5(normilizeText(node.textContent));
}

function testMD5SumOfNode(node, expectedMD5) {
    var actualMD5 = getMD5OfNode(node);
    return expectedMD5 == actualMD5;
}
