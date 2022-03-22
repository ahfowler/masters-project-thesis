import { MediaPipe } from "../js/mediapipe.js"
import { LANDMARK_AREAS, LANDMARK_NAMES, LANDMARK_POINTS } from '../js/global.js'

class DOMElement {
    constructor(uuid, domElement) {
        this.id = uuid;
        this.htmlElement = domElement;
        this.selected = false;
        this.hovered = false;
        this.userWantsToPickUpElement = false;
        this.userPickedUpElement = false;
    }
}

class Cursor {
    x;
    y;

    constructor() {
        this.x = 0;
        this.y = 0;
    }
}

export class Gesture {
    globalElements = []; // A list of elements on the DOM.
    cursor; // Reference for the user's cursor.
    mediapipe; // Reference to MediaPipe engine.

    constructor(applicationElementID) { // Default constructor.
        // Step 0: Add the nessessary CDNs. Better way to bundle?

        // Step 1: Assign UUIDs to all the elements on the DOM for easy access.
        var allElements = document.getElementsByTagName("*"); // Get all the elements on the DOM.
        for (var i = 0, max = allElements.length; i < max; i++) {
            allElements[i].uuid = uuid.v4(); // Generate a UUID for the element.
            this.globalElements.push(new DOMElement(allElements[i].uuid), allElements[i]); // Add element to list of global elements.
        }

        // Step 2: Create a cursor reference.
        this.cursor = new Cursor();

        // Step 3: Restructure the DOM for MediaPipe.
        let applicationElement = document.getElementById(applicationElementID);

        let container = "<div id='container'></div>";
        let inputVideo = "<video id='input-video'></video>";
        let canvasContainer = "<div id='canvas-container'></div>";
        let canvas = "<canvas id='output-canvas' width='1280px' height='720px'></canvas>"

        document.body.innerHTML = container;
        document.getElementById("container").innerHTML = inputVideo + canvasContainer;
        document.getElementById("canvas-container").innerHTML = canvas;
        document.getElementById("container").appendChild(applicationElement);

        // Step 4: Turn on MediaPipe.
        let videoElement = document.getElementById("input-video");
        let canvasElement = document.getElementById("output-canvas");

        // onResults() is a function that returns the Holistic landmarks.
        this.mediapipe = new MediaPipe(videoElement, canvasElement);
        this.mediapipe.holisticSettings.onResults(async (results) => {
            this.mediapipe.onResults(results);
        });
    }

    // ---------------------------------------- Helper Methods ----------------------------------------

    // Return the DOMElement with the given UUID.
    getElementByUUID(uuid) {
        let result = this.globalElements.filter(function (element) { return element.id == uuid; });
        return result ? result[0] : null; // or undefined
    }

    // Move an element on the DOM.
    moveObject(object, bodyPoints) {
        // Define the map function.
        function map(a, in_min, in_max, out_min, out_max) {
            return (a - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
        }

        var bodyPointCoordinates = [];

        for (var bodyPointIndex = 0; bodyPointIndex < bodyPoints.length; bodyPointIndex++) {
            var bodyPoint = bodyPoints[bodyPointIndex];
            let landmarkPoint = LANDMARK_POINTS[bodyPoint];

            let x, y;

            if ((bodyPoint == "bottomPalm" || bodyPoint == "bottomIndex" || bodyPoint == "bottomMiddle" || bodyPoint == "bottomRing" || bodyPoint == "bottomPinky") && (this.mediapipe.mpResults.leftHandLandmarks || this.mediapipe.mpResults.rightHandLandmarks)) {
                if (this.mediapipe.mpResults.leftHandLandmarks) {
                    x = map(this.mediapipe.mpResults.leftHandLandmarks[landmarkPoint].x, 0, 1, 0, this.mediapipe.canvasElement.clientWidth);
                    y = map(this.mediapipe.mpResults.leftHandLandmarks[landmarkPoint].y, 0, 1, 0, this.mediapipe.canvasElement.clientHeight);
                } else {
                    x = map(this.mediapipe.mpResults.rightHandLandmarks[landmarkPoint].x, 0, 1, 0, this.mediapipe.canvasElement.clientWidth);
                    y = map(this.mediapipe.mpResults.rightHandLandmarks[landmarkPoint].y, 0, 1, 0, this.mediapipe.canvasElement.clientHeight);
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

        // this.mediapipe.canvasCtx.beginPath();
        // this.mediapipe.canvasCtx.arc(x,y,3,0,2*Math.PI);
        // this.mediapipe.canvasCtx.strokeColor = "#EEEEEE";
        // this.mediapipe.canvasCtx.stroke();

        this.cursor.x = centerPoint.x;
        this.cursor.y = centerPoint.y;

        let objectDimensions = object.getBoundingClientRect();

        object.style.position = "absolute";
        object.style.left = (x - objectDimensions.width) + "px";
        // object.style.top = (y - (objectDimensions.height) + "px"; Need to fix?
    }

    // ---------------------------------------- Client Methods ----------------------------------------

    // Body Part Detections ---------------------------------------------------------------------------
    onFace(callback) {
        console.log("Setting onFace()...");
        this.mediapipe._faceLandmarksCallback = callback;
    }

    onPose(callback) {
        console.log("Setting onPose()...");
        this.mediapipe._poseLandmarksCallback = callback;
    }

    onLeftHand(callback) {
        console.log("Setting onLeftHand()...");
        this.mediapipe._leftHandLandmarksCallback = callback;
    }

    onRightHand(callback) {
        console.log("Setting onRightHand()...");
        this.mediapipe._rightHandLandmarksCallback = callback;
    }

    onHands(callback) {
        this.mediapipe._onHandLandmarksCallback = callback;
    }

    // Interactions -----------------------------------------------------------------------------

    userHoversObject(bodyPoints, element, trueCallback, falseCallback) {
        // Define the map function.
        function map(a, in_min, in_max, out_min, out_max) {
            return (a - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
        }

        // Get element's DOMElement class.
        const elementClass = this.getElementByUUID(element.uuid);

        if (elementClass) {
            elementClass.hovered = false; // Reset it everytime you call it.

            for (var bodyPointIndex = 0; bodyPointIndex < bodyPoints.length; bodyPointIndex++) {
                var bodyPoint = bodyPoints[bodyPointIndex];
                let landmarkPoint = LANDMARK_POINTS[bodyPoint];

                let x, y;

                if ((bodyPoint == "indexTip" || bodyPoint == "ringTip" || bodyPoint == "middleTip" || bodyPoint == "pinkyTip" || bodyPoint == "thumbTip" || bodyPoint == "bottomPalm" || bodyPoint == "bottomIndex" || bodyPoint == "bottomMiddle" || bodyPoint == "bottomRing" || bodyPoint == "bottomPinky")
                    && this.mediapipe.mpResults.leftHandLandmarks) {
                    x = map(this.mediapipe.mpResults.leftHandLandmarks[landmarkPoint].x, 0, 1, 0, this.mediapipe.canvasElement.clientWidth);
                    y = map(this.mediapipe.mpResults.leftHandLandmarks[landmarkPoint].y, 0, 1, 0, this.mediapipe.canvasElement.clientHeight);
                } else if ((bodyPoint == "indexTip" || bodyPoint == "ringTip" || bodyPoint == "middleTip" || bodyPoint == "pinkyTip" || bodyPoint == "thumbTip" || bodyPoint == "bottomPalm" || bodyPoint == "bottomIndex" || bodyPoint == "bottomMiddle" || bodyPoint == "bottomRing" || bodyPoint == "bottomPinky")
                    && this.mediapipe.mpResults.rightHandLandmarks) {
                    x = map(this.mediapipe.mpResults.rightHandLandmarks[landmarkPoint].x, 0, 1, 0, this.mediapipe.canvasElement.clientWidth);
                    y = map(this.mediapipe.mpResults.rightHandLandmarks[landmarkPoint].y, 0, 1, 0, this.mediapipe.canvasElement.clientHeight);
                } else {
                    continue; // bodyPoint is not detected.
                }

                // console.log(x, y);

                this.cursor.x = x;
                this.cursor.y = y;

                let objectDimensions = element.getBoundingClientRect();

                var position = {
                    x1: objectDimensions.x,
                    x2: objectDimensions.x + objectDimensions.width,
                    y1: objectDimensions.y,
                    y2: objectDimensions.y + objectDimensions.height
                }

                if (x > position.x1 && x < position.x2 && y > position.y1 && y < position.y2) {
                    elementClass.hovered = true;
                }
            }

            if (elementClass.hovered) {
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

    userDragsAndDropsObject(object, pickUpCallback, dragCallback, dropCallback) {
        // Get object's Object class.
        const elementClass = this.getElementByUUID(object.uuid);

        if (elementClass) {
            if (!elementClass.userWantsToPickUpObject && !elementClass.userPickedUpObject) {
                if (this.isMakingGesture("openHand")) {
                    this.userHoversObject(LANDMARK_AREAS.palm, object, () => {
                        // User wants to pick up object, must close palm now.
                        elementClass.userWantsToPickUpObject = true;
                    }, () => { }, () => { });
                }
            } else if (elementClass.userWantsToPickUpObject && !elementClass.userPickedUpObject) {
                if (!this.userHoversObject(LANDMARK_AREAS.palm, object, () => { }, () => { })) {
                    elementClass.userWantsToPickUpObject = false;
                    return;
                }

                if (this.isMakingGesture("closedHand")) {
                    this.userHoversObject(LANDMARK_AREAS.palm, object, () => {
                        // User wants to pick up object, must close palm now.
                        elementClass.userPickedUpObject = true;
                        pickUpCallback();
                    }, () => { }, () => { });
                }
            } else if (elementClass.userWantsToPickUpObject && elementClass.userPickedUpObject) {
                if (this.isMakingGesture("closedHand")) {
                    dragCallback();
                    this.moveObject(object, LANDMARK_AREAS.palm);
                } else if (this.isMakingGesture("openHand"), LANDMARK_AREAS.palm) {
                    dropCallback();
                    elementClass.selected = false;
                    elementClass.userWantsToPickUpObject = false;
                    elementClass.userPickedUpObject = false;
                }
            }
        }
    }

    // Gestures ---------------------------------------------------------------------------------
    isMakingGesture(gestureName) {
        return this.mediapipe.currentGestures[gestureName];
    }

    // Landmark Styles --------------------------------------------------------------------------
    styleFaceLandmarks(fillColor, borderColor, borderWidth, connectorColor, connectorWidth) {
        console.log("Styling face landmarks...");
        this.mediapipe.styleFaceLandmarks(fillColor, borderColor, borderWidth, connectorColor, connectorWidth);
    }

    stylePoseLandmarks(fillColor, borderColor, borderWidth, connectorColor, connectorWidth) {
        console.log("Styling pose landmarks...");
        this.mediapipe.stylePoseLandmarks(fillColor, borderColor, borderWidth, connectorColor, connectorWidth);
    }

    styleLeftHandLandmarks(fillColor, borderColor, borderWidth, connectorColor, connectorWidth) {
        console.log("Styling left hand landmarks...");
        this.mediapipe.styleLeftHandLandmarks(fillColor, borderColor, borderWidth, connectorColor, connectorWidth);
    }

    styleRightHandLandmarks(fillColor, borderColor, borderWidth, connectorColor, connectorWidth) {
        console.log("Styling right hand landmarks...");
        this.mediapipe.styleRightHandLandmarks(fillColor, borderColor, borderWidth, connectorColor, connectorWidth);
    }

    // Miscellaneous Settings -------------------------------------------------------------------
    showCamera() {
        console.log("Showing camera...");

        let inputVideo = document.getElementById("input-video");
        inputVideo.style.display = "block";
        inputVideo.style.position = "fixed";
        inputVideo.style.zIndex = -100;
        inputVideo.style.height = "100%";
        inputVideo.style.width = "100%";
    }

    onLoad(callback) {
        this.mediapipe.onLoad(callback);
    }
}