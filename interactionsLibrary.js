const bodyPoints = {
    leftIndexTip: 8,
    rightIndexTip: 8
}

const landmarkColors = {
    leftIndexTip: "red",
    rightIndexTip: "red"
}

function map(a, in_min, in_max, out_min, out_max) {
    return (a - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function userTouchesObject(bodyPoint, object, trueCallback, falseCallback) {
    landmarkPoint = bodyPoints[bodyPoint];

    let x, y;

    if (bodyPoint == "leftIndexTip" && mpResults.leftHandLandmarks) {
        x = map(mpResults.leftHandLandmarks[landmarkPoint].x, 0, 1, 0, canvasElement.clientWidth);
        y = map(mpResults.leftHandLandmarks[landmarkPoint].y, 0, 1, 0, canvasElement.clientHeight);
    } else if (bodyPoint == "rightIndexTip" && mpResults.rightHandLandmarks) {
        x = map(mpResults.rightHandLandmarks[landmarkPoint].x, 0, 1, 0, canvasElement.clientWidth);
        y = map(mpResults.rightHandLandmarks[landmarkPoint].y, 0, 1, 0, canvasElement.clientHeight);
    } else {
        falseCallback(); // bodyPoint is not detected.
        return false;
    }

    // console.log(x, y);

    let objectDimensions = object.getBoundingClientRect();

    var position = {
        x1: objectDimensions.x,
        x2: objectDimensions.x + objectDimensions.width,
        y1: objectDimensions.y,
        y2: objectDimensions.y + objectDimensions.height
    }

    // console.log(position);

    if (x > position.x1 && x < position.x2 && y > position.y1 && y < position.y2) {
        trueCallback();
        return true;
    } else {
        falseCallback(); // bodyPoint is not touching the object.
        return false;
    }
}

var landmarkRadius = 0.0;
let clicked = false;
let continueGrowing = false;

function userClicksObject(bodyPoint, object, trueCallback) {
    let x, y;

    if (userTouchesObject(bodyPoint, object, () => { }, () => { })) {
        if (bodyPoint == "leftIndexTip" && mpResults.leftHandLandmarks) {
            x = map(mpResults.leftHandLandmarks[landmarkPoint].x, 0, 1, 0, canvasElement.clientWidth);
            y = map(mpResults.leftHandLandmarks[landmarkPoint].y, 0, 1, 0, canvasElement.clientHeight);
        } else if (bodyPoint == "rightIndexTip" && mpResults.rightHandLandmarks) {
            x = map(mpResults.rightHandLandmarks[landmarkPoint].x, 0, 1, 0, canvasElement.clientWidth);
            y = map(mpResults.rightHandLandmarks[landmarkPoint].y, 0, 1, 0, canvasElement.clientHeight);
        } else {
            return false;
        }

        if (continueGrowing) {
            landmarkRadius += 0.5;
        } else {
            landmarkRadius = 0.0;
        }

        (function draw() {
            let radius = drawingUtils.lerp(mpResults.leftHandLandmarks[landmarkPoint].z, -0.15, .1, 10, 1);
            canvasCtx.beginPath();
            canvasCtx.arc(x, y, radius + landmarkRadius, 0, 2 * Math.PI, false);
            canvasCtx.fillStyle = 'transparent';
            canvasCtx.fill();
            canvasCtx.lineWidth = 2;
            canvasCtx.strokeStyle = landmarkColors[bodyPoint];
            canvasCtx.stroke();
        })();

        if (!clicked && landmarkRadius > 10) {
            clicked = true;
            landmarkColors[bodyPoint] = "blue";
            trueCallback();
        } else if (clicked) {
            landmarkRadius -= 2.5;
            if (landmarkRadius <= 0.0) {
                landmarkRadius = 0.0;
                continueGrowing = false;
            }
        }
    } else {
        landmarkRadius = 0.0;
        clicked = false;
        continueGrowing = true;

        landmarkColors[bodyPoint] = "red";
    }

    return clicked;
}