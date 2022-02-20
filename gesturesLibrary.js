
// -------------------------------------------
// Interactive Gestures

// Point Gesture
const pointDescription = new fp.GestureDescription('point');
pointDescription.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
pointDescription.addDirection(fp.Finger.Index, fp.FingerDirection.VerticalUp, 1.0);
pointDescription.addDirection(fp.Finger.Index, fp.FingerDirection.DiagonalUpLeft, 0.9);
pointDescription.addDirection(fp.Finger.Index, fp.FingerDirection.DiagonalUpRight, 0.9);

pointDescription.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl, 1.0);
pointDescription.addCurl(fp.Finger.Thumb, fp.FingerCurl.HalfCurl, 1.0);
pointDescription.addCurl(fp.Finger.Thumb, fp.FingerCurl.FullCurl, 1.0);
pointDescription.addDirection(fp.Finger.Thumb, fp.FingerDirection.DiagonalUpLeft, 1.0);
pointDescription.addDirection(fp.Finger.Thumb, fp.FingerDirection.DiagonalUpRight, 1.0);
pointDescription.addDirection(fp.Finger.Thumb, fp.FingerDirection.VerticalUp, 0.9);
pointDescription.addDirection(fp.Finger.Thumb, fp.FingerDirection.HorizontalLeft, 0.9);
pointDescription.addDirection(fp.Finger.Thumb, fp.FingerDirection.HorizontalRight, 0.9);

for (let finger of [fp.Finger.Middle, fp.Finger.Ring, fp.Finger.Pinky]) {
    pointDescription.addCurl(finger, fp.FingerCurl.FullCurl, 1.0);
    pointDescription.addCurl(finger, fp.FingerCurl.HalfCurl, 0.9);
}

// Fist Gesture
const fistDescription = new fp.GestureDescription('fist');
for (let finger of [fp.Finger.Index, fp.Finger.Middle, fp.Finger.Ring, fp.Finger.Pinky, fp.Finger.Thumb]) {
    fistDescription.addCurl(finger, fp.FingerCurl.FullCurl, 1.0);
    fistDescription.addCurl(finger, fp.FingerCurl.HalfCurl, 1.0);
}

fistDescription.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl, 0.9);
fistDescription.addDirection(fp.Finger.Thumb, fp.FingerDirection.VerticalUp, 1.0);
fistDescription.addDirection(fp.Finger.Thumb, fp.FingerDirection.DiagonalUpLeft, 1.0);
fistDescription.addDirection(fp.Finger.Thumb, fp.FingerDirection.DiagonalUpRight, 1.0);
fistDescription.addDirection(fp.Finger.Thumb, fp.FingerDirection.HorizontalLeft, 0.9);
fistDescription.addDirection(fp.Finger.Thumb, fp.FingerDirection.HorizontalRight, 0.9);

// Open Gesture
const openHandDescription = new fp.GestureDescription('open hand');
for (let finger of [fp.Finger.Index, fp.Finger.Middle, fp.Finger.Ring, fp.Finger.Pinky, fp.Finger.Thumb]) {
    openHandDescription.addCurl(finger, fp.FingerCurl.NoCurl, 1.0);
    openHandDescription.addDirection(finger, fp.FingerDirection.VerticalUp, 1.0);
    openHandDescription.addDirection(finger, fp.FingerDirection.DiagonalUpLeft, 0.9);
    openHandDescription.addDirection(finger, fp.FingerDirection.DiagonalUpRight, 0.9);
}

openHandDescription.addDirection(fp.Finger.Thumb, fp.FingerDirection.HorizontalLeft, 0.9);
openHandDescription.addDirection(fp.Finger.Thumb, fp.FingerDirection.HorizontalRight, 0.9);
openHandDescription.addDirection(fp.Finger.Thumb, fp.FingerDirection.DiagonalUpLeft, 1.0);
openHandDescription.addDirection(fp.Finger.Thumb, fp.FingerDirection.DiagonalUpRight, 1.0);

// -------------------------------------------
// Number Gestures

// 0 Gesture
const zeroDescription = new fp.GestureDescription('number zero');
for (let finger of [fp.Finger.Index, fp.Finger.Middle, fp.Finger.Ring, fp.Finger.Pinky, fp.Finger.Thumb]) {
    zeroDescription.addCurl(finger, fp.FingerCurl.FullCurl, 1.0);
    zeroDescription.addCurl(finger, fp.FingerCurl.HalfCurl, 1.0);
}

zeroDescription.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl, 0.9);
zeroDescription.addDirection(fp.Finger.Thumb, fp.FingerDirection.VerticalUp, 1.0);
zeroDescription.addDirection(fp.Finger.Thumb, fp.FingerDirection.DiagonalUpLeft, 1.0);
zeroDescription.addDirection(fp.Finger.Thumb, fp.FingerDirection.DiagonalUpRight, 1.0);
zeroDescription.addDirection(fp.Finger.Thumb, fp.FingerDirection.HorizontalLeft, 0.9);
zeroDescription.addDirection(fp.Finger.Thumb, fp.FingerDirection.HorizontalRight, 0.9);

// 1 Gesture
const oneDescription = new fp.GestureDescription('number one');

oneDescription.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
oneDescription.addDirection(fp.Finger.Index, fp.FingerDirection.VerticalUp, 1.0);
oneDescription.addDirection(fp.Finger.Index, fp.FingerDirection.DiagonalUpLeft, 0.9);
oneDescription.addDirection(fp.Finger.Index, fp.FingerDirection.DiagonalUpRight, 0.9);

oneDescription.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl, 1.0);
oneDescription.addCurl(fp.Finger.Thumb, fp.FingerCurl.HalfCurl, 1.0);
oneDescription.addCurl(fp.Finger.Thumb, fp.FingerCurl.FullCurl, 1.0);
oneDescription.addDirection(fp.Finger.Thumb, fp.FingerDirection.DiagonalUpLeft, 1.0);
oneDescription.addDirection(fp.Finger.Thumb, fp.FingerDirection.DiagonalUpRight, 1.0);
oneDescription.addDirection(fp.Finger.Thumb, fp.FingerDirection.VerticalUp, 0.9);
oneDescription.addDirection(fp.Finger.Thumb, fp.FingerDirection.HorizontalLeft, 0.9);
oneDescription.addDirection(fp.Finger.Thumb, fp.FingerDirection.HorizontalRight, 0.9);

for (let finger of [fp.Finger.Middle, fp.Finger.Ring, fp.Finger.Pinky]) {
    oneDescription.addCurl(finger, fp.FingerCurl.FullCurl, 1.0);
    oneDescription.addCurl(finger, fp.FingerCurl.HalfCurl, 0.9);
}

// 2 Gesture
const twoDescription = new fp.GestureDescription('number two');

twoDescription.addCurl(fp.Finger.Thumb, fp.FingerCurl.FullCurl, 1.0);
twoDescription.addCurl(fp.Finger.Thumb, fp.FingerCurl.HalfCurl, 0.9);
twoDescription.addDirection(fp.Finger.Thumb, fp.FingerDirection.VerticalUp, 0.5);
twoDescription.addDirection(fp.Finger.Thumb, fp.FingerDirection.DiagonalUpLeft, 1.0);
twoDescription.addDirection(fp.Finger.Thumb, fp.FingerDirection.DiagonalUpRight, 1.0);

twoDescription.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
twoDescription.addDirection(fp.Finger.Index, fp.FingerDirection.VerticalUp, 1.0);
twoDescription.addDirection(fp.Finger.Index, fp.FingerDirection.DiagonalUpLeft, 0.9);
twoDescription.addDirection(fp.Finger.Index, fp.FingerDirection.DiagonalUpRight, 0.9);

twoDescription.addCurl(fp.Finger.Middle, fp.FingerCurl.NoCurl, 1.0);
twoDescription.addDirection(fp.Finger.Middle, fp.FingerDirection.VerticalUp, 1.0);
twoDescription.addDirection(fp.Finger.Middle, fp.FingerDirection.DiagonalUpLeft, 0.9);
twoDescription.addDirection(fp.Finger.Middle, fp.FingerDirection.DiagonalUpRight, 0.9);

for (let finger of [fp.Finger.Ring, fp.Finger.Pinky]) {
    twoDescription.addCurl(finger, fp.FingerCurl.FullCurl, 1.0);
    twoDescription.addCurl(finger, fp.FingerCurl.HalfCurl, 0.9);
}

// 3 Gesture
const threeDescription = new fp.GestureDescription('number three');

for (let finger of [fp.Finger.Index, fp.Finger.Middle, fp.Finger.Ring]) {
    threeDescription.addCurl(finger, fp.FingerCurl.NoCurl, 1.0);
    threeDescription.addDirection(finger, fp.FingerDirection.VerticalUp, 1.0);
    threeDescription.addDirection(finger, fp.FingerDirection.DiagonalUpLeft, 0.9);
    threeDescription.addDirection(finger, fp.FingerDirection.DiagonalUpRight, 0.9);
}

threeDescription.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl, 1.0);
threeDescription.addCurl(fp.Finger.Thumb, fp.FingerCurl.HalfCurl, 1.0);
threeDescription.addCurl(fp.Finger.Thumb, fp.FingerCurl.FullCurl, 1.0);
threeDescription.addDirection(fp.Finger.Thumb, fp.FingerDirection.DiagonalUpLeft, 1.0);
threeDescription.addDirection(fp.Finger.Thumb, fp.FingerDirection.DiagonalUpRight, 1.0);
threeDescription.addDirection(fp.Finger.Thumb, fp.FingerDirection.VerticalUp, 0.9);
threeDescription.addDirection(fp.Finger.Thumb, fp.FingerDirection.HorizontalLeft, 0.9);
threeDescription.addDirection(fp.Finger.Thumb, fp.FingerDirection.HorizontalRight, 0.9);

threeDescription.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);
threeDescription.addCurl(fp.Finger.Pinky, fp.FingerCurl.HalfCurl, 0.9);

// 4 Gesture
const fourDescription = new fp.GestureDescription('number four');

for (let finger of [fp.Finger.Index, fp.Finger.Middle, fp.Finger.Ring, fp.Finger.Pinky]) {
    fourDescription.addCurl(finger, fp.FingerCurl.NoCurl, 1.0);
    fourDescription.addDirection(finger, fp.FingerDirection.VerticalUp, 1.0);
    fourDescription.addDirection(finger, fp.FingerDirection.DiagonalUpLeft, 0.9);
    fourDescription.addDirection(finger, fp.FingerDirection.DiagonalUpRight, 0.9);
}

fourDescription.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl, 0.5);
fourDescription.addCurl(fp.Finger.Thumb, fp.FingerCurl.HalfCurl, 1.0);
fourDescription.addCurl(fp.Finger.Thumb, fp.FingerCurl.FullCurl, 1.0);
fourDescription.addDirection(fp.Finger.Thumb, fp.FingerDirection.DiagonalUpLeft, 1.0);
fourDescription.addDirection(fp.Finger.Thumb, fp.FingerDirection.DiagonalUpRight, 1.0);
fourDescription.addDirection(fp.Finger.Thumb, fp.FingerDirection.HorizontalLeft, 0.9);
fourDescription.addDirection(fp.Finger.Thumb, fp.FingerDirection.HorizontalRight, 0.9);

// 5 Gesture
const fiveDescription = new fp.GestureDescription('number five');
for (let finger of [fp.Finger.Index, fp.Finger.Middle, fp.Finger.Ring, fp.Finger.Pinky, fp.Finger.Thumb]) {
    fiveDescription.addCurl(finger, fp.FingerCurl.NoCurl, 1.0);
    fiveDescription.addDirection(finger, fp.FingerDirection.VerticalUp, 1.0);
    fiveDescription.addDirection(finger, fp.FingerDirection.DiagonalUpLeft, 0.9);
    fiveDescription.addDirection(finger, fp.FingerDirection.DiagonalUpRight, 0.9);
}

fiveDescription.addDirection(fp.Finger.Thumb, fp.FingerDirection.HorizontalLeft, 0.9);
fiveDescription.addDirection(fp.Finger.Thumb, fp.FingerDirection.HorizontalRight, 0.9);
fiveDescription.addDirection(fp.Finger.Thumb, fp.FingerDirection.DiagonalUpLeft, 1.0);
fiveDescription.addDirection(fp.Finger.Thumb, fp.FingerDirection.DiagonalUpRight, 1.0);

// -------------------------------------------
// Miscellaneous Gestures

// Thumbs Up Gesture
const thumbsUpDescription = new fp.GestureDescription('thumbs up');
thumbsUpDescription.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl, 1.0);
thumbsUpDescription.addDirection(fp.Finger.Thumb, fp.FingerDirection.VerticalUp, 1.0);
thumbsUpDescription.addDirection(fp.Finger.Thumb, fp.FingerDirection.DiagonalUpLeft, 0.9);
thumbsUpDescription.addDirection(fp.Finger.Thumb, fp.FingerDirection.DiagonalUpRight, 0.9);

for (let finger of [fp.Finger.Index, fp.Finger.Middle, fp.Finger.Ring, fp.Finger.Pinky]) {
    thumbsUpDescription.addCurl(finger, fp.FingerCurl.FullCurl, 1.0);
    thumbsUpDescription.addCurl(finger, fp.FingerCurl.HalfCurl, 0.9);

    thumbsUpDescription.addDirection(finger, fp.FingerDirection.DiagonalUpLeft, 0.9);
    thumbsUpDescription.addDirection(finger, fp.FingerDirection.HorizontalLeft, 1.0);
    thumbsUpDescription.addDirection(finger, fp.FingerDirection.HorizontalRight, 1.0);
    thumbsUpDescription.addDirection(finger, fp.FingerDirection.DiagonalUpRight, 0.9);
}

// Thumbs Down Gesture
const thumbsDownDescription = new fp.GestureDescription('thumbs down');
thumbsDownDescription.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl, 1.0);
thumbsDownDescription.addDirection(fp.Finger.Thumb, fp.FingerDirection.VerticalDown, 1.0);
thumbsDownDescription.addDirection(fp.Finger.Thumb, fp.FingerDirection.DiagonalDownLeft, 0.9);
thumbsDownDescription.addDirection(fp.Finger.Thumb, fp.FingerDirection.DiagonalDownRight, 0.9);

for (let finger of [fp.Finger.Index, fp.Finger.Middle, fp.Finger.Ring, fp.Finger.Pinky]) {
    thumbsDownDescription.addCurl(finger, fp.FingerCurl.FullCurl, 1.0);
    thumbsDownDescription.addCurl(finger, fp.FingerCurl.HalfCurl, 0.9);

    thumbsDownDescription.addDirection(finger, fp.FingerDirection.DiagonalUpLeft, 0.9);
    thumbsDownDescription.addDirection(finger, fp.FingerDirection.HorizontalLeft, 1.0);
    thumbsDownDescription.addDirection(finger, fp.FingerDirection.HorizontalRight, 1.0);
    thumbsDownDescription.addDirection(finger, fp.FingerDirection.DiagonalUpRight, 0.9);
}

// -------------------------------------------
// Gesture Libraries

const interactiveGestures = new fp.GestureEstimator([
    pointDescription,
    fistDescription,
    openHandDescription
]);

const dragDropGestures = new fp.GestureEstimator([
    fistDescription,
    openHandDescription
]);

const numberGestures = new fp.GestureEstimator([
    zeroDescription,
    oneDescription,
    twoDescription,
    threeDescription,
    fourDescription,
    fiveDescription
]);

const miscGestures = new fp.GestureEstimator([
    fp.Gestures.VictoryGesture,
    thumbsUpDescription,
    thumbsDownDescription,
    pointDescription,
    fistDescription,
    openHandDescription,
]);

const demoGestures = new fp.GestureEstimator([
    pointDescription,
    fistDescription,
    thumbsUpDescription,
    thumbsDownDescription,
    twoDescription,
]);

// Gesture Functions
function userOpensHand() {
    if (predictions.length > 0) { // Check both hands...
        const estimatedGestures = dragDropGestures.estimate(predictions[0].landmarks, 9.5);

        for (var i = 0; i < estimatedGestures.gestures.length; i++) {
            if (estimatedGestures.gestures[i] && estimatedGestures.gestures[i].name == "open hand") {
                return true;
            }
        }
    }

    return false;
}

function userClosesHand() {
    if (predictions.length > 0) { // Check both hands...
        const estimatedGestures = dragDropGestures.estimate(predictions[0].landmarks, 9.5);

        for (var i = 0; i < estimatedGestures.gestures.length; i++) {
            if (estimatedGestures.gestures[i] && estimatedGestures.gestures[i].name == "fist") {
                return true;
            }
        }
    }

    return false;
}

function getUserNumberGesture() {
    if (predictions.length > 0) { // Check both hands...
        const estimatedGestures = numberGestures.estimate(predictions[0].landmarks, 9.5);

        if (estimatedGestures.gestures[0]) {
            return estimatedGestures.gestures[0].name;
        }
    }

    return "";
}

function getDemoGesture() {
    if (predictions.length > 0) { // Check both hands...
        const estimatedGestures = demoGestures.estimate(predictions[0].landmarks, 8.5);

        if (estimatedGestures.gestures[0]) {
            return estimatedGestures.gestures[0].name;
        }
    }

    return "";
}