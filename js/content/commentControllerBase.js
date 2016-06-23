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

        var commentContainer = document.createElement("div");
        commentContainer.id = this.getCommentContainerId(entityId);
        var shadowRoot = commentContainer.createShadowRoot();


        commentElement.id = this.getCommentContainerId(entityId);
        $(commentElement).attr("data-id", entityId);
        commentElement.style.top = getElementDistance(contextNode, true) - this.getCommentOffsetTop()  + "px";
        commentElement.style.left = getElementDistance(contextNode, false) + this.getCommentOffsetLeft() + "px";

        shadowRoot.appendChild(commentElement);
        document.body.appendChild(commentContainer);

        return commentElement;
    },

    removeById: function (id) {
        $("#" + this.getCommentContainerId(id)).remove();
        this.removeEntityFromPersistanceStore(id);
    },

    removeAll: function () {
        $("[id*=bookmarkTreeCommentContainer]").remove();
        $("[id*=bookmarkTreeCommentContextNode]").each(function () {
            $(this).replaceWith($(this).text());
        });
        $(".removeContainer").remove();
    },

    render: function (entity, isOwner) {
        var _this = this;
        var contextContainerHTML = wrapWordUnderIdx(entity.startContainer.textContent, _this.getContextWrapHTMLStart(_this.getContextNodeId(entity.id)), _this.getContextWrapHTMLEnd(), entity.startOffset);
        $(entity.startContainer).replaceWith(contextContainerHTML);

        if(!entity.display) {
            return;
        }

        var commentContainer = _this.createCommentContainer($("#" + _this.getContextNodeId(entity.id))[0], entity.id);

        if(isOwner) {
            var removeContainer  = createRemoveSign($("#" + _this.getContextNodeId(entity.id)),
                entity.id,
                this.getRemoveSignOffsetTop(),
                this.getRemoveSignOffsetRight(),
                $(commentContainer),
                function (entityId) {
                    _this.removeById(entityId) ;
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

        this.persistEntity({selector: this.getStartSelector(range.startContainer.parentNode), startOffset: range.startOffset, tempId: entityId, textPosition: findTextNodePosition(range.startContainer.parentNode, range.startContainer), isNew: true, display: true});

        this.render({startContainer: range.startContainer, startOffset: range.startOffset, id: entityId, selector: this.getStartSelector(range.startContainer.parentNode), display: true}, true);
    },
    selectorGenerator: new CssSelectorGenerator({selectors: ['tag', 'nthchild']}),

    getStyles: function () {
        return `.commentContainer:hover {
                    padding: 7px;
                }

                .commentContainer input, hr, .click-link {
                    transition: all 0.3s ease-out 0.5s;
                    display: none;
                    opacity: 0;
                    font-family: Arial, sans-serif;
                    font-size: 14px;
                    line-height: 20px;
                }

                .commentContainer input {
                    border: 1px solid #C7C7CC;
                    border-radius: 3px;
                    width: 100%;
                }

                .commentContainer hr {
                    margin-top: 5px;
                    margin-bottom: 5px;
                }


                .commentContainer
                {
                    top: 75%;
                    height: 25%;
                    width: 65px;
                    transition: all 0.3s ease-out 0.5s;
                    position: absolute;
                    z-index: 10000;
                    opacity: 0.7;
                    padding: 0px;
                    background: rgba(255,209,235,1);
                    background: -webkit-gradient(left bottom, right top, color-stop(0%, rgba(255,209,235,1)), color-stop(0%, rgba(209,255,255,1)), color-stop(93%, rgba(188,224,238,1)), color-stop(100%, rgba(188,224,238,1)));
                    background: -webkit-linear-gradient(45deg, rgba(255,209,235,1) 0%, rgba(209,255,255,1) 0%, rgba(188,224,238,1) 93%, rgba(188,224,238,1) 100%);
                    background: linear-gradient(45deg, rgba(255,209,235,1) 0%, rgba(209,255,255,1) 0%, rgba(188,224,238,1) 93%, rgba(188,224,238,1) 100%);
                    -webkit-border-radius: 12px;
                    -moz-border-radius: 12px;
                    border-radius: 6px;
                    border: #7F7F7F solid 1px;
                }

                .commentContainer:hover {
                    padding: 10px;
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    top: 0px;
                    box-shadow: 0 0 10px #719ECE;
                    border-radius: 12px;
                    opacity: 1;
                }

                .commentContainer:after
                {
                    content: '';
                    position: absolute;
                    border-style: solid;
                    border-width: 15px 12px 0;
                    border-color: #D1FFFF transparent;
                    display: block;
                    width: 0;
                    z-index: 1;
                    bottom: -15px;
                    left: 10px;
                }

                .commentContainer:before
                {
                    content: '';
                    position: absolute;
                    border-style: solid;
                    border-width: 15px 12px 0;
                    border-color: #7F7F7F transparent;
                    display: block;
                    width: 0;
                    z-index: 0;
                    bottom: -16px;
                    left: 14px;
                }

                .commentContainer textarea {
                    color: #000000;
                    padding: 0px;
                    margin: 0px;
                    display: none;
                    overflow: auto;
                }

                .commentContainer:hover textarea {
                    display: block;
                    font-size: 15px;
                    background: transparent;
                    margin-left: 2px;
                    margin-top: 5px;
                    border: none;
                    overflow: hidden;
                    resize: none;
                    width: 98%;
                    height: 75%;
                }

                .commentContainer textarea:focus {
                    border: none;
                    outline: none !important;
                }

                .commentContainer textarea::-webkit-scrollbar{ width: 10px;}

                .commentContainer textarea::-webkit-scrollbar-track{ background-color: transparent;}

                .commentContainer textarea::-webkit-scrollbar-thumb{
                    background-color:rgba(0,0,0,0.5);
                    border:3px solid transparent;
                    border-radius:6px;
                    background-clip:content-box;
                    box-shadow:inset 0px 0px 0px 1px rgba(9, 3, 42, 0.25);
                }

                .commentContainer textarea::-webkit-scrollbar-thumb:window-inactive{
                    background-color:rgba(102,102,102,0.5);
                    border:3px solid transparent;
                    border-radius:6px;
                    background-clip:content-box;
                    box-shadow:inset 0px 0px 0px 1px rgba(192,192,192,0.5);
                }`;
    }
}



