const landmarkAreas = {
    // thumb: [1, 2, 3, 4],
    // indexFinger: [5, 6, 7, 8],
    // middleFinger: [9, 10, 11, 12],
    // ringFinger: [13, 14, 15, 16],
    // pinky: [17, 18, 19, 20],
    // palm: [0, 5, 9, 13, 17]
    palm: ["bottomPalm", "bottomIndex", "bottomMiddle", "bottomRing", "bottomPinky"],
}
const landmarkPoints = {
    leftIndexTip: 8,
    rightIndexTip: 8,
    // General (Both Left and Right)
    bottomPalm: 0,
    bottomIndex: 5,
    bottomMiddle: 9,
    bottomRing: 13,
    bottomPinky: 17,
}

const landmarkColors = {
    leftIndexTip: "red",
    rightIndexTip: "red",
    // General (Both Left and Right)
    bottomPalm: "red",
    bottomIndex: "red",
    bottomMiddle: "red",
    bottomRing: "red",
    bottomPinky: "red",
}

function map(a, in_min, in_max, out_min, out_max) {
    return (a - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function userTouchesObject(bodyPoints, object, trueCallback, falseCallback) {
    for (var bodyPointIndex = 0; bodyPointIndex < bodyPoints.length; bodyPointIndex++) {
        var bodyPoint = bodyPoints[bodyPointIndex];
        let landmarkPoint = landmarkPoints[bodyPoint];

        let x, y;

        if ((bodyPoint == "bottomPalm" || bodyPoint == "bottomIndex" || bodyPoint == "bottomMiddle" || bodyPoint == "bottomRing" || bodyPoint == "bottomPinky") && (mpResults.leftHandLandmarks || mpResults.rightHandLandmarks)) {
            if (mpResults.leftHandLandmarks) {
                x = map(mpResults.leftHandLandmarks[landmarkPoint].x, 0, 1, 0, canvasElement.clientWidth);
                y = map(mpResults.leftHandLandmarks[landmarkPoint].y, 0, 1, 0, canvasElement.clientHeight);
                radius = drawingUtils.lerp(mpResults.leftHandLandmarks[landmarkPoint].z, -0.15, .1, 10, 1);
            } else {
                x = map(mpResults.rightHandLandmarks[landmarkPoint].x, 0, 1, 0, canvasElement.clientWidth);
                y = map(mpResults.rightHandLandmarks[landmarkPoint].y, 0, 1, 0, canvasElement.clientHeight);
                radius = drawingUtils.lerp(mpResults.rightHandLandmarks[landmarkPoint].z, -0.15, .1, 10, 1);
            }
        } else if (bodyPoint == "leftIndexTip" && mpResults.leftHandLandmarks) {
            x = map(mpResults.leftHandLandmarks[landmarkPoint].x, 0, 1, 0, canvasElement.clientWidth);
            y = map(mpResults.leftHandLandmarks[landmarkPoint].y, 0, 1, 0, canvasElement.clientHeight);
        } else if (bodyPoint == "rightIndexTip" && mpResults.rightHandLandmarks) {
            x = map(mpResults.rightHandLandmarks[landmarkPoint].x, 0, 1, 0, canvasElement.clientWidth);
            y = map(mpResults.rightHandLandmarks[landmarkPoint].y, 0, 1, 0, canvasElement.clientHeight);
        } else {
            continue; // This is really a continue; bodyPoint is not detected.
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
}

function userClicksObject(bodyPoints, object, trueCallback) {
    // Get object's Object class.
    const objectClass = getObjectByUID(object.uid);

    if (objectClass) {
        for (var bodyPointIndex = 0; bodyPointIndex < bodyPoints.length; bodyPointIndex++) {
            var bodyPoint = bodyPoints[bodyPointIndex];
            let landmarkPoint = landmarkPoints[bodyPoint];

            let x, y;

            if (userTouchesObject([bodyPoint], object, () => { }, () => { })) {
                if (objectClass.continueGrowing) {
                    objectClass.landmarkRadius += 0.5;
                } else {
                    objectClass.landmarkRadius = 0.0;
                }

                if ((bodyPoint == "bottomPalm" || bodyPoint == "bottomIndex" || bodyPoint == "bottomMiddle" || bodyPoint == "bottomRing" || bodyPoint == "bottomPinky") && (mpResults.leftHandLandmarks || mpResults.rightHandLandmarks)) {
                    if (mpResults.leftHandLandmarks) {
                        x = map(mpResults.leftHandLandmarks[landmarkPoint].x, 0, 1, 0, canvasElement.clientWidth);
                        y = map(mpResults.leftHandLandmarks[landmarkPoint].y, 0, 1, 0, canvasElement.clientHeight);
                        radius = drawingUtils.lerp(mpResults.leftHandLandmarks[landmarkPoint].z, -0.15, .1, 10, 1);
                    } else {
                        x = map(mpResults.rightHandLandmarks[landmarkPoint].x, 0, 1, 0, canvasElement.clientWidth);
                        y = map(mpResults.rightHandLandmarks[landmarkPoint].y, 0, 1, 0, canvasElement.clientHeight);
                        radius = drawingUtils.lerp(mpResults.rightHandLandmarks[landmarkPoint].z, -0.15, .1, 10, 1);
                    }
                } else if (bodyPoint == "leftIndexTip" && mpResults.leftHandLandmarks) {
                    x = map(mpResults.leftHandLandmarks[landmarkPoint].x, 0, 1, 0, canvasElement.clientWidth);
                    y = map(mpResults.leftHandLandmarks[landmarkPoint].y, 0, 1, 0, canvasElement.clientHeight);
                    radius = drawingUtils.lerp(mpResults.leftHandLandmarks[landmarkPoint].z, -0.15, .1, 10, 1);
                } else if (bodyPoint == "rightIndexTip" && mpResults.rightHandLandmarks) {
                    x = map(mpResults.rightHandLandmarks[landmarkPoint].x, 0, 1, 0, canvasElement.clientWidth);
                    y = map(mpResults.rightHandLandmarks[landmarkPoint].y, 0, 1, 0, canvasElement.clientHeight);
                    radius = drawingUtils.lerp(mpResults.rightHandLandmarks[landmarkPoint].z, -0.15, .1, 10, 1);
                } else {
                    continue; // This is really a continue.
                }

                (function draw() {
                    canvasCtx.beginPath();
                    canvasCtx.arc(x, y, radius + objectClass.landmarkRadius, 0, 2 * Math.PI, false);
                    canvasCtx.fillStyle = 'transparent';
                    canvasCtx.fill();
                    canvasCtx.lineWidth = 2;
                    canvasCtx.strokeStyle = landmarkColors[bodyPoint];
                    canvasCtx.stroke();
                })();

                if (!objectClass.selected && objectClass.landmarkRadius > 9) {
                    objectClass.selected = true;
                    landmarkColors[bodyPoint] = "blue";
                    trueCallback();
                } else if (objectClass.continueGrowing && objectClass.selected) {
                    objectClass.landmarkRadius -= 2.5;
                    if (objectClass.landmarkRadius <= 0.0) {
                        objectClass.landmarkRadius = 0.0;
                        objectClass.continueGrowing = false;
                    }
                }
            } else {
                landmarkColors[bodyPoint] = "red"
                objectClass.selected = false;
            }
        }

        if (objectClass.selected) {
            return true;
        } else {
            return false;
        }
    }

    return false;
}

function userDragsAndDropsObject(object, pickUpCallback, dragCallback, dropCallback) {
    // Get object's Object class.
    const objectClass = getObjectByUID(object.uid);

    if (objectClass) {
        if (!objectClass.userWantsToPickUpObject && !objectClass.userPickedUpObject) {
            if (userOpensHand()) {
                userClicksObject(landmarkAreas.palm, object, () => {
                    // User wants to pick up object, must close palm now.
                    console.log("wants to pick up");
                    objectClass.userWantsToPickUpObject = true;
                    objectClass.selected = false;
                });
            }
        } else if (objectClass.userWantsToPickUpObject && !objectClass.userPickedUpObject) {
            if (!userTouchesObject(landmarkAreas.palm, object, ()=>{}, ()=>{})) {
                objectClass.userWantsToPickUpObject = false;
                return;
            }

            if (userClosesHand()) {
                userClicksObject(landmarkAreas.palm, object, () => {
                    // User wants to pick up object, must close palm now.
                    console.log("picked up");
                    objectClass.userPickedUpObject = true;
                    pickUpCallback();
                });
            }
        } else if (objectClass.userWantsToPickUpObject && objectClass.userPickedUpObject) {
            if (userClosesHand()) {
                moveObject(object, landmarkAreas.palm);
                dragCallback();
            } else if (userOpensHand()) {
                dropCallback();
                objectClass.selected = false;
                objectClass.userWantsToPickUpObject = false;
                objectClass.userPickedUpObject = false;
            }
        }
    }
}

function moveObject(object, bodyPoints) {
    var bodyPointCoordinates = [];

    for (var bodyPointIndex = 0; bodyPointIndex < bodyPoints.length; bodyPointIndex++) {
        var bodyPoint = bodyPoints[bodyPointIndex];
        let landmarkPoint = landmarkPoints[bodyPoint];

        let x, y;

        if ((bodyPoint == "bottomPalm" || bodyPoint == "bottomIndex" || bodyPoint == "bottomMiddle" || bodyPoint == "bottomRing" || bodyPoint == "bottomPinky") && (mpResults.leftHandLandmarks || mpResults.rightHandLandmarks)) {
            if (mpResults.leftHandLandmarks) {
                x = map(mpResults.leftHandLandmarks[landmarkPoint].x, 0, 1, 0, canvasElement.clientWidth);
                y = map(mpResults.leftHandLandmarks[landmarkPoint].y, 0, 1, 0, canvasElement.clientHeight);
                radius = drawingUtils.lerp(mpResults.leftHandLandmarks[landmarkPoint].z, -0.15, .1, 10, 1);
            } else {
                x = map(mpResults.rightHandLandmarks[landmarkPoint].x, 0, 1, 0, canvasElement.clientWidth);
                y = map(mpResults.rightHandLandmarks[landmarkPoint].y, 0, 1, 0, canvasElement.clientHeight);
                radius = drawingUtils.lerp(mpResults.rightHandLandmarks[landmarkPoint].z, -0.15, .1, 10, 1);
            }
        }

        bodyPointCoordinates.push({ x: x, y: y });
    }

    var centerPoint = ((pts) => {
        // https://stackoverflow.com/questions/9692448/how-can-you-find-the-centroid-of-a-concave-irregular-polygon-in-javascript
        var first = pts[0], last = pts[pts.length - 1];
        if (first.x != last.x || first.y != last.y) pts.push(first);
        var twicearea = 0,
            x = 0, y = 0,
            nPts = pts.length,
            p1, p2, f;
        for (var i = 0, j = nPts - 1; i < nPts; j = i++) {
            p1 = pts[i]; p2 = pts[j];
            f = p1.x * p2.y - p2.x * p1.y;
            twicearea += f;
            x += (p1.x + p2.x) * f;
            y += (p1.y + p2.y) * f;
        }
        f = twicearea * 3;
        return { x: x / f, y: y / f };
    })(bodyPointCoordinates);

    console.log(centerPoint);
    var x = centerPoint.x;
    var y = centerPoint.y;

    let objectDimensions = object.getBoundingClientRect();
    var objectWidth = objectDimensions.width / 2;
    var objectHeight = objectDimensions.height / 2;

    object.style.position = "absolute";
    object.style.left = (x - objectWidth) + "px";
    object.style.top = (y - objectHeight) + "px";

}