export class MediaPipe {
    // Important DOM Elements...
    videoElement;
    canvasElement;
    canvasCtx;

    // MediaPipe Holisitic Variables...
    mpHolistic;
    holisticSettings;

    // Tensor Flow HandPose Variables...
    model;
    predictions;

    // MediaPipe Tools and Libraries
    camera;
    drawingUtils;
    videoLoaded = false;

    // The Good Stuff!
    mpResults; // Holistic Landmarks
    _faceLandmarksCallback;
    _poseLandmarksCallback;
    _leftHandLandmarksCallback;
    _rightHandLandmarksCallback;

    

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
            smoothLandmarks: true,
            enableSegmentation: false,
            smoothSegmentation: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.8,
            effect: 'background',
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

        if (faceLandmarks && this._faceLandmarksCallback) {
           this._faceLandmarksCallback();
        }

        if (pose3DLandmarks && pose2DLandmarks && this._poseLandmarksCallback) {
            this._poseLandmarksCallback();
        }

        if (leftHandLandmarks && this._leftHandLandmarksCallback) {
           this._leftHandLandmarksCallback();
        }

        if (rightHandLandmarks && this._rightHandLandmarksCallback) {
            this._rightHandLandmarksCallback();
        }

        this.canvasCtx.restore();
    }

    onFace(callback) {
        this._faceLandmarksCallback = callback;
    }

    onPose(callback) {
        this._poseLandmarksCallback = callback;
    }

    onLeftHand(callback) {
        this._leftHandLandmarksCallback = callback;
    }

    onRightHand(callback) {
        this._rightHandLandmarksCallback = callback;
    }
}