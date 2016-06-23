var selectorGenerator = new CssSelectorGenerator({selectors: ['tag', 'nthchild']});

MarkController = function () {
    var marker2nodeList = [];

    function getMarkClass(markterId, display) {
        return "bookmarkTreeMarker" + markterId +  (!display ? " bookmarkTree-hide-comment" : "");
    }

    function getMarkerColor () {
        return preferencesService.get().then(function (preferences) {
            return preferences[preferencesService.MARK_COLOR].value;
        });
    }

    function getMarkerStartMarkUp (display) {
        return getMarkerColor().then(function (color) {
            return function (markerId) {return "<span style='background-color: " + color + "' class = '" + getMarkClass(markerId, display) + "'>";}
        });
    }

    function getEndMarkUp() {
        return "</span>";
    }

    function removeMarkerFromUI(markerId) {
        $("." + getMarkClass(markerId, true)).each(function () {
            $(this).addClass("bookmarkTree-hide-comment");
        });

        hideRemoveSign(markerId);

        Bookmark.removeMarkerById(markerId);
    }

    function markText (range, markerId, isOwner, marker) {
        //console.log(range.startContainer);
        //console.log(range.endContainer);
        getMarkerStartMarkUp(marker.display).then(function (generateStartMarkUp) {
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

            marker2nodeList.push({
                marker: marker,
                node: startContainerMarked.find("." + getMarkClass(markerId, true))
            });

            if(marker.display) {
                if(isOwner) {
                    createRemoveSign(startContainerMarked.find("." + getMarkClass(markerId, true))[0],
                        markerId,
                        -20,
                        -20,
                        $("." + getMarkClass(markerId, true)), function (markerId) {
                        removeMarkerFromUI(markerId);
                    });
                }
            }
        });
    }

    MarkController.prototype.removeMarkerById = function (id) {
        removeMarkerFromUI(id);
    }

    MarkController.prototype.markSelection = function markSelection(selection) {
        if(!selection || selection.collapsed || selection.rangeCount == 0) {
            return;
        }

        var range = selection.getRangeAt(0);

        if(range.startOffset == range.endOffset || range.startContainer.nodeType != 3 || range.endContainer.nodeType != 3) {
            return;
        }


        var marker = {
            startContainerSelector: selectorGenerator.getSelector(range.startContainer.parentNode),
            endContainerSelector: selectorGenerator.getSelector(range.endContainer.parentNode),
            commonAncestorContainer: selectorGenerator.getSelector(range.commonAncestorContainer.nodeType == 3 ? range.commonAncestorContainer.parentNode : range.commonAncestorContainer),
            startTextNodePosition: findTextNodePosition(range.startContainer.parentNode, range.startContainer),
            endTextNodePosition: findTextNodePosition(range.endContainer.parentNode, range.endContainer),
            startOffset:  range.startOffset,
            endOffset: range.endOffset,
            tempId: uuid.v1(),
            display: true
        }

        Bookmark.addMarker(marker);
        markText(range, marker.tempId, true, marker);
        selection.empty();
    }

    MarkController.prototype.renderMarker = function markTextBySelector (marker, isOwner) {
        markText({startContainer: findTextNodeAtPosition($(marker.startContainerSelector)[0], marker.startTextNodePosition),
            endContainer: findTextNodeAtPosition($(marker.endContainerSelector)[0], marker.endTextNodePosition),
            commonAncestorContainer: $(marker.commonAncestorContainer)[0],
            startOffset: marker.startOffset,
            endOffset: marker.endOffset
        }, marker.id, isOwner, marker);
    }

    /**
     *
     * @param newMarker - new marker from the server
     * @param isOwner - flag that notifies mark controller to render or not remove sign
     */
    MarkController.prototype.reconcileMarker = function (newMarker, isOwner) {
        var markers2node = marker2nodeList.filter(function (oldMarker) {
            return markerComparator.equals(oldMarker.marker, newMarker);
        });

        if (markers2node.length == 0) {
            console.log("Marker for reconciliation not found");
            return;
        } else {
            var marker2node = markers2node[0];
        }

        $(marker2node.node).removeAttr("class");
        $(marker2node.node).addClass(getMarkClass(newMarker.id, newMarker.display));

        Bookmark.updateMarkerId(newMarker);
    };

    MarkController.prototype.removeAllFromUI = function () {
        $('[class*=bookmarkTreeMarker]').each(function () {
            $(this).replaceWith(escapeText(this.textContent));
        });
    }
};

markController = new MarkController();




