/**
 * Created by user on 02.07.2016.
 */

var DEFAULT_IMAGE_HEIGHT = 300,
    DEFAULT_IMAGE_WIDTH = 150;

imageUtils = {
    dataURItoBlob: function dataURItoBlob(dataURI) {
        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
        else
            byteString = unescape(dataURI.split(',')[1]);

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], {type:mimeString});
    },

    captureScreen: function captureScreen(width, height) {
        width = width || DEFAULT_IMAGE_HEIGHT;
        height = height || DEFAULT_IMAGE_WIDTH;

        return new Promise(function(resolve, reject) {
            chrome.tabs.captureVisibleTab(null, {format: "jpeg"}, function (screenDataUrl) {
                var canvas = document.createElement("canvas");
                var ctx = canvas.getContext("2d");

                var img = new Image();
                img.src = screenDataUrl;

                img.onload = function () {
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL());
                }
            });
        });
    }
}