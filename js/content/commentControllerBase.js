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

    createCommentContainer: function createCommentContainer(contextNode, entityId) {
        var _this = this,
            commentElement = $(_this.getBodyMarkUp(entityId))[0];

        commentElement.id = this.getCommentContainerId(entityId);

        commentElement.style.top = getElementDistance(contextNode, true) - this.getCommentOffsetTop()  + "px";
        commentElement.style.left = getElementDistance(contextNode, false) + this.getCommentOffsetLeft() + "px";

        document.body.appendChild(commentElement);
    },

    render: function (entity) {
        var _this = this;
        var contextContainerHTML = wrapWordUnderIdx(entity.startContainer.textContent, _this.getContextWrapHTMLStart(_this.getContextNodeId(entity.commentId)), _this.getContextWrapHTMLEnd(), entity.startOffset);
        $(entity.startContainer).replaceWith(contextContainerHTML);
        _this.createCommentContainer($("#" + _this.getContextNodeId(entity.commentId))[0], entity.commentId);
        addRemoveListener(entity.commentId, $("#" + _this.getCommentContainerId(entity.commentId)));

        createRemoveSign($("#" + _this.getCommentContainerId(entity.commentId)), entity.commentId,  _this.getCommentContainerId(entity.commentId), function () {
            $("#" + _this.getCommentContainerId(entity.commentId)).remove();
            var contextNode = $("#" + _this.getContextNodeId(entity.commentId));
            contextNode.replaceWith(contextNode.text());
            _this.removeEntityFromPersistanceStore(entity.commentId);
        });

        this.initializeEntity(entity, _this.getCommentContainerId(entity.commentId));
    },

    renderEntity: function (entity) {
        if($(entity.selector)[0]) {
            this.render({startContainer: $(entity.selector)[0].firstChild, startOffset: entity.startOffset, uiComment: entity.id });
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

        this.persistEntity({selector: this.getStartSelector(range.startContainer), startOffset: range.startOffset, tempId: entityId});

        this.render({startContainer: range.startContainer, startOffset: range.startOffset, commentId: entityId});
    },
    selectorGenerator: new CssSelectorGenerator()
}

