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

    render: function (entity, isNew) {
        var _this = this;
        var contextContainerHTML = wrapWordUnderIdx(entity.startContainer.textContent, _this.getContextWrapHTMLStart(_this.getContextNodeId(entity.id)), _this.getContextWrapHTMLEnd(), entity.startOffset);
        $(entity.startContainer).replaceWith(contextContainerHTML);
        _this.createCommentContainer($("#" + _this.getContextNodeId(entity.id))[0], entity.id);
        addRemoveListener(entity.id, $("#" + _this.getCommentContainerId(entity.id)));

        createRemoveSign($("#" + _this.getCommentContainerId(entity.id)), entity.id,  _this.getCommentContainerId(entity.id), function () {
            $("#" + _this.getCommentContainerId(entity.id)).remove();
            var contextNode = $("#" + _this.getContextNodeId(entity.id));
            contextNode.replaceWith(contextNode.text());
            _this.removeEntityFromPersistanceStore(entity.id, isNew);
        });

        this.initializeEntity(entity, _this.getCommentContainerId(entity.commentId));
    },

    renderEntity: function (entity) {
         if($(entity.selector)[0]) {
            this.render({id: entity.id, startContainer: findTextNodeAtPosition($(entity.selector)[0], entity.textPosition), startOffset: entity.startOffset, uiComment: entity.id, text: entity.text });
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

        this.persistEntity({selector: this.getStartSelector(range.startContainer.parentNode), startOffset: range.startOffset, tempId: entityId, textPosition: findTextNodePosition(range.startContainer.parentNode, range.startContainer) });

        this.render({startContainer: range.startContainer, startOffset: range.startOffset, id: entityId}, true);
    },
    selectorGenerator: new CssSelectorGenerator()
}

