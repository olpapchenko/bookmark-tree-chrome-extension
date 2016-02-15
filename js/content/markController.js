var selectorGenerator = new CssSelectorGenerator();

MarkController = function () {
    function getMarkClass(markterId) {
        return markterId;
    }

    function getMarkerColor () {
        return preferencesService.get().then(function (preferences) {
            return preferences[preferencesService.MARK_COLOR].value;
        });
    }

    function getMarkerStartMarkUp () {
        return getMarkerColor().then(function (color) {
            return function (markerId) {return "<span style='background-color: " + color + "' class = '" + getMarkClass(markerId) + "'>";}
        });
    }

    function getEndMarkUp() {
        return "</span>";
    }

    function removeMarkerFromUI(markerClass) {
        $("." + markerClass).each(function () {
            $(this).replaceWith(escapeText(this.textContent));
        });
        Bookmark.removeMarkerById(markerClass);
    }

    function markText (range, markerId) {
        //console.log(range.startContainer);
        //console.log(range.endContainer);
        getMarkerStartMarkUp().then(function (generateStartMarkUp) {
            var startContainer = getFirstOfTextType(range.startContainer),
                endContainer =  getLastOfTextType(range.endContainer),
                startPosition = range.startContainer.nodeType == 3 ? range.startOffset : 0,
                endPosition = range.startContainer.nodeType == 3 ? range.endOffset : endContainer.length - 1,
                commonAncestorContainer = $(range.commonAncestorContainer);

            //endPosition += generateStartMarkUp(markerId).length;

            var startPositionStartContainer = startPosition,
                baseNodeFound = false;

            forEachTextChildNode(commonAncestorContainer, function (idx, node) {
                var node = $(node)[0];

                if(startContainer[0] == endContainer[0] || /^\s+$/.test(node.textContent) || node.textContent.length == 0) {
                    return;
                }

                if(baseNodeFound) {
                    wrapTextNodes(node, generateStartMarkUp(markerId) + getEndMarkUp());
                }

                if(node == startContainer[0]) {
                    baseNodeFound = true;
                }

                if(node == endContainer[0]) {
                    baseNodeFound = false;
                }
            });

            if(range.startContainer == range.endContainer) {
                if(endPosition - startPosition == 0) {
                    return;
                }
                var endPositionStartContainer = endPosition;
            } else {
                endPositionStartContainer = startContainer.text().length;

                var textEndEscaped = endContainer.text().escapeTextRange(0, endPosition);
                lengthDelta = textEndEscaped.length - endContainer.text();
                endPosition = lengthDelta == 0 ? endPosition : endPosition + lengthDelta;

                var endElementHtml = textEndEscaped.insertAtPosition(0, generateStartMarkUp(markerId))
                    .insertAtPosition(endPosition + generateStartMarkUp(markerId).length, getEndMarkUp());
                endContainer.replaceWith(endElementHtml);
            }

            var textStartEscaped = startContainer.text().escapeTextRange(startPositionStartContainer, endPositionStartContainer),
                lengthDelta = textStartEscaped.length - startContainer.text().length;

            endPositionStartContainer = lengthDelta == 0 ? endPositionStartContainer : endPositionStartContainer + lengthDelta;
            endPositionStartContainer += generateStartMarkUp(markerId).length;
            textStartEscaped = textStartEscaped.escapeTextRange(endPositionStartContainer, textStartEscaped.length);

            var startElementHTML = textStartEscaped.insertAtPosition(startPositionStartContainer, generateStartMarkUp(markerId))
                .insertAtPosition(endPositionStartContainer, getEndMarkUp());

            startElementHTML = startElementHTML.escapeTextRange(0, startPositionStartContainer);

            var startContainerMarked = $("<span>" + startElementHTML + "</span>");
            startContainer.replaceWith(startContainerMarked);
            addRemoveListener(markerId, $("." + getMarkClass(markerId)));

            createRemoveSign(startContainerMarked.find("." + getMarkClass(markerId))[0], markerId, getMarkClass(markerId), function (entityClass) {
                removeMarkerFromUI(entityClass);
            });
        });
    }

    MarkController.prototype.markSelection = function markSelection(selection) {
        if(!selection || selection.collapsed || selection.rangeCount == 0) {
            return;
        }

        var range = selection.getRangeAt(0);

        if(range.startOffset == range.endOffset) {
            return;
        }

        console.log(range.startContainer);

        var marker = {
            startContainerSelector: selectorGenerator.getSelector(range.startContainer),
            endContainerSelector: selectorGenerator.getSelector(range.endContainer),
            commonContainer: selectorGenerator.getSelector(range.commonContainer),
            startOffset: range.startOffset,
            endOffset: range.endOffset,
            id: uuid.v1()
        }

        Bookmark.addMarker(marker);
        console.log(Bookmark);
        markText(range, marker.id);
        selection.empty();
    }

    MarkController.prototype.markTextBySelector = function markTextBySelector (selectorObject) {
        this.markText({startContainer: $(selectorObject.startContainer)[0],
            endContainer: $(selectorObject.endContainer)[0],
            startOffset: selectorObject.startOffset,
            endOffset: selectorObject.endOffset
        });
    }
};

markController = new MarkController();



