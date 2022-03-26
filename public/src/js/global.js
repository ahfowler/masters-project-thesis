export const LANDMARK_AREAS = {
    // thumb: [1, 2, 3, 4],
    // indexFinger: [5, 6, 7, 8],
    // middleFinger: [9, 10, 11, 12],
    // ringFinger: [13, 14, 15, 16],
    // pinky: [17, 18, 19, 20],
    // palm: [0, 5, 9, 13, 17]
    fingerTips: ["indexTip", "middleTip", "ringTip", "pinkyTip", "thumbTip"],
    indexTips: ["leftIndexTip", "rightIndexTip"],
    pinchFingers: ["indexTip", "thumbTip"],
    palm: ["bottomPalm", "bottomIndex", "bottomMiddle", "bottomRing", "bottomPinky"],
}

export const LANDMARK_NAMES = {
    0: "bottomPalm",
    1: "bottomThumb",
    2: "lowerMiddleThumb",
    3: "upperMiddleThumb",
    4: "thumbTip",
    5: "bottomIndex",
    6: "lowerMiddleIndex",
    7: "upperMiddleIndex",
    8: "indexTip",
    9: "bottomMiddle",
    10: "lowerMiddleMiddle",
    11: "upperMiddleMiddle",
    12: "middleTip",
    13: "bottomRing",
    14: "lowerMiddleRing",
    15: "upperMiddleRing",
    16: "ringTip",
    17: "bottomPinky",
    18: "lowerMiddlePinky",
    19: "upperMiddlePinky",
    20: "pinkyTip",
}

export const LANDMARK_POINTS = {
    leftIndexTip: 8,
    rightIndexTip: 8,
    // General (Both Left and Right)
    bottomPalm: 0,
    bottomThumb: 1,
    lowerMiddleThumb: 2,
    upperMiddleThumb: 3,
    thumbTip: 4,
    bottomIndex: 5,
    lowerMiddleIndex: 6,
    upperMiddleIndex: 7,
    indexTip: 8,
    bottomMiddle: 9,
    lowerMiddleMiddle: 10,
    upperMiddleMiddle: 11,
    middleTip: 12,
    bottomRing: 13,
    lowerMiddleRing: 14,
    upperMiddleRing: 15,
    ringTip: 16,
    bottomPinky: 17,
    lowerMiddlePinky: 18,
    upperMiddlePinky: 19,
    pinkyTip: 20
}


// -------------------------------------------
// Interactive Gestures
let gestureDescriptions = {};

function convertDesciption(descriptionName, descriptions) {
    var gestureDescription = new fp.GestureDescription(descriptionName);
    gestureDescriptions[descriptionName] = gestureDescription;

    for (var i = 0; i < descriptions.length; i++) {
        if (descriptions[i][0] == "addCurl") { // This is a curl description.
            let finger = descriptions[i][1];
            let curl = descriptions[i][2];
            let confidence = descriptions[i][3];

            gestureDescriptions[descriptionName].addCurl(fp.Finger[finger], fp.FingerCurl[curl], confidence);

        } else if (descriptions[i][0] == "addDirection") {
            let finger = descriptions[i][1];
            let direction = descriptions[i][2];
            let confidence = descriptions[i][3];

            gestureDescriptions[descriptionName].addDirection(fp.Finger[finger], fp.FingerDirection[direction], confidence);
        }
    }
}

convertDesciption('pinch', [
    [
        "addCurl",
        "Thumb",
        "NoCurl",
        1
      ],
      [
        "addDirection",
        "Thumb",
        "VerticalUp",
        1
      ],
      [
        "addDirection",
        "Thumb",
        "DiagonalUpLeft",
        0.6666666666666666
      ],
      [
        "addDirection",
        "Thumb",
        "DiagonalUpRight",
        0.3333333333333333
      ],
      [
        "addCurl",
        "Index",
        "NoCurl",
        0.7647058823529411
      ],
      [
        "addCurl",
        "Index",
        "HalfCurl",
        1
      ],
      [
        "addDirection",
        "Index",
        "DiagonalUpLeft",
        1
      ],
      [
        "addDirection",
        "Index",
        "VerticalUp",
        0.13636363636363635
      ],
      [
        "addDirection",
        "Index",
        "DiagonalUpRight",
        0.22727272727272727
      ],
      [
        "addCurl",
        "Middle",
        "NoCurl",
        0.5
      ],
      [
        "addCurl",
        "Middle",
        "HalfCurl",
        1
      ],
      [
        "addDirection",
        "Middle",
        "VerticalUp",
        0.9230769230769231
      ],
      [
        "addDirection",
        "Middle",
        "DiagonalUpLeft",
        1
      ],
      [
        "addDirection",
        "Middle",
        "DiagonalUpRight",
        0.38461538461538464
      ],
      [
        "addCurl",
        "Ring",
        "NoCurl",
        0.36363636363636365
      ],
      [
        "addCurl",
        "Ring",
        "HalfCurl",
        1
      ],
      [
        "addDirection",
        "Ring",
        "VerticalUp",
        0.9166666666666666
      ],
      [
        "addDirection",
        "Ring",
        "DiagonalUpLeft",
        1
      ],
      [
        "addDirection",
        "Ring",
        "DiagonalUpRight",
        0.5833333333333334
      ],
      [
        "addCurl",
        "Pinky",
        "HalfCurl",
        1
      ],
      [
        "addCurl",
        "Pinky",
        "NoCurl",
        0.07142857142857142
      ],
      [
        "addDirection",
        "Pinky",
        "VerticalUp",
        1
      ],
      [
        "addDirection",
        "Pinky",
        "DiagonalUpLeft",
        0.2631578947368421
      ],
      [
        "addDirection",
        "Pinky",
        "DiagonalUpRight",
        0.3157894736842105
      ],

]);
convertDesciption('nopinch', [[
    "addCurl",
    "Thumb",
    "NoCurl",
    1
  ],
  [
    "addDirection",
    "Thumb",
    "DiagonalUpLeft",
    1
  ],
  [
    "addDirection",
    "Thumb",
    "HorizontalLeft",
    0.07142857142857142
  ],
  [
    "addCurl",
    "Index",
    "NoCurl",
    1
  ],
  [
    "addDirection",
    "Index",
    "DiagonalUpLeft",
    1
  ],
  [
    "addCurl",
    "Middle",
    "NoCurl",
    1
  ],
  [
    "addDirection",
    "Middle",
    "DiagonalUpLeft",
    1
  ],
  [
    "addCurl",
    "Ring",
    "NoCurl",
    1
  ],
  [
    "addDirection",
    "Ring",
    "VerticalUp",
    1
  ],
  [
    "addCurl",
    "Pinky",
    "NoCurl",
    1
  ],
  [
    "addDirection",
    "Pinky",
    "VerticalUp",
    1
  ],
  [
    "addCurl",
    "Thumb",
    "NoCurl",
    1
  ],
  [
    "addDirection",
    "Thumb",
    "DiagonalUpRight",
    1
  ],
  [
    "addCurl",
    "Index",
    "NoCurl",
    1
  ],
  [
    "addCurl",
    "Index",
    "HalfCurl",
    0.034482758620689655
  ],
  [
    "addDirection",
    "Index",
    "DiagonalUpRight",
    1
  ],
  [
    "addCurl",
    "Middle",
    "NoCurl",
    1
  ],
  [
    "addDirection",
    "Middle",
    "VerticalUp",
    1
  ],
  [
    "addDirection",
    "Middle",
    "DiagonalUpRight",
    0.15384615384615385
  ],
  [
    "addCurl",
    "Ring",
    "NoCurl",
    1
  ],
  [
    "addDirection",
    "Ring",
    "VerticalUp",
    1
  ],
  [
    "addCurl",
    "Pinky",
    "NoCurl",
    1
  ],
  [
    "addDirection",
    "Pinky",
    "VerticalUp",
    1
  ]
]);
convertDesciption('open hand', [[
    "addCurl",
    "Thumb",
    "NoCurl",
    1
  ],
  [
    "addDirection",
    "Thumb",
    "DiagonalUpLeft",
    1
  ],
  [
    "addDirection",
    "Thumb",
    "HorizontalLeft",
    0.42857142857142855
  ],
  [
    "addCurl",
    "Index",
    "NoCurl",
    1
  ],
  [
    "addDirection",
    "Index",
    "DiagonalUpLeft",
    1
  ],
  [
    "addDirection",
    "Index",
    "VerticalUp",
    0.25
  ],
  [
    "addCurl",
    "Middle",
    "NoCurl",
    1
  ],
  [
    "addDirection",
    "Middle",
    "VerticalUp",
    1
  ],
  [
    "addDirection",
    "Middle",
    "DiagonalUpLeft",
    0.07142857142857142
  ],
  [
    "addCurl",
    "Ring",
    "NoCurl",
    1
  ],
  [
    "addDirection",
    "Ring",
    "VerticalUp",
    1
  ],
  [
    "addCurl",
    "Pinky",
    "NoCurl",
    1
  ],
  [
    "addDirection",
    "Pinky",
    "DiagonalUpRight",
    1
  ],
  [
    "addDirection",
    "Pinky",
    "VerticalUp",
    0.36363636363636365
  ],
  [
    "addCurl",
    "Thumb",
    "NoCurl",
    1
  ],
  [
    "addDirection",
    "Thumb",
    "DiagonalUpRight",
    1
  ],
  [
    "addDirection",
    "Thumb",
    "HorizontalRight",
    0.5789473684210527
  ],
  [
    "addCurl",
    "Index",
    "NoCurl",
    1
  ],
  [
    "addDirection",
    "Index",
    "VerticalUp",
    0.5
  ],
  [
    "addDirection",
    "Index",
    "DiagonalUpRight",
    1
  ],
  [
    "addCurl",
    "Middle",
    "NoCurl",
    1
  ],
  [
    "addDirection",
    "Middle",
    "VerticalUp",
    1
  ],
  [
    "addCurl",
    "Ring",
    "NoCurl",
    1
  ],
  [
    "addDirection",
    "Ring",
    "VerticalUp",
    1
  ],
  [
    "addDirection",
    "Ring",
    "DiagonalUpLeft",
    0.15384615384615385
  ],
  [
    "addCurl",
    "Pinky",
    "NoCurl",
    1
  ],
  [
    "addDirection",
    "Pinky",
    "DiagonalUpLeft",
    1
  ],
  [
    "addDirection",
    "Pinky",
    "VerticalUp",
    0.36363636363636365
  ]
]);
convertDesciption('fist', [[
    "addCurl",
    "Thumb",
    "NoCurl",
    1
  ],
  [
    "addDirection",
    "Thumb",
    "VerticalUp",
    1
  ],
  [
    "addCurl",
    "Index",
    "FullCurl",
    1
  ],
  [
    "addDirection",
    "Index",
    "VerticalUp",
    1
  ],
  [
    "addCurl",
    "Middle",
    "FullCurl",
    1
  ],
  [
    "addDirection",
    "Middle",
    "VerticalUp",
    1
  ],
  [
    "addCurl",
    "Ring",
    "FullCurl",
    1
  ],
  [
    "addDirection",
    "Ring",
    "VerticalUp",
    1
  ],
  [
    "addDirection",
    "Ring",
    "DiagonalUpRight",
    0.034482758620689655
  ],
  [
    "addCurl",
    "Pinky",
    "FullCurl",
    1
  ],
  [
    "addDirection",
    "Pinky",
    "DiagonalUpRight",
    1
  ],
  [
    "addCurl",
    "Thumb",
    "HalfCurl",
    1
  ],
  [
    "addDirection",
    "Thumb",
    "DiagonalUpLeft",
    1
  ],
  [
    "addDirection",
    "Thumb",
    "VerticalUp",
    0.875
  ],
  [
    "addCurl",
    "Index",
    "FullCurl",
    1
  ],
  [
    "addDirection",
    "Index",
    "DiagonalUpLeft",
    1
  ],
  [
    "addDirection",
    "Index",
    "HorizontalLeft",
    0.037037037037037035
  ],
  [
    "addDirection",
    "Index",
    "VerticalUp",
    0.07407407407407407
  ],
  [
    "addCurl",
    "Middle",
    "FullCurl",
    1
  ],
  [
    "addDirection",
    "Middle",
    "DiagonalUpLeft",
    1
  ],
  [
    "addDirection",
    "Middle",
    "DiagonalDownLeft",
    0.045454545454545456
  ],
  [
    "addDirection",
    "Middle",
    "VerticalUp",
    0.3181818181818182
  ],
  [
    "addCurl",
    "Ring",
    "FullCurl",
    1
  ],
  [
    "addDirection",
    "Ring",
    "VerticalUp",
    1
  ],
  [
    "addDirection",
    "Ring",
    "DiagonalUpLeft",
    0.45
  ],
  [
    "addDirection",
    "Ring",
    "DiagonalDownLeft",
    0.05
  ],
  [
    "addCurl",
    "Pinky",
    "FullCurl",
    1
  ],
  [
    "addDirection",
    "Pinky",
    "VerticalUp",
    1
  ],
  [
    "addDirection",
    "Pinky",
    "DiagonalUpLeft",
    0.034482758620689655
  ]
]);

console.log(gestureDescriptions);

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

// Pinch Gesture
const pinchDescription = new fp.GestureDescription('pinch');
pinchDescription.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl, 1.0);
pinchDescription.addCurl(fp.Finger.Index, fp.FingerCurl.HalfCurl, 1.0);
pinchDescription.addCurl(fp.Finger.Index, fp.FingerCurl.FullCurl, 0.5);
pinchDescription.addCurl(fp.Finger.Middle, fp.FingerCurl.NoCurl, 1.0);
pinchDescription.addCurl(fp.Finger.Ring, fp.FingerCurl.NoCurl, 1.0);
pinchDescription.addCurl(fp.Finger.Index, fp.FingerCurl.HalfCurl, 1.0);


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
    gestureDescriptions['fist'],
    gestureDescriptions['open hand']
]);

const dragDropGestures = new fp.GestureEstimator([
    gestureDescriptions['fist'],
    gestureDescriptions['open hand']
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
    gestureDescriptions['fist'],
    gestureDescriptions['open hand'],
]);

const demoGestures = new fp.GestureEstimator([
    pointDescription,
    gestureDescriptions['fist'],
    thumbsUpDescription,
    thumbsDownDescription,
    twoDescription,
]);

const pinchGesture = new fp.GestureEstimator([
    gestureDescriptions['pinch'],
    gestureDescriptions['open hand']
]);


let currentGestures = {};

// Gesture Functions
export function updateGestures(predictions) {
    for (const property in currentGestures) {
        currentGestures[property] = false;
    }

    if (predictions.length > 0) { // Check both hands...
        let estimatedGestures = dragDropGestures.estimate(predictions[0].landmarks, 7.0);

        for (var i = 0; i < estimatedGestures.gestures.length; i++) {
            if (estimatedGestures.gestures[i] && estimatedGestures.gestures[i].name == "open hand") {
                currentGestures["openHand"] = true;
            } else if (estimatedGestures.gestures[i] && estimatedGestures.gestures[i].name == "fist") {
                currentGestures["closedHand"] = true;
            }
        }

        estimatedGestures = numberGestures.estimate(predictions[0].landmarks, 9.5);

        for (var i = 0; i < estimatedGestures.gestures.length; i++) {
            if (estimatedGestures.gestures[i] && estimatedGestures.gestures[i].name == "number zero") {
                currentGestures["zero"] = true;
            } else if (estimatedGestures.gestures[i] && estimatedGestures.gestures[i].name == "number one") {
                currentGestures["one"] = true;
            } else if (estimatedGestures.gestures[i] && estimatedGestures.gestures[i].name == "number two") {
                currentGestures["two"] = true;
            } else if (estimatedGestures.gestures[i] && estimatedGestures.gestures[i].name == "number three") {
                currentGestures["three"] = true;
            } else if (estimatedGestures.gestures[i] && estimatedGestures.gestures[i].name == "number four") {
                currentGestures["four"] = true;
            } else if (estimatedGestures.gestures[i] && estimatedGestures.gestures[i].name == "number five") {
                currentGestures["five"] = true;
            }
        }

        estimatedGestures = pinchGesture.estimate(predictions[0].landmarks, 7.8);
        for (var i = 0; i < estimatedGestures.gestures.length; i++) {
            if (estimatedGestures.gestures[i] && estimatedGestures.gestures[i].name == "pinch") {
                currentGestures["pinch"] = true;
            }
        }

    }

    return currentGestures;
}
