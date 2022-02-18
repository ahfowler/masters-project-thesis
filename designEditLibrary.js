const designEditGameMechanism = {
    // Change the style of any object on the DOM.
    changeStyle: function (object, style) {
        if (style.color) {
            object.style.color = style.color;
        }

        if (style.backgroundColor) {
            object.style.backgroundColor = style.backgroundColor;
        }

        if (style.width) {
            object.style.width = style.width;
        }

        if (style.height) {
            object.style.height = style.height;
        }

        if (style.text) {
            object.innerHTML = style.text;
        }

        if (style.coordinates) {
            let objectDimensions = object.getBoundingClientRect();
            var objectWidth = objectDimensions.width / 2;
            var objectHeight = objectDimensions.height / 2;

            object.style.position = "absolute";
            object.style.left = (x - objectWidth) + "px";
            object.style.top = (y - objectHeight) + "px";
        }
    },
    // Change the style of any landmark on the body.
    changeLandmarkStyle: function (landmarkName, style) {

    }
}

// Click Animations
function drawOuterCircle(x, y, radius, fillColor, strokeColor) {
    canvasCtx.beginPath();
    canvasCtx.arc(x, y, radius, 0, 2 * Math.PI, false);
    canvasCtx.fillStyle = fillColor;
    canvasCtx.fill();
    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = strokeColor;
    canvasCtx.stroke();
}