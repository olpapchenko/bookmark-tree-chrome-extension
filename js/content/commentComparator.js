commentComparator = {
    equals: function (comment1, comment2) {
        return comment1.selector == comment2.selector &&
                comment1.startOffset == comment2.startOffset;
    }
}