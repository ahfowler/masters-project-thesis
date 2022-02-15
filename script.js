const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
canvasElement.width = $("#example-application").width();
canvasElement.height = $("#example-application").height();

const canvasCtx = canvasElement.getContext('2d');

const mpHolistic = window;
const drawingUtils = window;

var model;
var predictions;

var videoLoaded = false;

async function onResults(results) {
    if (!videoLoaded) {
        model = await handpose.load();
        videoLoaded = true;
    }

    // Pass in a video stream (or an image, canvas, or 3D tensor) to obtain a
    // hand prediction from the MediaPipe graph.
    predictions = await model.estimateHands(document.querySelector("video"), false);

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    if (results.rightHandLandmarks) {
        // console.log(results.rightHandLandmarks);

        drawingUtils.drawConnectors(
            canvasCtx, results.rightHandLandmarks, mpHolistic.HAND_CONNECTIONS,
            { color: '#eeeeee' });

        drawingUtils.drawLandmarks(canvasCtx, results.rightHandLandmarks, {
            color: (data) => {
                if (data.index == 8) {
                    return 'red';
                } else {
                    return '#eeeeee';
                }
            },
            fillColor: (data) => {
                if (data.index == 8) {
                    return 'red';
                } else {
                    return '#eeeeee';
                }
            },
            lineWidth: 3,
            radius: (data) => {
                return drawingUtils.lerp(data.from.z, -0.15, .1, 10, 1);
            }
        });

        if (predictions.length > 0) {
            /*
            `predictions` is an array of objects describing each detected hand, for example:
            [
              {
                handInViewConfidence: 1, // The probability of a hand being present.
                boundingBox: { // The bounding box surrounding the hand.
                  topLeft: [162.91, -17.42],
                  bottomRight: [548.56, 368.23],
                },
                landmarks: [ // The 3D coordinates of each hand landmark.
                  [472.52, 298.59, 0.00],
                  [412.80, 315.64, -6.18],
                  ...
                ],
                annotations: { // Semantic groupings of the `landmarks` coordinates.
                  thumb: [
                    [412.80, 315.64, -6.18]
                    [350.02, 298.38, -7.14],
                    ...
                  ],
                  ...
                }
              }
            ]
            */

            for (var i = 0; i < predictions.length; i++) {
                const keypoints = predictions[i].landmarks;

                // Log hand keypoints.
                // for (let i = 0; i < keypoints.length; i++) {
                //     const [x, y, z] = keypoints[i];
                //     console.log(`Keypoint ${i}: [${x}, ${y}, ${z}]`);
                // }

                // using a minimum match score of 8.5 (out of 10)
                const estimatedGestures = GE.estimate(predictions[i].landmarks, 8.5);

                // if (estimatedGestures.gestures[0]) {
                //     console.log(estimatedGestures.gestures[0].name);
                //     if (estimatedGestures.gestures[0].name == "point") {
                //         var boxes = document.getElementsByClassName("box");
                //         checkPointerFingerLocation(predictions, boxes);
                //     }
                // }

                var boxes = document.getElementsByClassName("box");
                checkPointerFingerLocation(predictions, boxes);
            }

        }
    }

    if (results.leftHandLandmarks) {
        // console.log(results.leftHandLandmarks);

        drawingUtils.drawConnectors(
            canvasCtx, results.leftHandLandmarks, mpHolistic.HAND_CONNECTIONS,
            { color: '#eeeeee' });

        drawingUtils.drawLandmarks(canvasCtx, results.leftHandLandmarks, {
            color: (data) => {
                if (data.index == 8) {
                    return 'red';
                } else {
                    return '#eeeeee';
                }
            },
            fillColor: (data) => {
                if (data.index == 8) {
                    return 'red';
                } else {
                    return '#eeeeee';
                }
            },
            lineWidth: 3,
            radius: (data) => {
                return drawingUtils.lerp(data.from.z, -0.15, .1, 10, 1);
            }
        });

        if (predictions.length > 0) {
            for (var i = 0; i < predictions.length; i++) {
                const keypoints = predictions[i].landmarks;

                // using a minimum match score of 8.5 (out of 10)
                const estimatedGestures = GE.estimate(predictions[i].landmarks, 8.5);

                // if (estimatedGestures.gestures[0]) {
                //     console.log(estimatedGestures.gestures[0].name);
                //     if (estimatedGestures.gestures[0].name == "point") {
                //         var boxes = document.getElementsByClassName("box");
                //         checkPointerFingerLocation(predictions, boxes);
                //     }
                // }

                var boxes = document.getElementsByClassName("box");
                checkPointerFingerLocation(predictions, boxes);
            }
        }

        canvasCtx.restore();
    }
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

const pointGesture = new fp.GestureDescription('point');
pointGesture.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
pointGesture.addDirection(fp.Finger.Index, fp.FingerDirection.VerticalUp, 1.0);
for (let finger of [fp.Finger.Thumb, fp.Finger.Middle, fp.Finger.Ring, fp.Finger.Pinky]) {
    pointGesture.addCurl(finger, fp.FingerCurl.FullCurl);
    pointGesture.addCurl(finger, fp.FingerCurl.HalfCurl);
}

// add "✌🏻" and "👍" as sample gestures
const GE = new fp.GestureEstimator([
    pointGesture,
]);

function checkPointerFingerLocation(predictions, objects) {
    let objectTouched = false;

    if (predictions.length > 0) {
        for (var i = 0; i < predictions.length; i++) {
            if (!objectTouched) {
                const keypoints = predictions[i].annotations.indexFinger;

                for (let j = 0; j < objects.length; j++) {
                    var object = objects[j];

                    var rect = object.getBoundingClientRect();

                    var position = {
                        x1: rect.x,
                        x2: rect.x + rect.width,
                        y1: rect.y,
                        y2: rect.y + rect.height
                    };

                    // canvasCtx.fillStyle = "red";
                    // canvasCtx.fillRect(position.x1, position.y1, rect.width, rect.height);

                    if (keypoints[0][0] >= position.x1 && keypoints[0][0] <= position.x2) {
                        if (keypoints[0][1] >= position.y1 && keypoints[0][1] <= position.y2) {
                            objectTouched = true;
                            console.log("object touched", keypoints[i]);
                            break;
                        }
                    }
                }

            } else {
                break;
            }
        }
    }

    if (objectTouched) {
        object.style.backgroundColor = "teal";
    } else {
        object.style.backgroundColor = "aquamarine";
    }
}

