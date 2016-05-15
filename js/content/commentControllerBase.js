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
        $(commentElement).attr("data-id", entityId);
        commentElement.style.top = getElementDistance(contextNode, true) - this.getCommentOffsetTop()  + "px";
        commentElement.style.left = getElementDistance(contextNode, false) + this.getCommentOffsetLeft() + "px";

        document.body.appendChild(commentElement);
        return commentElement;
    },

    removeById: function (id, isNew) {
        $("#" + this.getCommentContainerId(id)).remove();
        var contextNode = $("#" + this.getContextNodeId(id));
        contextNode.replaceWith(contextNode.text());
        this.removeEntityFromPersistanceStore(id, isNew);
    },

    removeAll: function () {
        $("[id*=bookmarkTreeCommentContainer]").remove();
        $("[id*=bookmarkTreeCommentContextNode]").each(function () {
            $(this).replaceWith($(this).text());
        });
        $(".removeContainer").remove();
    },

    render: function (entity, isNew, isOwner) {
        var _this = this;
        var contextContainerHTML = wrapWordUnderIdx(entity.startContainer.textContent, _this.getContextWrapHTMLStart(_this.getContextNodeId(entity.id)), _this.getContextWrapHTMLEnd(), entity.startOffset);
        $(entity.startContainer).replaceWith(contextContainerHTML);
        var commentContainer = _this.createCommentContainer($("#" + _this.getContextNodeId(entity.id))[0], entity.id);
        addRemoveListener($("#" + _this.getCommentContainerId(entity.id)));

        if(isOwner) {
            var removeContainer  = createRemoveSign($("#" + _this.getCommentContainerId(entity.id)), entity.id,  _this.getCommentContainerId(entity.id), function (entityClass, entityId) {
                _this.removeById(entityId, isNew) ;
            });
        }
        this.initializeEntity(entity, _this.getCommentContainerId(entity.commentId));

        this.getEntity2NodesList().push({
            container: commentContainer,
            contextNode: $("#" + _this.getContextNodeId(entity.id)),
            removeContainer: removeContainer,
            entity: entity
        });
    },

    renderEntity: function (entity, isOwner) {
         if($(entity.selector)[0]) {
             var baseEntity = {
                 startContainer: findTextNodeAtPosition($(entity.selector)[0], entity.textPosition),
                 startOffset: entity.startOffset,
                 uiComment: entity.id}
             var cleanEntity = _.omit(entity, "startContainer", "startOffset", "uiComment");
            this.render(_.extend(cleanEntity, baseEntity), false, isOwner);
        } else {
            throw new Error("Some comments can not be matched. Page layout has changed.");
        }
    },

    reconcileEntity: function (newComment) {

        var _this = this;
        var comments2node  = this.getEntity2NodesList().filter(function (oldComment) {
            return commentComparator.equals(newComment, oldComment.entity);
        });

        if(comments2node.length == 0) {
            console.log("can not reconcile comment");
            return;
        } else {
            var comment2Node = comments2node[0];
        }


        $(comment2Node.container).attr("id", _this.getCommentContainerId(newComment.id));
        $(comment2Node.container).attr("data-id", newComment.id);

        this.reconcileInnerHtml(newComment, comment2Node.container);
        var removeContainer = $(comment2Node.removeContainer).attr("id", newComment.id);

        $(comment2Node.contextNode).attr("id", _this.getContextNodeId(newComment.id));
        $(removeContainer).attr("data-id", newComment.id);

        this.updateEntityAtPersistStore(newComment);
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

        this.persistEntity({selector: this.getStartSelector(range.startContainer.parentNode), startOffset: range.startOffset, tempId: entityId, textPosition: findTextNodePosition(range.startContainer.parentNode, range.startContainer), isNew: true});

        this.render({startContainer: range.startContainer, startOffset: range.startOffset, id: entityId, selector: this.getStartSelector(range.startContainer.parentNode)}, true, true);
    },
    selectorGenerator: new CssSelectorGenerator({selectors: ['tag', 'nthchild']})
}

