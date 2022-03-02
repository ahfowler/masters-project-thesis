const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
canvasElement.width = $("#example-application").width();
canvasElement.height = $(window).height();

const canvasCtx = canvasElement.getContext('2d');

const mpHolistic = window;
const drawingUtils = window;

var model;
var predictions;
var mpResults;

var videoLoaded = false;


async function onResults(results) {
    if (!videoLoaded) {
        model = await handpose.load();
        videoLoaded = true;
    }

    // Pass in a video stream (or an image, canvas, or 3D tensor) to obtain a
    // hand prediction from the MediaPipe graph.
    predictions = await model.estimateHands(document.querySelector("video"), false);
    mpResults = results;
    socket.emit('recievedMPResults', results); // Send the results to mobile phone.

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    if (results.poseLandmarks) {
        // Pose...
        drawingUtils.drawConnectors(
            canvasCtx, results.poseLandmarks, mpHolistic.POSE_CONNECTIONS,
            { color: '#36536d', lineWidth: 3 });
        drawingUtils.drawLandmarks(
            canvasCtx,
            mpHolistic.POSE_LANDMARKS_LEFT,
            {
                color: '#36536d',
                fillColor: '#36536d',
                lineWidth: 3,
                radius: (data) => {
                    return drawingUtils.lerp(data.from.z, -0.15, .1, 10, 1);
                }
            });
        drawingUtils.drawLandmarks(
            canvasCtx,
            mpHolistic.POSE_LANDMARKS_RIGHT,
            {
                color: '#36536d',
                fillColor: '#36536d',
                lineWidth: 3,
                radius: (data) => {
                    return drawingUtils.lerp(data.from.z, -0.15, .1, 10, 1);
                }
            });
    }

    // Face...
    if (results.faceLandmarks) {
        drawingUtils.drawConnectors(
            canvasCtx, results.faceLandmarks, mpHolistic.FACEMESH_TESSELATION,
            { color: '#36536d', lineWidth: 3 });
        drawingUtils.drawConnectors(
            canvasCtx, results.faceLandmarks, mpHolistic.FACEMESH_RIGHT_EYE,
            { color: '#36536d', lineWidth: 3 });
        drawingUtils.drawConnectors(
            canvasCtx, results.faceLandmarks, mpHolistic.FACEMESH_RIGHT_EYEBROW,
            { color: '#36536d', lineWidth: 3 });
        drawingUtils.drawConnectors(
            canvasCtx, results.faceLandmarks, mpHolistic.FACEMESH_LEFT_EYE,
            { color: '#36536d', lineWidth: 3 });
        drawingUtils.drawConnectors(
            canvasCtx, results.faceLandmarks, mpHolistic.FACEMESH_LEFT_EYEBROW,
            { color: '#36536d', lineWidth: 3 });
        drawingUtils.drawConnectors(
            canvasCtx, results.faceLandmarks, mpHolistic.FACEMESH_FACE_OVAL,
            { color: '#36536d', lineWidth: 3 });
        drawingUtils.drawConnectors(
            canvasCtx, results.faceLandmarks, mpHolistic.FACEMESH_LIPS,
            { color: '#36536d', lineWidth: 3 });
    }

    if (results.rightHandLandmarks) {
        drawingUtils.drawConnectors(
            canvasCtx, results.rightHandLandmarks, mpHolistic.HAND_CONNECTIONS,
            { color: '#36536d', lineWidth: 3 });

        drawingUtils.drawLandmarks(canvasCtx, results.rightHandLandmarks, {
            color: '#36536d',
            fillColor: '#36536d',
            lineWidth: 3,
            radius: (data) => {
                return drawingUtils.lerp(data.from.z, -0.15, .1, 10, 1);
            }
        });
    }

    if (results.leftHandLandmarks) {
        drawingUtils.drawConnectors(
            canvasCtx, results.leftHandLandmarks, mpHolistic.HAND_CONNECTIONS,
            { color: '#36536d', lineWidth: 3 });

        drawingUtils.drawLandmarks(canvasCtx, results.leftHandLandmarks, {
            color: '#36536d',
            fillColor: '#36536d',
            lineWidth: 3,
            radius: (data) => {
                return drawingUtils.lerp(data.from.z, -0.15, .1, 10, 1);
            }
        });
    }

    canvasCtx.restore();
}

const holistic = new Holistic({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
    }
});

holistic.setOptions({
    selfieMode: true,
    modelComplexity: 1,
    smoothLandmarks: true,
    enableSegmentation: false,
    smoothSegmentation: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.8,
    effect: 'background',
});

holistic.onResults(onResults);

const camera = new Camera(videoElement, {
    onFrame: async () => {
        await holistic.send({ image: videoElement });
    },
    width: 1280,
    height: 720,
});
videoElement.classList.add('selfie');
camera.start();

