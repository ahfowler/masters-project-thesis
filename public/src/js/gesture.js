import { MediaPipe } from "../js/mediapipe.js"

class DOMElement {
    constructor(uuid) {
        this.id = uuid;
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
            this.globalElements.push(new DOMElement(allElements[i].uuid)); // Add element to list of global elements.
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
        let result = globalElements.filter(function (element) { return element.id == uuid; });
        return result ? result[0] : null; // or undefined
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
        this.mediapipe._rightHandLandmarksCallback = callback;
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
}