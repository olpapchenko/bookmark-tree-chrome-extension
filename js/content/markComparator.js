markerComparator = {
    equals: function (marker1, marker2) {
        return marker1.startContainerSelector == marker2.startContainerSelector &&
                marker1.startTextNodePosition == marker2.startTextNodePosition &&
                marker2.endTextNodePosition == marker2.endTextNodePosition &&
                marker1.commonAncestorContainer == marker2.commonAncestorContainer;
    }
};