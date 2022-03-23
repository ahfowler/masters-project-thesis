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

    predictions = await model.estimateHands(document.querySelector("video"), false);
    mpResults = results;

    // Draw landmarks for the person.
    drawResults(results);

    // Solve KalidoKit.
    // Take the results from `Holistic` and animate character based on its Face, Pose, and Hand Keypoints.

    const faceLandmarks = results.faceLandmarks;
    // Pose 3D Landmarks are with respect to Hip distance in meters
    const pose3DLandmarks = results.ea;
    // Pose 2D landmarks are with respect to videoWidth and videoHeight
    const pose2DLandmarks = results.poseLandmarks;
    // Be careful, hand landmarks may be reversed
    const leftHandLandmarks = results.rightHandLandmarks;
    const rightHandLandmarks = results.leftHandLandmarks;

    let riggedCharacter = {};

    // Animate Face
    if (faceLandmarks) {
        riggedCharacter.riggedFace = Kalidokit.Face.solve(faceLandmarks, {
            runtime: "mediapipe",
            video: videoElement,
            imageSize: { height: 0, width: 0 },
            smoothBlink: true, // smooth left and right eye blink delays
            blinkSettings: [0.25, 0.75], // adjust upper and lower bound blink sensitivit
        });
    }

    // Animate Pose
    if (pose2DLandmarks && pose3DLandmarks) {
        riggedCharacter.riggedPose = Kalidokit.Pose.solve(pose3DLandmarks, pose2DLandmarks, {
            runtime: "mediapipe",
            video: videoElement,
            imageSize: { height: 0, width: 0 },
            enableLegs: true,
        });
    }

    // Animate Hands
    if (leftHandLandmarks) {
        riggedCharacter.riggedLeftHand = Kalidokit.Hand.solve(leftHandLandmarks, "Left");
    }

    if (rightHandLandmarks) {
        riggedCharacter.riggedRightHand = Kalidokit.Hand.solve(rightHandLandmarks, "Right");
    }

    socket.emit('recievedMPResults', results, socketID); // Send the results to mobile phone.
    socket.emit('recievedRiggedData', riggedCharacter, socketID); // Send the rig data to mobile phone.

    canvasCtx.restore();
}

const holistic = new Holistic({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
    }
});

holistic.setOptions({
    selfieMode: false,
    modelComplexity: 1,
    minDetectionConfidence: 0.8,
    minTrackingConfidence: 0.8,
    smoothLandmarks: true,
    smoothSegmentation: true,
    refineFaceLandmarks: true,
    enableSegmentation: true
});

holistic.onResults(onResults);

const poseHands = [21, 19, 17, 20, 18, 22];
const poseFace = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const drawResults = (results) => {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    // Pose
    if (results.poseLandmarks) {
        const poseLandmarksWithoutHands = results.poseLandmarks.filter((landmark, index) => {
            return !(poseHands.includes(index));
        });

        const poseLandmarksWithoutFace = results.poseLandmarks.filter((landmark, index) => {
            return !(poseFace.includes(index));
        });

        const poseLandmarksWithFace = results.poseLandmarks.filter((landmark, index) => {
            return (poseFace.includes(index));
        });

        drawConnectors(canvasCtx, poseLandmarksWithoutHands, POSE_CONNECTIONS, {
            color: "#EEEEEE",
            lineWidth: 2
        });

        drawConnectors(canvasCtx, poseLandmarksWithFace, POSE_CONNECTIONS, {
            color: "#FFFFFF",
            lineWidth: 2
        });

        drawLandmarks(canvasCtx, poseLandmarksWithoutHands.filter(x => poseLandmarksWithoutFace.includes(x)), {
            color: "#EEEEEE",
            lineWidth: 2
        });
    }

    // Face Mesh
    drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION, {
        color: "#EEEEEE",
        lineWidth: 2
    });

    // Pupils
    if (results.faceLandmarks && results.faceLandmarks.length === 478) {
        drawLandmarks(canvasCtx, [results.faceLandmarks[468], results.faceLandmarks[468 + 5]], {
            color: "#49a0c5",
            lineWidth: 5
        });
    }

    // Hands
    drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS, {
        color: "#EEEEEE",
        lineWidth: 2
    });
    drawLandmarks(canvasCtx, results.leftHandLandmarks, {
        color: "#EEEEEE",
        lineWidth: 2
    });
    drawConnectors(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS, {
        color: "#EEEEEE",
        lineWidth: 2
    });
    drawLandmarks(canvasCtx, results.rightHandLandmarks, {
        color: "#EEEEEE",
        lineWidth: 2
    });
}

const camera = new Camera(videoElement, {
    onFrame: async () => {
        await holistic.send({ image: videoElement });
    },
    width: 1280,
    height: 720,
});
videoElement.classList.add('selfie');
camera.start();

