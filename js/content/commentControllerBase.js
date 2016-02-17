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

    createCommentContainer: function createCommentContainer(contextNode, commentId) {
        var _this = this,
            commentElement = $(_this.getBodyMarkUp())[0];

        commentElement.id = commentId;

        commentElement.style.top = getElementDistance(contextNode, true) - this.getCommentOffsetTop()  + "px";
        commentElement.style.left = getElementDistance(contextNode, false) + this.getCommentOffsetLeft() + "px";

        document.body.appendChild(commentElement);
    },

    render: function (startContainer, startOffset, commentId) {
        var _this = this;
        var contextContainerHTML = wrapWordUnderIdx(startContainer.textContent, _this.getContextWrapHTMLStart(_this.getContextNodeId(commentId)), _this.getContextWrapHTMLEnd(), startOffset);
        $(startContainer).replaceWith(contextContainerHTML);
        _this.createCommentContainer($("#" + _this.getContextNodeId(commentId))[0], _this.getCommentContainerId(commentId));
        addRemoveListener(commentId, $("#" + _this.getCommentContainerId(commentId)));

        createRemoveSign($("#" + _this.getCommentContainerId(commentId)), commentId,  _this.getCommentContainerId(commentId), function () {
            $("#" + _this.getCommentContainerId(commentId)).remove();
            var contextNode = $("#" + _this.getContextNodeId(commentId));
            contextNode.replaceWith(contextNode.text());
            _this.removeEntityFromPersistanceStore(commentId);
        });
    },

    renderEntity: function (entity) {
        if($(entity.selector)[0]) {
            this.render($(entity.selector)[0].firstChild, entity.startOffset, entity.id);
        } else {
            throw new Error("Some comments can not be matched. Page layout has changed.");
        }
    },

    getStartSelector: function (startTextNode) {
        return this.selectorGenerator.getSelector(startTextNode.nodeType == 3 ? startTextNode.parentNode: startTextNode);
    },

    processSelection: function (selection) {
        if(!selection) {
            return;
        }

        var entityId = uuid.v1(),
            range = selection.getRangeAt(0);

        if(range.startContainer.nodeType != 3) {
            return;
        }



        this.persistEntity({selector: this.getStartSelector(range.startContainer), startOffset: range.startOffset, id: entityId});

        this.render(range.startContainer, range.startOffset, entityId);
    },
    selectorGenerator: new CssSelectorGenerator()
}

