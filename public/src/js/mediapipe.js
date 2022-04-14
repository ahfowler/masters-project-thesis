import { LANDMARK_AREAS, LANDMARK_NAMES, LANDMARK_POINTS, updateGestures } from '../js/global.js'

export class MediaPipe {
    // Important DOM Elements...
    videoElement;
    canvasElement;
    canvasCtx;

    // MediaPipe Holisitic Variables...
    mpHolistic = window;
    holisticSettings = window;

    // Tensor Flow HandPose Variables...
    model;
    predictions;

    // MediaPipe Tools and Libraries
    camera;
    drawingUtils;
    videoLoaded = false;
    onloadCallbackCalled = false;
    _onLoadCallback;
    _onEmitResults;

    // The Good Stuff!
    mpResults; // Holistic Landmarks
    _faceLandmarksCallback;
    _poseLandmarksCallback;
    _leftHandLandmarksCallback;
    _rightHandLandmarksCallback;

    _onHandLandmarksCallback;

    _faceLandmarksStyling;
    _poseLandmarksStyling;
    _leftHandLandmarksStyling;
    _rightHandLandmarksStyling;

    currentGestures = {
        "openHand": false,
        "closedHand": false
    }

    constructor(video, canvas) {
        // Step 1: Assign video and canvas elements.
        this.videoElement = video;
        this.canvasElement = canvas;

        this.canvasElement.width = $(window).width();
        this.canvasElement.height = $(window).height();

        this.canvasCtx = this.canvasElement.getContext('2d');

        // Step 2: Step up helper libraries from MediaPipe.
        this.mpHolistic = window;
        this.drawingUtils = window;

        // Step 3: Set up Holistic Model.
        this.holisticSettings = new Holistic({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
            }
        });

        this.holisticSettings.setOptions({
            selfieMode: true,
            modelComplexity: 1,
            minDetectionConfidence: 0.8,
            minTrackingConfidence: 0.8,
            smoothLandmarks: true,
            smoothSegmentation: true,
            refineFaceLandmarks: true,
            enableSegmentation: true
        });

        this.holisticSettings.onResults();

        // Step 4: Turn on the camera.
        this.camera = new Camera(this.videoElement, {
            onFrame: async () => {
                await this.holisticSettings.send({ image: this.videoElement });
            },
            width: 1280,
            height: 720,
        });
        this.videoElement.classList.add('selfie'); // Change to selfie mode.
        this.camera.start();
    }

    async onResults(results) {
        if (!this.videoLoaded) {
            if (this._onLoadCallback && !this.onloadCallbackCalled) {
                this._onLoadCallback();
                this.onloadCallbackCalled = true;
            }
            this.model = await handpose.load(); // Load the HandPose Model from TensorFlow.
            this.videoLoaded = true;
        }

        // Collect the results.
        this.predictions = await this.model.estimateHands(document.querySelector("video"), false);
        this.mpResults = results;

        const faceLandmarks = results.faceLandmarks;
        const pose3DLandmarks = results.ea;
        const pose2DLandmarks = results.poseLandmarks;
        const leftHandLandmarks = results.rightHandLandmarks;
        const rightHandLandmarks = results.leftHandLandmarks;

        this.canvasCtx.save();
        this.canvasCtx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);

        this.currentGestures = updateGestures(this.predictions);

        if (faceLandmarks) { // If we see face data...
            if (this._faceLandmarksStyling) {
                this._faceLandmarksStyling(results);
            }

            if (this._faceLandmarksCallback) {
                this._faceLandmarksCallback(faceLandmarks);
            }
        }

        if (pose3DLandmarks && pose2DLandmarks) { // If we see pose data...
            if (this._poseLandmarksStyling) {
                this._poseLandmarksStyling(results);
            }

            if (this._poseLandmarksCallback) {
                this._poseLandmarksCallback(pose2DLandmarks, pose3DLandmarks);
            }
        }

        if (leftHandLandmarks || rightHandLandmarks) { // If we see any hand data...

            if (this._leftHandLandmarksStyling) {
                this._leftHandLandmarksStyling(results);
            }

            if (this._rightHandLandmarksStyling) {
                this._rightHandLandmarksStyling(results);
            }

            if (leftHandLandmarks || rightHandLandmarks) { // If we see both hands data...
                if (this._onHandLandmarksCallback) {
                    this._onHandLandmarksCallback(leftHandLandmarks, rightHandLandmarks);
                }
            }

            if (leftHandLandmarks) { // If we see left hands data...
                if (this._leftHandLandmarksCallback) {
                    this._leftHandLandmarksCallback(leftHandLandmarks);
                }
            }

            if (rightHandLandmarks) { // If we see right hands data...
                if (this._rightHandLandmarksCallback) {
                    this._rightHandLandmarksCallback(rightHandLandmarks);
                }
            }
        }

        if (this._onEmitCallback) {
            this._onEmitCallback();
        }

        this.canvasCtx.restore();
    }

    styleFaceLandmarks(fillColor, borderColor, borderWidth, connectorColor, connectorWidth) {
        let styleFunction = function (results) {
            this.drawingUtils.drawConnectors(this.canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION, {
                color: connectorColor ? connectorColor : "transparent",
                lineWidth: connectorWidth ? connectorWidth : 0
            });

            this.drawingUtils.drawLandmarks(this.canvasCtx, results.faceLandmarks, {
                color: borderColor ? borderColor : "transparent",
                fillColor: fillColor ? fillColor : "transparent",
                lineWidth: borderWidth ? borderWidth : 0,
                radius: (data) => {
                    return this.drawingUtils.lerp(data.from.z, -0.15, .1, 10, 1);
                }
            });
        };
        this._faceLandmarksStyling = styleFunction;
    }

    stylePoseLandmarks(fillColor, borderColor, borderWidth, connectorColor, connectorWidth) {
        let styleFunction = function (results) {
            this.drawingUtils.drawConnectors(this.canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
                color: connectorColor ? connectorColor : "transparent",
                lineWidth: connectorWidth ? connectorWidth : 0
            });

            this.drawingUtils.drawLandmarks(this.canvasCtx, results.poseLandmarks, {
                color: borderColor ? borderColor : "transparent",
                fillColor: fillColor ? fillColor : "transparent",
                lineWidth: borderWidth ? borderWidth : 0,
                radius: (data) => {
                    return this.drawingUtils.lerp(data.from.z, -0.15, .1, 10, 1);
                }
            });
        };
        this._poseLandmarksStyling = styleFunction;
    }

    styleLeftHandLandmarks(fillColor, borderColor, borderWidth, connectorColor, connectorWidth) {
        let styleFunction = function (results) {
            this.drawingUtils.drawConnectors(this.canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS, {
                color: connectorColor ? connectorColor : "transparent",
                lineWidth: connectorWidth ? connectorWidth : 0
            });

            this.drawingUtils.drawLandmarks(this.canvasCtx, results.rightHandLandmarks, {
                color: borderColor ? borderColor : "transparent",
                fillColor: fillColor ? fillColor : "transparent",
                lineWidth: borderWidth ? borderWidth : 0,
                radius: (data) => {
                    return this.drawingUtils.lerp(data.from.z, -0.15, .1, 10, 1);
                }
            });
        };
        this._leftHandLandmarksStyling = styleFunction;
    }

    styleRightHandLandmarks(fillColor, borderColor, borderWidth, connectorColor, connectorWidth) {
        let styleFunction = function (results) {
            this.drawingUtils.drawConnectors(this.canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS, {
                color: connectorColor ? connectorColor : "transparent",
                lineWidth: connectorWidth ? connectorWidth : 0
            });

            this.drawingUtils.drawLandmarks(this.canvasCtx, results.leftHandLandmarks, {
                color: borderColor,
                fillColor: fillColor,
                lineWidth: borderWidth,
                radius: (data) => {
                    return this.drawingUtils.lerp(data.from.z, -0.15, .1, 10, 1);
                }
            });
        };
        this._rightHandLandmarksStyling = styleFunction;
    }

    onLoad(callback) {
        this._onLoadCallback = callback;
    }
}