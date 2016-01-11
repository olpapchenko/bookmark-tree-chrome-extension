var COMMENT_MARK_UP = "<div class='commentWrapper'><div class='commentContainer'><textarea name='' id=''  ></textarea> </div></div>";

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
    return "bookmarkTreeCommentContextNode" + id;
}

function getCommentContainerId(id) {
    return "bookmarkTreeCommentContainer" + id;
}

function createCommentContainer(contextNode, commentId) {
    var COMMENT_POSITION_OFFSET_TOP = 136,
        COMMENT_POSITION_OFFSET_LEFT = 0;

    var commentElement = $(COMMENT_MARK_UP)[0];

    commentElement.id = commentId;

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

    if(range.startContainer.nodeType != 3) {
        return;
    }

    var contextContainerHTML = wrapWordUnderIdx(range.startContainer.textContent, getContextWrapHTMLStart(getContextNodeId(commentId)), getContextWrapHTMLEnd(), range.startOffset);
    $(range.startContainer).replaceWith(contextContainerHTML);

    var comment = {
        contextElement: selectorGenerator.getSelector(range.startContainer),
        id: commentId
    };

    createCommentContainer($("#" + getContextNodeId(commentId))[0], getCommentContainerId(commentId));
    addRemoveListener(commentId, $("#" + getCommentContainerId(commentId)));
    createRemoveSign($("#" + getCommentContainerId(commentId)), commentId,  getCommentContainerId(commentId), function () {
        $("#" + getCommentContainerId(commentId)).remove();
        var contextNode = $("#" + getContextNodeId(commentId));
        contextNode.replaceWith(contextNode.text());
    });

});