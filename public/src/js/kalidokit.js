import { VRButton } from "https://unpkg.com/three@0.133.0/examples/jsm/webxr/VRButton.js";
// import { Utils } from "https://cdn.jsdelivr.net/npm/kalidokit@1.1.5/dist/index.min.js";

var remap;
var clamp;
var lerp;

var kalidokitLibrary;
var threeLibrary;

var currentVrm;
var virtualModels;
var kalidokit;

export class KalidoKit {
    renderer;
    scene;

    clock;
    camera;

    loader;

    currentVrm;
    currentRiggingData;
    loggedInUser;

    virtualModels;

    constructor(loggedInUser, threeSetUp) {
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        // this.renderer.outputEncoding = THREE.sRGBEncoding;
        document.body.appendChild(this.renderer.domElement);

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 400);

        this.clock = new THREE.Clock();

        this.loader = new THREE.GLTFLoader();
        this.loader.crossOrigin = "anonymous";

        this.virtualModels = {};

        kalidokit = this;

        if (threeSetUp) {
            threeSetUp(this.renderer, this.scene, this.camera);
        }

        this.loggedInUser = loggedInUser;
        if (this.loggedInUser) {
            document.body.appendChild(VRButton.createButton(this.renderer));
            this.renderer.xr.enabled = true;

            document.getElementById("VRButton").style.bottom = "50%";
            document.getElementById("VRButton").style.right = "50%";

            document.getElementById("VRButton").addEventListener('click', () => {
                var selectedObject = this.scene.getObjectByName(this.loggedInUser);
                if (selectedObject) {
                    this.camera.rotation.y = Math.PI; // Rotate model 180deg to face camera
                    this.camera.y += 1.0; // Move a little away from the face.
                    selectedObject.add(this.camera);
                }
            });
        }
    }

    loadUser(socketID, modelURL, userName) {
        this.loader.load(
            modelURL,
            gltf => {
                THREE.VRMUtils.removeUnnecessaryJoints(gltf.scene);
                THREE.VRM.from(gltf).then(vrm => {
                    let object = vrm.scene;
                    object.name = socketID;

                    object.scale.set(3, 3, 3);

                    object.position.y = /* position.y; */ -100.00;
                    object.position.z = /* position.z; */ -25.0;
                    this.scene.add(object);

                    this.virtualModels[socketID] = {};
                    this.virtualModels[socketID].riggedCharacter = {};
                    this.virtualModels[socketID].vrm = vrm;

                    vrm.scene.rotation.y = 0.0; // Rotate model 180deg to face camera
                    vrm.scene.position.x = /* position.x; */ 0.0;
                });
            },
            progress => {
                console.log(
                    "Loading model...",
                    100.0 * (progress.loaded / progress.total),
                    "%"
                );
            },
            error => console.error(error)
        );
    }

    unloadUser(socketID, userName) {
        var selectedObject = this.scene.getObjectByName(socketID);
        this.scene.remove(selectedObject);
    }

    onResults(results, socketID) {
        this.currentVrm = this.virtualModels[socketID].vrm;
        currentVrm = this.currentVrm;
        virtualModels = this.virtualModels;

        animateVRM(this.currentVrm, results, socketID);
    }

    onThreeSetUp(callback) {
        this._threeSetUpCallback = callback;
    }

    sendLibrary(kalidokitObject) {
        kalidokitLibrary = kalidokitObject;
        remap = kalidokitLibrary.Utils.remap;
        clamp = kalidokitLibrary.Utils.clamp;
        lerp = kalidokitLibrary.Vector.lerp;
        // console.log(kalidokitLibrary);
    }

    sendTHREE(threeObject) {
        threeLibrary = threeObject;
        oldLookTarget = new threeLibrary.Euler();
        // console.log(threeObject);
    }

}

// KalidoKit Rigging Methods ------------------------------------------------------------------
var riggedPose, riggedLeftHand, riggedRightHand, riggedFace;

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

let oldLookTarget;
const rigFace = (riggedFace) => {
    if (!oldLookTarget) {
        oldLookTarget = new threeLibrary.Euler();
    }

    if (!currentVrm) { return }
    rigRotation("Neck", riggedFace.head);

    // Blendshapes and Preset Name Schema
    const Blendshape = currentVrm.blendShapeProxy;
    const PresetName = THREE.VRMSchema.BlendShapePresetName;

    // Simple example without winking. Interpolate based on old blendshape, then stabilize blink with `Kalidokit` helper function.
    // for VRM, 1 is closed, 0 is open.
    // riggedFace.eye.l = lerp(clamp(0.5 - riggedFace.eye.l, -0.5, 1.5), Blendshape.getValue(PresetName.Blink), 0.5);
    // riggedFace.eye.r = lerp(clamp(0.5 - riggedFace.eye.r, -0.5, 1.5), Blendshape.getValue(PresetName.Blink), 0.5);

    riggedFace.eye = kalidokitLibrary.Face.stabilizeBlink(riggedFace.eye, riggedFace.head.y);

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

    // console.log("Animating ", sID);

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