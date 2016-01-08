var COMMENT_MARK_UP = "<div><textarea name='' id='' cols='27' rows='5'></textarea> </div>";

var  isCommentModeEnabled = false,
     selectorGenerator = new CssSelectorGenerator();


function enableCommentMode(flag) {
    isCommentModeEnabled = flag;
}

function createCommentContainer(contextNode) {
    var COMMENT_POSITION_OFFSET_TOP = 30,
        COMMENT_POSITION_OFFSET_LEFT = 50;

    var commentElement = $(COMMENT_MARK_UP)[0];

    commentElement.className = "commentContainer";

    console.log(getElementDistance(contextNode, true));

    commentElement.style.top = getElementDistance(contextNode, true) - COMMENT_POSITION_OFFSET_TOP + "px";
    commentElement.style.left = getElementDistance(contextNode, false) + COMMENT_POSITION_OFFSET_LEFT + "px";

    document.body.appendChild(commentElement);
}

document.body.addEventListener("click", function (event) {

    if(!isCommentModeEnabled || !event.target) {
        return;
    }

    var comment = {
        contextElement: selectorGenerator.getSelector(event.target)
    };

    createCommentContainer(event.target);
});