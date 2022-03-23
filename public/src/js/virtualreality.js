import { KalidoKit } from "./kalidokit.js";

export class VirtualRealityCamera {
    gesture;
    socket;

    avatar;

    constructor(gestureObject) {
        this.gesture = gestureObject;
        this.socket = io();

        // Set up the user's avatar.
        this.avatar = {};
        this.avatar.riggedCharacter = {
            riggedFace: {},
            riggedPose: {},
            riggedLeftHand: {},
            riggedRightHand: {}
        };
        this.avatar.socketID = this.socket.id;
        this.avatar.roomNumber;

        this.gesture.onFace((faceLandmarks) => {
            this.avatar.riggedCharacter.riggedFace = Kalidokit.Face.solve(faceLandmarks, {
                runtime: "mediapipe",
                video: this.gesture.mediapipe.videoElement,
                imageSize: { height: 0, width: 0 },
                // smoothBlink: true, // smooth left and right eye blink delays
                // blinkSettings: [0.25, 0.75], // adjust upper and lower bound blink sensitivit
            });
        });

        this.gesture.onPose((pose2DLandmarks, pose3DLandmarks) => {
            this.avatar.riggedCharacter.riggedPose = Kalidokit.Pose.solve(pose3DLandmarks, pose2DLandmarks, {
                runtime: "mediapipe",
                video: this.gesture.mediapipe.videoElement,
                imageSize: { height: 0, width: 0 },
                enableLegs: true,
            });
        });

        this.gesture.onLeftHand((leftHandLandmarks) => {
            this.avatar.riggedCharacter.riggedLeftHand = Kalidokit.Hand.solve(leftHandLandmarks, "Left");
        });

        this.gesture.onRightHand((rightHandLandmarks) => {
            this.avatar.riggedCharacter.riggedRightHand = Kalidokit.Hand.solve(rightHandLandmarks, "Right");
        });

        this.gesture.mediapipe._onEmitCallback = () => {
            if (this.avatar.roomNumber) {
                this.socket.emit('recievedMPResults', this.gesture.mediapipe.mpResults, this.avatar.socketID, this.avatar.roomNumber); // Send the pure results to mobile phone.
                this.socket.emit('recievedRiggedData', this.avatar.riggedCharacter, this.avatar.socketID, this.avatar.roomNumber); // Send the rig data to mobile phone.
            }
        }
    }

    joinRoom(roomNumber, data) {

        this.avatar.roomNumber = roomNumber;
        console.log(data);
        this.avatar.socketID = this.socket.id;
        this.gesture.mediapipe._onEmitCallback = () => {
            // console.log(this.avatar.roomNumber, this.avatar.socketID);
            if (this.avatar.roomNumber) {
                this.socket.emit('recievedMPResults', this.gesture.mediapipe.mpResults, this.avatar.socketID, this.avatar.roomNumber); // Send the pure results to mobile phone.
                this.socket.emit('recievedRiggedData', this.avatar.riggedCharacter, this.avatar.socketID, this.avatar.roomNumber); // Send the rig data to mobile phone.
            }
        }

        this.socket.emit("joinRoom", roomNumber, data);
    }
}

export class VirtualRealityRoom {
    socket;
    roomNumber;

    connectedUsers = {};

    kalidokit;

    constructor(roomNumber, threeSetUp, loggedInUser) {
        this.roomNumber = roomNumber;
        this.socket = io();

        this.socket.on('sentConnectedUsers', (users) => {
            this.connectedUsers = users;
            console.log("Updated users...", users);
        });

        this.socket.emit('connectClassroom', roomNumber); // This will connect the classroom and update connectedUsers.

        // Step 3: Set up the THREE.js environment.
        this.kalidokit = new KalidoKit(loggedInUser, threeSetUp);
        this.kalidokit.sendLibrary(Kalidokit);
        this.kalidokit.sendTHREE(THREE);
    }

    onUserJoined(callback) {
        this.socket.on('userJoined', (userSocketID, data) => {
            console.log(data.roomCode);
            this.socket.emit('getConnectedUsers', data.roomCode); // This will update connectedUsers.

            callback(userSocketID);
        });
    }

    loadUser(userSocketID) {
        let userInfo = this.connectedUsers[userSocketID];
        console.log(userInfo);

        // Load the user in Three.js
        let socketID = userInfo.socketID;
        let vrmURL = userInfo.data.vrmURL;
        let name = userInfo.data.name;

        this.kalidokit.loadUser(socketID, vrmURL, name);

        var kalidokit = this.kalidokit;

        this.socket.on('sentMPResults', function (results, socketID) {
            // console.log(results);
            this.on('sentRiggedData', function (riggedData) {
                // console.log(kalidokit.virtualModels, socketID);
                if (kalidokit && kalidokit.virtualModels[socketID]) {
                    kalidokit.virtualModels[socketID].riggedCharacter = riggedData;
                    kalidokit.onResults(results, socketID);
                }
            });
        });
    }

    onThreeSetUp(callback) {
        this.kalidokit._threeSetUpCallback = callback;
    }
}