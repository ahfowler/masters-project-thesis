import { MediaPipe } from "../js/mediapipe.js"

class DOMElement {
    constructor(uuid) {
        this.id = uuid;
        this.selected = false;
        this.hovered = false;
        this.landmarkRadius = 0.0;
        this.continueGrowing = true;
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

    loaded;

    constructor() { // Default constructor.
        // Step 1: Assign UUIDs to all the elements on the DOM for easy access.
        var allElements = document.getElementsByTagName("*"); // Get all the elements on the DOM.
        for (var i = 0, max = allElements.length; i < max; i++) {
            allElements[i].uuid = uuid.v4(); // Generate a UUID for the element.
            this.globalElements.push(new DOMElement(allElements[i].uuid)); // Add element to list of global elements.
        }

        // Step 2: Create a cursor reference.
        this.cursor = new Cursor();
    }

    // ---------------------------------------- Helper Methods ----------------------------------------

    // Return the DOMElement with the given UUID.
    getElementByUUID(uuid) {
        let result = globalElements.filter(function (element) { return element.id == uuid; });
        return result ? result[0] : null; // or undefined
    }

    // ---------------------------------------- Methods ----------------------------------------

    // Create a default MediaPipe enviroment.
    async gesturize(applicationElementID) {
        // Step 0: Add the nessessary CDNs. Better way to bundle?

        let head = document.getElementsByTagName('head')[0];
        let nessessaryCDNS = [
            "https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js",
            "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js",
            "https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js",
            "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js",
            "https://cdn.jsdelivr.net/npm/@mediapipe/holistic/holistic.js",
            "https://unpkg.com/@tensorflow/tfjs-core@3.7.0/dist/tf-core.js",
            "https://unpkg.com/@tensorflow/tfjs-converter@3.7.0/dist/tf-converter.js",
            "https://unpkg.com/@tensorflow/tfjs-backend-webgl@3.7.0/dist/tf-backend-webgl.js",
            "https://unpkg.com/@tensorflow-models/handpose@0.0.7/dist/handpose.js",
            "https://cdn.jsdelivr.net/npm/fingerpose@0.1.0/dist/fingerpose.min.js"
        ];
        let loadedCDNS = 0;

        var script;
        for (var i = 0; i < nessessaryCDNS.length; i++) {
            script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = nessessaryCDNS[i];
            script.crossOrigin = "anonymous";

            script.onload = function () {
                loadedCDNS++;
            };

            head.appendChild(script);
        }

        let checkCDNs = setInterval(function () {
            if (loadedCDNS == nessessaryCDNS.length) {
                console.log("CDNs have loaded...");
                clearInterval(checkCDNs);
                // Step 1: Restructure the DOM for MediaPipe.
                let applicationElement = document.getElementById(applicationElementID);

                let container = "<div id='container'></div>";
                let inputVideo = "<video id='input-video'></video>";
                let canvasContainer = "<div id='canvas-container'></div>";
                let canvas = "<canvas id='output-canvas' width='1280px' height='720px'></canvas>"

                document.body.innerHTML = container;
                document.getElementById("container").innerHTML = inputVideo + canvasContainer;
                document.getElementById("canvas-container").innerHTML = canvas;
                document.getElementById("container").appendChild(applicationElement);

                // Step 2: Turn on MediaPipe.
                let videoElement = document.getElementById("input-video");
                let canvasElement = document.getElementById("output-canvas");

                // onResults() is a function that returns the Holistic landmarks.
                this.mediapipe = new MediaPipe(videoElement, canvasElement);
                this.mediapipe.holisticSettings.onResults(async (results) => {
                    this.mediapipe.onResults(results);
                });
            } else {
                console.log("CDNs still loading...", this.loaded);
            }
        }, 1000);
    }

    onFace(callback) {
        console.log("Setting onFace()...");
        if (this.mediapipe) {
            this.mediapipe.onFace(callback);
        } else {
            // Wait until MediaPipe has loaded.
            let checkMediaPipe = setInterval(function () {
                if (this.mediapipe) {
                    console.log("MediaPipe has loaded...");
                    clearInterval(checkMediaPipe);
                    this.mediapipe.onFace(callback);
                } else {
                    console.log("MediaPipe still loading...", this.loaded);
                }
            }, 1000);
        }
    }

    onPose(callback) {
        console.log("Setting onPose()...");
        if (this.mediapipe) {
            this.mediapipe.onPose(callback);
        } else {
            // Wait until MediaPipe has loaded.
            let checkMediaPipe = setInterval(function () {
                if (this.mediapipe) {
                    console.log("MediaPipe has loaded...");
                    clearInterval(checkMediaPipe);
                    this.mediapipe.onPose(callback);
                } else {
                    console.log("MediaPipe still loading...", this.loaded);
                }
            }, 1000);
        }
    }

    onLeftHand(callback) {
        console.log("Setting onLeftHand()...");
        if (this.mediapipe) {
            this.mediapipe.onLeftHand(callback);
        } else {
            // Wait until MediaPipe has loaded.
            let checkMediaPipe = setInterval(function () {
                if (this.mediapipe) {
                    console.log("MediaPipe has loaded...");
                    clearInterval(checkMediaPipe);
                    this.mediapipe.onLeftHand(callback);
                } else {
                    console.log("MediaPipe still loading...", this.loaded);
                }
            }, 1000);
        }
    }

    onRightHand(callback) {
        console.log("Setting onRightHand()...");
        if (this.mediapipe) {
            this.mediapipe.onRightHand(callback);
        } else {
            // Wait until MediaPipe has loaded.
            let checkMediaPipe = setInterval(function () {
                if (this.mediapipe) {
                    console.log("MediaPipe has loaded...");
                    clearInterval(checkMediaPipe);
                    this.mediapipe.onRightHand(callback);
                } else {
                    console.log("MediaPipe still loading...", this.loaded);
                }
            }, 1000);
        }
    }
}