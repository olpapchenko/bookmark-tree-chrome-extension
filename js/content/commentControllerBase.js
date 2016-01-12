var commentProto = {
    getContextWrapHTMLStart: function getContextWrapHTMLStart(commentId) {
        return "<span id='" + commentId  + "'>"
    },

    getContextWrapHTMLEnd: function getContextWrapHTMLEnd() {
        return "</span>";
    },

    getContextNodeId: function getContextNodeId(id) {
        return "bookmarkTreeCommentContextNode" + id;
    },

    getCommentContainerId: function getCommentContainerId(id) {
        return "bookmarkTreeCommentContainer" + id;
    },

    enable: function enableCommentMode(flag) {
        this.isCommentModeEnabled = flag;
    },

    createCommentContainer: function createCommentContainer(contextNode, commentId) {
        var _this = this;

        console.log(_this.getBodyMarkUp.toString());

        var commentElement = $(_this.getBodyMarkUp())[0];

        commentElement.id = commentId;

        commentElement.style.top = getElementDistance(contextNode, true) - this.getCommentOffsetTop()  + "px";
        commentElement.style.left = getElementDistance(contextNode, false) + this.getCommentOffsetLeft() + "px";

        document.body.appendChild(commentElement);
    }
}

function CommentControllerBase() {
    this.isCommentModeEnabled = false;
    this.selectorGenerator = new CssSelectorGenerator();

    var _this = this;

    document.body.addEventListener("click", function (event) {
        var selection = document.getSelection();

        if(!_this.isCommentModeEnabled || !event.target || !selection) {
            return;
        }

        var commentId = uuid.v1(),
            range = selection.getRangeAt(0);

        if(range.startContainer.nodeType != 3) {
            return;
        }

        var contextContainerHTML = wrapWordUnderIdx(range.startContainer.textContent, _this.getContextWrapHTMLStart(_this.getContextNodeId(commentId)), _this.getContextWrapHTMLEnd(), range.startOffset);
        $(range.startContainer).replaceWith(contextContainerHTML);

        var comment = {
            contextElement: _this.selectorGenerator.getSelector(range.startContainer),
            id: commentId
        };

        _this.createCommentContainer($("#" + _this.getContextNodeId(commentId))[0], _this.getCommentContainerId(commentId));
        addRemoveListener(commentId, $("#" + _this.getCommentContainerId(commentId)));
        createRemoveSign($("#" + _this.getCommentContainerId(commentId)), commentId,  _this.getCommentContainerId(commentId), function () {
            $("#" + _this.getCommentContainerId(commentId)).remove();
            var contextNode = $("#" + _this.getContextNodeId(commentId));
            contextNode.replaceWith(contextNode.text());
        });

    });
}
