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


