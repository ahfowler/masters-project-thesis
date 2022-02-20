const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
canvasElement.width = $(window).width();
canvasElement.height = $(window).height();

const canvasCtx = canvasElement.getContext('2d');

const mpHolistic = window;
const drawingUtils = window;

var model;
var predictions;
var mpResults;

var videoLoaded = false;

var synths = [];

var boxCollections = document.getElementsByClassName("box-collection");

let whiteKeyNotes = ["C3", "D3", "E3", "F3", "G3", "A3", "B3", "C4", "D4"];
let whiteNotePlaying = [false, false, false, false, false, false, false, false, false];
let whiteKeys = document.getElementById("white-keys").children;

let blackKeyNotes = [null, "C#3", "D#3", null, "F#3", "G#3", "A#3", null, "C#4", null, null];
let blackNotePlaying = [false, false, false, false, false, false, false, false, false, false, false];
let blackKeys = document.getElementById("black-keys").children;

for (var i = 0; i < (whiteKeys.length + blackKeys.length); i++) {
    let synth = new Tone.Synth().toMaster();
    synth.portamento = 5;
    synths.push(synth);
}

async function onResults(results) {
    if (!videoLoaded) {
        model = await handpose.load();
        videoLoaded = true;
        document.getElementById("demo").style.opacity = 1;
    }

    // Pass in a video stream (or an image, canvas, or 3D tensor) to obtain a
    // hand prediction from the MediaPipe graph.
    predictions = await model.estimateHands(document.querySelector("video"), false);
    mpResults = results;

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    // document.getElementById("gesture-name").innerText = getUserNumberGesture();

    if (results.rightHandLandmarks) {
        // console.log(results.rightHandLandmarks);

        drawingUtils.drawConnectors(
            canvasCtx, results.rightHandLandmarks, mpHolistic.HAND_CONNECTIONS,
            { color: '#eeeeee' });

        drawingUtils.drawLandmarks(canvasCtx, results.rightHandLandmarks, {
            color: (data) => {
                return landmarkStyles[landmarkNames[data.index]].color;
            },
            fillColor: (data) => {
                return landmarkStyles[landmarkNames[data.index]].fillColor;
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
                return landmarkStyles[landmarkNames[data.index]].color;
            },
            fillColor: (data) => {
                return landmarkStyles[landmarkNames[data.index]].fillColor;
            },
            lineWidth: 3,
            radius: (data) => {
                return drawingUtils.lerp(data.from.z, -0.15, .1, 10, 1);
            }
        });
    }

    // var boxes = document.getElementsByClassName("box");

    // userHoversObject(landmarkAreas.indexTips, boxes[0], () => {
    //     designEditGameMechanism.changeStyle(boxes[0], { backgroundColor: "yellowgreen", text: "you're touching me!" });
    // }, () => {
    //     designEditGameMechanism.changeStyle(boxes[0], { backgroundColor: "aquamarine", text: "touch me with your pointer finger" });
    // });

    // userClicksObject(landmarkAreas.indexTips, boxes[1], () => {
    //     designEditGameMechanism.changeStyle(boxes[1], { backgroundColor: "yellowgreen", text: "you clicked me!" });
    //     // setTimeout(getObjectByUID(boxes[1].uid).selected = false, 5000);
    // }, "drawOuterCircle");

    // userDragsAndDropsObject(boxes[2], () => {
    //     designEditGameMechanism.changeStyle(boxes[2], { backgroundColor: "yellowgreen", text: "you're picked me up!" });
    // }, () => {
    //     moveObject(boxes[2], landmarkAreas.palm);
    //     designEditGameMechanism.changeStyle(boxes[2], { text: "you're dragging me!" });
    // }, () => {
    //     designEditGameMechanism.changeStyle(boxes[2], { backgroundColor: "aquamarine", text: "you dropped me!" });
    // });

    for (var i = 0; i < whiteKeys.length; i++) {
        let pianoKey = whiteKeys[i];

        userHoversObject(landmarkAreas.fingerTips, pianoKey, () => {
            if (!whiteNotePlaying[i]) {
                whiteNotePlaying[i] = true;
                synths[i].triggerAttackRelease(whiteKeyNotes[i], "2n");
                pianoKey.style.backgroundColor = "#dbdbdb";
            }
        }, () => {
            whiteNotePlaying[i] = false;
            pianoKey.style.backgroundColor = "#eeeeee";
        });

    }

    for (var i = 0; i < blackKeys.length; i++) {
        let pianoKey = blackKeys[i];
        if (!pianoKey.classList.contains("invisible")) {
            userHoversObject(landmarkAreas.fingerTips, pianoKey, () => {
                if (!blackNotePlaying[i]) {
                    blackNotePlaying[i] = true;
                    synths[10 + i].triggerAttackRelease(blackKeyNotes[i], "2n");
                    pianoKey.style.backgroundColor = "#272727";
                }
            }, () => {
                blackNotePlaying[i] = false;
                pianoKey.style.backgroundColor = "#333333";
            });
        }

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

