import { VRButton } from "https://unpkg.com/three@0.133.0/examples/jsm/webxr/VRButton.js";

//Import Helper Functions from Kalidokit
const remap = Kalidokit.Utils.remap;
const clamp = Kalidokit.Utils.clamp;
const lerp = Kalidokit.Vector.lerp;

/* THREEJS WORLD SETUP */
let currentVrm;

xPosition = 0.0;
cameraXPosition = 0.0;
cameraZPosition = 2.0;

// renderer
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// scene
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xff0000 );


let cameraControls;

let groundMirror, verticalMirror;

let geometry, material;


// camera
const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 400);
camera.position.set(0, 3.0, 2.0);

cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
cameraControls.target.set(0, 3.0, -25.0);
cameraControls.maxDistance = 400;
cameraControls.minDistance = 5;
cameraControls.update();

const planeGeo = new THREE.PlaneGeometry(100.1, 100.1);

// reflectors/mirrors

geometry = new THREE.CircleGeometry(30, 30);
groundMirror = new THREE.Reflector(geometry, {
    clipBias: 0.003,
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio,
    color: 0x777777
});
groundMirror.position.y = 0.5;
groundMirror.rotateX(- Math.PI / 2);
scene.add(groundMirror);

geometry = new THREE.PlaneGeometry(100, 100);
verticalMirror = new THREE.Reflector(geometry, {
    clipBias: 0.003,
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio,
    color: 0x889999
});
verticalMirror.position.y = 50;
verticalMirror.position.z = - 30;
scene.add(verticalMirror);

// walls
const planeTop = new THREE.Mesh(planeGeo, new THREE.MeshPhongMaterial({ color: "orange" }));
planeTop.position.y = 100;
planeTop.rotateX(Math.PI / 2);
scene.add(planeTop);

const planeBottom = new THREE.Mesh(planeGeo, new THREE.MeshPhongMaterial({ color: 0xffffff }));
planeBottom.rotateX(- Math.PI / 2);
scene.add(planeBottom);

const planeFront = new THREE.Mesh(planeGeo, new THREE.MeshPhongMaterial({ color: 0x7f7fff }));
planeFront.position.z = 50;
planeFront.position.y = 50;
planeFront.rotateY(Math.PI);
scene.add(planeFront);

const planeRight = new THREE.Mesh(planeGeo, new THREE.MeshPhongMaterial({ color: 0x00ff00 }));
planeRight.position.x = 50;
planeRight.position.y = 50;
planeRight.rotateY(- Math.PI / 2);
scene.add(planeRight);

const planeLeft = new THREE.Mesh(planeGeo, new THREE.MeshPhongMaterial({ color: 0xff0000 }));
planeLeft.position.x = - 50;
planeLeft.position.y = 50;
planeLeft.rotateY(Math.PI / 2);
scene.add(planeLeft);

// lights
const mainLight = new THREE.PointLight(0xcccccc, 1.5, 250);
mainLight.position.y = 60;
scene.add(mainLight);

const greenLight = new THREE.PointLight(0x00ff00, 0.25, 1000);
greenLight.position.set(550, 50, 0);
scene.add(greenLight);

const redLight = new THREE.PointLight(0xff0000, 0.25, 1000);
redLight.position.set(- 550, 50, 0);
scene.add(redLight);

const blueLight = new THREE.PointLight(0x7f7fff, 0.25, 1000);
blueLight.position.set(0, 50, 550);
scene.add(blueLight);

// Main Render Loop
const clock = new THREE.Clock();

function animate() {
    renderer.setAnimationLoop(animate);
    // requestAnimationFrame(animate);

    if (currentVrm) {
        // Update model to render physics
        currentVrm.update(clock.getDelta());
    }

    renderer.render(scene, camera);
}
animate();

document.body.appendChild(VRButton.createButton(renderer));
renderer.xr.enabled = true;

document.getElementById("VRButton").addEventListener('click', () => {
    var selectedObject = scene.getObjectByName(mainUserSocketID);
    camera.rotation.y = Math.PI; // Rotate model 180deg to face camera
    camera.y += 1.0; // Move a little away from the face.
    selectedObject.add(camera);
});

/* VRM CHARACTER SETUP */
// Take the results from `Holistic` and animate character based on its Face, Pose, and Hand Keypoints.
var riggedPose, riggedLeftHand, riggedRightHand, riggedFace;

// Import Character VRM
const loader = new THREE.GLTFLoader();
loader.crossOrigin = "anonymous";

loadUser = function (socketID, modelURL) {
    loader.load(
        modelURL,

        gltf => {
            THREE.VRMUtils.removeUnnecessaryJoints(gltf.scene);

            THREE.VRM.from(gltf).then(vrm => {
                let object = vrm.scene;
                object.name = socketID;

                object.scale.set( 3, 3, 3 );
                object.position.y = 0.5;
                object.position.z = -25.0;
                scene.add(object);

                virtualModels[socketID] = {};
                virtualModels[socketID].riggedCharacter = {};
                virtualModels[socketID].vrm = vrm;

                vrm.scene.rotation.y = Math.PI; // Rotate model 180deg to face camera
                vrm.scene.position.x = xPosition;
                xPosition += 3.0;

                updateCamera();
            });
        },

        progress =>
            console.log(
                "Loading model...",
                100.0 * (progress.loaded / progress.total),
                "%"
            ),

        error => console.error(error)
    );
}

// Animate Rotation Helper function
const rigRotation = (
    name,
    rotation = { x: 0, y: 0, z: 0 },
    dampener = 1.0,
    lerpAmount = 0.15,
) => {
    if (!currentVrm) { return }
    const Part = currentVrm.humanoid.getBoneNode(
        THREE.VRMSchema.HumanoidBoneName[name]
    );
    if (!Part) { return }

    let euler = new THREE.Euler(
        rotation.x * dampener,
        rotation.y * dampener,
        rotation.z * dampener
    );
    let quaternion = new THREE.Quaternion().setFromEuler(euler);
    Part.quaternion.slerp(quaternion, lerpAmount); // interpolate
};

// Animate Position Helper Function
const rigPosition = (
    name,
    position = { x: 0, y: 0, z: 0 },
    dampener = 0.09,
    lerpAmount = 0.01,
) => {
    if (!currentVrm) { return }
    const Part = currentVrm.humanoid.getBoneNode(
        THREE.VRMSchema.HumanoidBoneName[name]
    );
    if (!Part) { return }
    let vector = new THREE.Vector3(
        position.x * dampener,
        position.y * dampener,
        position.z * dampener
    );
    Part.position.lerp(vector, lerpAmount); // interpolate
};

let oldLookTarget = new THREE.Euler()
const rigFace = (riggedFace) => {
    if (!currentVrm) { return }
    rigRotation("Neck", riggedFace.head);

    // Blendshapes and Preset Name Schema
    const Blendshape = currentVrm.blendShapeProxy;
    const PresetName = THREE.VRMSchema.BlendShapePresetName;

    // Simple example without winking. Interpolate based on old blendshape, then stabilize blink with `Kalidokit` helper function.
    // for VRM, 1 is closed, 0 is open.
    // riggedFace.eye.l = lerp(clamp(0.5 - riggedFace.eye.l, -0.5, 1.5), Blendshape.getValue(PresetName.Blink), 0.5);
    // riggedFace.eye.r = lerp(clamp(0.5 - riggedFace.eye.r, -0.5, 1.5), Blendshape.getValue(PresetName.Blink), 0.5);

    riggedFace.eye = Kalidokit.Face.stabilizeBlink(riggedFace.eye, riggedFace.head.y);

    Blendshape.setValue(PresetName.Blink, 1.0 - riggedFace.eye.l);

    // Interpolate and set mouth blendshapes
    Blendshape.setValue(PresetName.I, lerp(riggedFace.mouth.shape.I, Blendshape.getValue(PresetName.I), .5));
    Blendshape.setValue(PresetName.A, lerp(riggedFace.mouth.shape.A, Blendshape.getValue(PresetName.A), .5));
    Blendshape.setValue(PresetName.E, lerp(riggedFace.mouth.shape.E, Blendshape.getValue(PresetName.E), .5));
    Blendshape.setValue(PresetName.O, lerp(riggedFace.mouth.shape.O, Blendshape.getValue(PresetName.O), .5));
    Blendshape.setValue(PresetName.U, lerp(riggedFace.mouth.shape.U, Blendshape.getValue(PresetName.U), .5));

    //PUPILS
    //interpolate pupil and keep a copy of the value
    let lookTarget =
        new THREE.Euler(
            lerp(oldLookTarget.x, riggedFace.pupil.y, .4),
            lerp(oldLookTarget.y, riggedFace.pupil.x, .4),
            0,
            "XYZ"
        )
    oldLookTarget.copy(lookTarget)
    currentVrm.lookAt.applyer.lookAt(lookTarget);
}

/* VRM Character Animator */
const animateVRM = (vrm, results, sID) => {
    if (!vrm) {
        return;
    }

    const faceLandmarks = results.faceLandmarks;
    // Pose 3D Landmarks are with respect to Hip distance in meters
    const pose3DLandmarks = results.ea;
    // Pose 2D landmarks are with respect to videoWidth and videoHeight
    const pose2DLandmarks = results.poseLandmarks;
    // Be careful, hand landmarks may be reversed
    const leftHandLandmarks = results.rightHandLandmarks;
    const rightHandLandmarks = results.leftHandLandmarks;

    // Animate Face
    if (faceLandmarks) {
        riggedFace = virtualModels[sID].riggedCharacter.riggedFace;
        rigFace(riggedFace);
    }

    // Animate Pose
    if (pose2DLandmarks && pose3DLandmarks) {
        riggedPose = virtualModels[sID].riggedCharacter.riggedPose;
        rigRotation("Hips", riggedPose.Hips.rotation, 0.01);
        // rigPosition(
        //     "Hips",
        //     {
        //         x: -riggedPose.Hips.position.x - 0.1, // Reverse direction
        //         y: riggedPose.Hips.position.y + 1, // Add a bit of height
        //         z: -riggedPose.Hips.position.z - 0.1 // Reverse direction
        //     },
        // );

        rigRotation("Chest", riggedPose.Spine, 0.09);
        rigRotation("Spine", riggedPose.Spine, 0.09);

        rigRotation("RightUpperArm", riggedPose.RightUpperArm, 0.9, .15);
        rigRotation("RightLowerArm", riggedPose.RightLowerArm, 0.9, .15);
        rigRotation("LeftUpperArm", riggedPose.LeftUpperArm, 0.9, .15);
        rigRotation("LeftLowerArm", riggedPose.LeftLowerArm, 0.9, .15);

        rigRotation("LeftUpperLeg", riggedPose.LeftUpperLeg, 0.8, .15);
        rigRotation("LeftLowerLeg", riggedPose.LeftLowerLeg, 0.8, .15);
        rigRotation("RightUpperLeg", riggedPose.RightUpperLeg, 0.8, .15);
        rigRotation("RightLowerLeg", riggedPose.RightLowerLeg, 0.8, .15);
    }

    // Animate Hands
    if (leftHandLandmarks && riggedPose.LeftHand.LeftWrist) {
        riggedLeftHand = virtualModels[sID].riggedCharacter.riggedLeftHand;
        rigRotation("LeftHand", {
            // Combine pose rotation Z and hand rotation X Y
            z: riggedPose.LeftHand.z,
            y: riggedLeftHand.LeftWrist.y,
            x: riggedLeftHand.LeftWrist.x
        });
        rigRotation("LeftRingProximal", riggedLeftHand.LeftRingProximal);
        rigRotation("LeftRingIntermediate", riggedLeftHand.LeftRingIntermediate);
        rigRotation("LeftRingDistal", riggedLeftHand.LeftRingDistal);
        rigRotation("LeftIndexProximal", riggedLeftHand.LeftIndexProximal);
        rigRotation("LeftIndexIntermediate", riggedLeftHand.LeftIndexIntermediate);
        rigRotation("LeftIndexDistal", riggedLeftHand.LeftIndexDistal);
        rigRotation("LeftMiddleProximal", riggedLeftHand.LeftMiddleProximal);
        rigRotation("LeftMiddleIntermediate", riggedLeftHand.LeftMiddleIntermediate);
        rigRotation("LeftMiddleDistal", riggedLeftHand.LeftMiddleDistal);
        rigRotation("LeftThumbProximal", riggedLeftHand.LeftThumbProximal);
        rigRotation("LeftThumbIntermediate", riggedLeftHand.LeftThumbIntermediate);
        rigRotation("LeftThumbDistal", riggedLeftHand.LeftThumbDistal);
        rigRotation("LeftLittleProximal", riggedLeftHand.LeftLittleProximal);
        rigRotation("LeftLittleIntermediate", riggedLeftHand.LeftLittleIntermediate);
        rigRotation("LeftLittleDistal", riggedLeftHand.LeftLittleDistal);
    }
    if (rightHandLandmarks && riggedPose.RightHand.RightWrist) {
        riggedRightHand = virtualModels[sID].riggedCharacter.riggedRightHand;
        rigRotation("RightHand", {
            // Combine Z axis from pose hand and X/Y axis from hand wrist rotation
            z: riggedPose.RightHand.z,
            y: riggedRightHand.RightWrist.y,
            x: riggedRightHand.RightWrist.x
        });
        rigRotation("RightRingProximal", riggedRightHand.RightRingProximal);
        rigRotation("RightRingIntermediate", riggedRightHand.RightRingIntermediate);
        rigRotation("RightRingDistal", riggedRightHand.RightRingDistal);
        rigRotation("RightIndexProximal", riggedRightHand.RightIndexProximal);
        rigRotation("RightIndexIntermediate", riggedRightHand.RightIndexIntermediate);
        rigRotation("RightIndexDistal", riggedRightHand.RightIndexDistal);
        rigRotation("RightMiddleProximal", riggedRightHand.RightMiddleProximal);
        rigRotation("RightMiddleIntermediate", riggedRightHand.RightMiddleIntermediate);
        rigRotation("RightMiddleDistal", riggedRightHand.RightMiddleDistal);
        rigRotation("RightThumbProximal", riggedRightHand.RightThumbProximal);
        rigRotation("RightThumbIntermediate", riggedRightHand.RightThumbIntermediate);
        rigRotation("RightThumbDistal", riggedRightHand.RightThumbDistal);
        rigRotation("RightLittleProximal", riggedRightHand.RightLittleProximal);
        rigRotation("RightLittleIntermediate", riggedRightHand.RightLittleIntermediate);
        rigRotation("RightLittleDistal", riggedRightHand.RightLittleDistal);
    }
};


onResults = (results, socketID) => {
    // Animate model
    currentVrm = virtualModels[socketID].vrm;
    animateVRM(currentVrm, results, socketID);
}

removeModel = (sID) => {
    var selectedObject = scene.getObjectByName(sID);
    scene.remove(selectedObject);

    if (xPosition > 0) {
        xPosition -= 3.0;
    }

    updateCamera(true, sID);
}

var updateCamera = (remove, sID) => {
    if (remove) {
        cameraXPosition -= 0.25;
        cameraZPosition -= 0.25;
    } else {
        cameraXPosition += 0.25;
        cameraZPosition += 0.25;
    }

    // camera
    // orbitCamera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
    // orbitCamera.position.set(cameraXPosition, 1.0, cameraZPosition);

    animate();
}
