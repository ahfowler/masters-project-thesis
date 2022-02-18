const landmarkAreas = {
    // thumb: [1, 2, 3, 4],
    // indexFinger: [5, 6, 7, 8],
    // middleFinger: [9, 10, 11, 12],
    // ringFinger: [13, 14, 15, 16],
    // pinky: [17, 18, 19, 20],
    // palm: [0, 5, 9, 13, 17]
    indexTips: ["leftIndexTip", "rightIndexTip"],
    palm: ["bottomPalm", "bottomIndex", "bottomMiddle", "bottomRing", "bottomPinky"],
}

const landmarkNames = {
    0: "bottomPalm",
    1: "bottomThumb",
    2: "lowerMiddleThumb",
    3: "upperMiddleThumb",
    4: "thumbTip",
    5: "bottomIndex",
    6: "lowerMiddleIndex",
    7: "upperMiddleIndex",
    8: "indexTip",
    9: "bottomMiddle",
    10: "lowerMiddleMiddle",
    11: "upperMiddleMiddle",
    12: "middleTip",
    13: "bottomRing",
    14: "lowerMiddleRing",
    15: "upperMiddleRing",
    16: "ringTip",
    17: "bottomPinky",
    18: "lowerMiddlePinky",
    19: "upperMiddlePinky",
    20: "pinkyTip",
}

const landmarkPoints = {
    leftIndexTip: 8,
    rightIndexTip: 8,
    // General (Both Left and Right)
    bottomPalm: 0,
    bottomThumb: 1,
    lowerMiddleThumb: 2,
    upperMiddleThumb: 3,
    thumbTip: 4,
    bottomIndex: 5,
    lowerMiddleIndex: 6,
    upperMiddleIndex: 7,
    indexTip: 8,
    bottomMiddle: 9,
    lowerMiddleMiddle: 10,
    upperMiddleMiddle: 11,
    middleTip: 12,
    bottomRing: 13,
    lowerMiddleRing: 14,
    upperMiddleRing: 15,
    ringTip: 16,
    bottomPinky: 17,
    lowerMiddlePinky: 18,
    upperMiddlePinky: 19,
    pinkyTip: 20
}

const landmarkStyles = {
    leftIndexTip: {
        color: "red",
        fillColor: "red",
        outerRadius: 0.0,
        continueGrowing: true
    },
    rightIndexTip: {
        color: "red",
        fillColor: "red",
        outerRadius: 0.0,
        continueGrowing: true
    },
    // General (Both Left and Right)
    bottomPalm: {
        color: "#EEEEEE",
        fillColor: "#EEEEEE",
        outerRadius: 0.0,
        continueGrowing: true
    },
    bottomThumb: {
        color: "#EEEEEE",
        fillColor: "#EEEEEE",
        outerRadius: 0.0,
        continueGrowing: true
    },
    lowerMiddleThumb: {
        color: "#EEEEEE",
        fillColor: "#EEEEEE",
        outerRadius: 0.0,
        continueGrowing: true
    },
    upperMiddleThumb: {
        color: "#EEEEEE",
        fillColor: "#EEEEEE",
        outerRadius: 0.0,
        continueGrowing: true
    },
    thumbTip: {
        color: "#EEEEEE",
        fillColor: "#EEEEEE",
        outerRadius: 0.0,
        continueGrowing: true
    },
    bottomIndex: {
        color: "#EEEEEE",
        fillColor: "#EEEEEE",
        outerRadius: 0.0,
        continueGrowing: true
    },
    lowerMiddleIndex: {
        color: "#EEEEEE",
        fillColor: "#EEEEEE",
        outerRadius: 0.0,
        continueGrowing: true
    },
    upperMiddleIndex: {
        color: "#EEEEEE",
        fillColor: "#EEEEEE",
        outerRadius: 0.0,
        continueGrowing: true
    },
    indexTip: {
        color: "red",
        fillColor: "red",
        outerRadius: 0.0,
        continueGrowing: true
    },
    bottomMiddle: {
        color: "#EEEEEE",
        fillColor: "#EEEEEE",
        outerRadius: 0.0,
        continueGrowing: true
    },
    lowerMiddleMiddle: {
        color: "#EEEEEE",
        fillColor: "#EEEEEE",
        outerRadius: 0.0,
        continueGrowing: true
    },
    upperMiddleMiddle: {
        color: "#EEEEEE",
        fillColor: "#EEEEEE",
        outerRadius: 0.0,
        continueGrowing: true
    },
    middleTip: {
        color: "#EEEEEE",
        fillColor: "#EEEEEE",
        outerRadius: 0.0,
        continueGrowing: true
    },
    bottomRing: {
        color: "#EEEEEE",
        fillColor: "#EEEEEE",
        outerRadius: 0.0,
        continueGrowing: true
    },
    lowerMiddleRing: {
        color: "#EEEEEE",
        fillColor: "#EEEEEE",
        outerRadius: 0.0,
        continueGrowing: true
    },
    upperMiddleRing: {
        color: "#EEEEEE",
        fillColor: "#EEEEEE",
        outerRadius: 0.0,
        continueGrowing: true
    },
    ringTip: {
        color: "#EEEEEE",
        fillColor: "#EEEEEE",
        outerRadius: 0.0,
        continueGrowing: true
    },
    bottomPinky: {
        color: "#EEEEEE",
        fillColor: "#EEEEEE",
        outerRadius: 0.0,
        continueGrowing: true
    },
    lowerMiddlePinky: {
        color: "#EEEEEE",
        fillColor: "#EEEEEE",
        outerRadius: 0.0,
        continueGrowing: true
    },
    upperMiddlePinky: {
        color: "#EEEEEE",
        fillColor: "#EEEEEE",
        outerRadius: 0.0,
        continueGrowing: true
    },
    pinkyTip: {
        color: "#EEEEEE",
        fillColor: "#EEEEEE",
        outerRadius: 0.0,
        continueGrowing: true
    }
}

function map(a, in_min, in_max, out_min, out_max) {
    return (a - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function userTouchesObject(bodyPoints, object, trueCallback, falseCallback) {
    // Get object's Object class.
    const objectClass = getObjectByUID(object.uid);

    if (objectClass) {
        objectClass.hovered = false; // Reset it everytime you call it.

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
                continue; // bodyPoint is not detected.
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
                objectClass.hovered = true;
            }
        }

        if (objectClass.hovered) {
            trueCallback();
            return true;
        } else {
            falseCallback(); // bodyPoint is not touching the object.
            return false;
        }

    } else {
        falseCallback(); // Object doesn't exist?
        return false;
    }
}

function userClicksObject(bodyPoints, object, trueCallback, drawingAnimation) {
    // Get object's Object class.
    const objectClass = getObjectByUID(object.uid);

    if (objectClass) {
        for (var bodyPointIndex = 0; bodyPointIndex < bodyPoints.length; bodyPointIndex++) {
            var bodyPoint = bodyPoints[bodyPointIndex];
            let landmarkPoint = landmarkPoints[bodyPoint];

            let x, y;
            let leftOrRight = false;

            if (userTouchesObject([bodyPoint], object, () => { }, () => { })) {
                if (landmarkStyles[bodyPoint].continueGrowing) {
                    landmarkStyles[bodyPoint].landmarkRadius += 0.5;
                } else {
                    landmarkStyles[bodyPoint].landmarkRadius = 0.0;
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
                    leftOrRight = "left";
                } else if (bodyPoint == "rightIndexTip" && mpResults.rightHandLandmarks) {
                    x = map(mpResults.rightHandLandmarks[landmarkPoint].x, 0, 1, 0, canvasElement.clientWidth);
                    y = map(mpResults.rightHandLandmarks[landmarkPoint].y, 0, 1, 0, canvasElement.clientHeight);
                    radius = drawingUtils.lerp(mpResults.rightHandLandmarks[landmarkPoint].z, -0.15, .1, 10, 1);
                    leftOrRight = "right";
                } else {
                    continue; // This is really a continue.
                }

                if (drawingAnimation) {
                    if (drawingAnimation == "drawOuterCircle") {
                        drawOuterCircle(x, y, radius + landmarkStyles[bodyPoint].landmarkRadius, "transparent", landmarkStyles[bodyPoint].color);
                    }
                }

                if (!objectClass.selected && landmarkStyles[bodyPoint].landmarkRadius > 10) {
                    objectClass.selected = true;
                    landmarkStyles[bodyPoint].color = "blue";
                    landmarkStyles[bodyPoint].fillColor = "blue";
                    if (leftOrRight) {
                        let generalWord;
                        if (leftOrRight == "left") {
                            generalWord = bodyPoint.replace('left', '');
                        } else {
                            generalWord = bodyPoint.replace('right', '');
                        }
                        generalWord = generalWord.charAt(0).toLowerCase() + generalWord.slice(1);
                        console.log(generalWord);
                        landmarkStyles[generalWord].color = "blue";
                        landmarkStyles[generalWord].fillColor = "blue";
                    }
                } else if (landmarkStyles[bodyPoint].continueGrowing && objectClass.selected) {
                    landmarkStyles[bodyPoint].landmarkRadius -= 2.5;
                    if (landmarkStyles[bodyPoint].landmarkRadius <= 0.0) {
                        landmarkStyles[bodyPoint].landmarkRadius = 0.0;
                        landmarkStyles[bodyPoint].continueGrowing = false;
                    }
                }
            } else {
                landmarkStyles[bodyPoint].color = "red";
                landmarkStyles[bodyPoint].fillColor = "red";
                landmarkStyles[bodyPoint].landmarkRadius = 0.0;
                landmarkStyles[bodyPoint].continueGrowing = true;

                if (leftOrRight) {
                    let generalWord;
                    if (leftOrRight == "left") {
                        generalWord = bodyPoint.replace('left', '');
                    } else {
                        generalWord = bodyPoint.replace('right', '');
                    }
                    generalWord = generalWord.charAt(0).toLowerCase() + generalWord.slice(1);
                    landmarkStyles[generalWord].color = "red";
                    landmarkStyles[generalWord].fillColor = "red";
                }
            }
        }

        if (objectClass.selected) {
            trueCallback();
            return true;
        } else {
            return false;
        }
    }

    return false; // Object doesn't exist?
}

function userDragsAndDropsObject(object, pickUpCallback, dragCallback, dropCallback) {
    // Get object's Object class.
    const objectClass = getObjectByUID(object.uid);

    if (objectClass) {
        if (!objectClass.userWantsToPickUpObject && !objectClass.userPickedUpObject) {
            if (userOpensHand()) {
                userTouchesObject(landmarkAreas.palm, object, () => {
                    // User wants to pick up object, must close palm now.
                    console.log("wants to pick up");
                    objectClass.userWantsToPickUpObject = true;
                    objectClass.selected = false;
                }, () => { }, () => { });
            }
        } else if (objectClass.userWantsToPickUpObject && !objectClass.userPickedUpObject) {
            if (!userTouchesObject(landmarkAreas.palm, object, () => { }, () => { })) {
                objectClass.userWantsToPickUpObject = false;
                return;
            }

            if (userClosesHand()) {
                userTouchesObject(landmarkAreas.palm, object, () => {
                    // User wants to pick up object, must close palm now.
                    console.log("picked up");
                    objectClass.userPickedUpObject = true;
                    pickUpCallback();
                }, () => { }, () => { });
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

    // console.log(centerPoint);
    var x = centerPoint.x;
    var y = centerPoint.y;

    let objectDimensions = object.getBoundingClientRect();
    var objectWidth = objectDimensions.width / 2;
    var objectHeight = objectDimensions.height / 2;

    object.style.position = "absolute";
    object.style.left = (x - objectWidth) + "px";
    object.style.top = (y - objectHeight) + "px";

}