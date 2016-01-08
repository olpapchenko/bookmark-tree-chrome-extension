var COMMENT_MARK_UP = "<div><textarea name='' id='' cols='27' rows='5'></textarea> </div>";

var  isCommentModeEnabled = false,
     selectorGenerator = new CssSelectorGenerator();


function enableCommentMode(flag) {
    isCommentModeEnabled = flag;
}

function getContextWrapHTMLStart(commentId) {
    return "<span id='" + commentId  + "'>"
}

function getContextWrapHTMLEnd() {
    return "</span>";
}

function getContextNodeId(id) {
    return "bookmarkTreeComment" + id;
}

function createCommentContainer(contextNode, commentId) {
    var COMMENT_POSITION_OFFSET_TOP = 133,
        COMMENT_POSITION_OFFSET_LEFT = 0;

    var commentElement = $(COMMENT_MARK_UP)[0];

    commentElement.className = "commentContainer";
    commentElement.id = commentId;

    console.log(getElementDistance(contextNode, true));

    commentElement.style.top = getElementDistance(contextNode, true) - COMMENT_POSITION_OFFSET_TOP + "px";
    commentElement.style.left = getElementDistance(contextNode, false) + COMMENT_POSITION_OFFSET_LEFT + "px";

    document.body.appendChild(commentElement);
}

document.body.addEventListener("click", function (event) {
    var selection = document.getSelection();

    if(!isCommentModeEnabled || !event.target || !selection) {
        return;
    }

    var commentId = uuid.v1(),
        range = selection.getRangeAt(0);

    console.log(range.startContainer.nodeType);
    console.log(range.startContainer);
    if(range.startContainer.nodeType != 3) {
        console.log("returns");
        return;
    }

    var contextContainerHTML = wrapWordUnderIdx(range.startContainer.textContent, getContextWrapHTMLStart(getContextNodeId(commentId)), getContextWrapHTMLEnd(), range.startOffset);
    console.log("contest " + contextContainerHTML);
    $(range.startContainer).replaceWith(contextContainerHTML);

    var comment = {
        contextElement: selectorGenerator.getSelector(range.startContainer),
        id: commentId
    };

    createCommentContainer($("#" + getContextNodeId(commentId))[0], commentId);

});