const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
canvasElement.width = $("#example-application").width();
canvasElement.height = $("#example-application").height();

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

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

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
            const estimatedGestures = interactiveGestures.estimate(predictions[i].landmarks, 9.5);

            if (estimatedGestures.gestures[0]) {
                // console.log(estimatedGestures.gestures);
                document.getElementById("gesture-name").innerText = estimatedGestures.gestures[0].name;
                break;
            } else {
                continue;
            }

            // if (estimatedGestures.gestures[0]) {
            //     console.log(estimatedGestures.gestures[0].name);
            //     if (estimatedGestures.gestures[0].name == "point") {
            //         var boxes = document.getElementsByClassName("box");
            //         checkPointerFingerLocation(predictions, boxes);
            //     }
            // }
        }
    }


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
    }


    if (results.leftHandLandmarks) {
        // console.log(results.leftHandLandmarks);

        drawingUtils.drawConnectors(
            canvasCtx, results.leftHandLandmarks, mpHolistic.HAND_CONNECTIONS,
            { color: '#eeeeee' });

        drawingUtils.drawLandmarks(canvasCtx, results.leftHandLandmarks, {
            color: (data) => {
                if (data.index == landmarkPoints.leftIndexTip) {
                    return landmarkColors.leftIndexTip;
                } else {
                    return '#eeeeee';
                }
            },
            fillColor: (data) => {
                if (data.index == landmarkPoints.leftIndexTip) {
                    return landmarkColors.leftIndexTip;
                } else {
                    return '#eeeeee';
                }
            },
            lineWidth: 3,
            radius: (data) => {
                return drawingUtils.lerp(data.from.z, -0.15, .1, 10, 1);
            }
        });

        var boxes = document.getElementsByClassName("box");
        var boxColors = {
            defaultColor: "aquamarine",
            activeColor: "yellowgreen",
            getDefaultColor: function () {
                return this.defaultColor;
            },
            getActiveColor: function () {
                return this.activeColor;
            }
        };
    
        userTouchesObject(["leftIndexTip"], boxes[0], () => {
            boxes[0].style.backgroundColor = boxColors.getActiveColor();
        }, () => {
            boxes[0].style.backgroundColor = boxColors.getDefaultColor();
        });

        userClicksObject(["leftIndexTip"], boxes[1], () => {
            console.log("clicked!");
        });

        userDragsAndDropsObject(boxes[2], () => {
            boxes[2].style.backgroundColor = boxColors.getActiveColor();
        }, () => {
            boxes[2].style.backgroundColor = boxColors.getActiveColor();
        }, () => {
            boxes[2].style.backgroundColor = boxColors.getDefaultColor();
        });

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

