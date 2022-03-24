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

    leaveRoom(roomNumber, data) {
        // Manually invoke the disconnect.
        this.socket.emit("leaveRoom", roomNumber, data);
    }
}

export class VirtualRealityRoom {
    socket;
    roomNumber;

    connectedUsers = {};

    kalidokit;

    _userJoinCallback;
    _userLeftCallback;

    constructor(roomNumber, loggedInUser, threeSetUp, onLoad) {
        this.roomNumber = roomNumber;
        this.socket = io();

        this.socket.on('sentConnectedUsers'), () => {
            this.connectedUsers = users;
        };

        this.socket.emit('connectClassroom', roomNumber); // This will connect the classroom and update connectedUsers.

        this.socket.on('sentConnectedUsers', (users) => {
            this.connectedUsers = users;

            var userSocketID;
            var data;

            if (!this.kalidokit) { // Updating the users for the first time...
                if (loggedInUser || loggedInUser != "") { // A user entered their generated code...
                    for (const socketID in this.connectedUsers) {
                        if (this.connectedUsers[socketID].data.generatedCode == loggedInUser) {
                            // console.log(this.connectedUsers[socketID].data.generatedCode, loggedInUser);
                            // Step 1: Set up the THREE.js environment.
                            this.kalidokit = new KalidoKit(socketID, threeSetUp);
                            this.kalidokit.sendLibrary(Kalidokit);
                            this.kalidokit.sendTHREE(THREE);

                            // Step 2: Set up variables for callbacks.
                            userSocketID = socketID;
                            data = this.connectedUsers[socketID].data;

                            // Step 3: Set up the results and rigging data.
                            var kalidokit = this.kalidokit;

                            this.socket.on('sentMPResults', function (results, socketID) {
                                // console.log(results);
                                this.on('sentRiggedData', function (riggedData, socketID) {
                                    // console.log(kalidokit.virtualModels, socketID);
                                    if (kalidokit && kalidokit.virtualModels[socketID]) {
                                        kalidokit.virtualModels[socketID].riggedCharacter = riggedData;
                                        kalidokit.onResults(results, socketID);
                                    }
                                });
                            });
                            break;
                        }
                    }

                    // Load the viewing user.
                    if (this.loadUserOnJoin) {
                        this.loadUser(userSocketID, data);
                    }

                    // Load the other users.
                    for (const socketID in this.connectedUsers) {
                        if (socketID != userSocketID) {
                            let otherUserSocketID = socketID;
                            let otherUserdata = this.connectedUsers[socketID].data;

                            if (this.loadUserOnJoin) {
                                this.loadUser(otherUserSocketID, otherUserdata);
                            }
                        }
                    }

                    if (onLoad) {
                        onLoad(this.kalidokit);
                    }
                } else { // A user is just viewing the room.
                    // Step 1: Set up the THREE.js environment.
                    this.kalidokit = new KalidoKit(null, threeSetUp);
                    this.kalidokit.sendLibrary(Kalidokit);
                    this.kalidokit.sendTHREE(THREE);

                    // Step 2: Load the users.
                    for (const socketID in this.connectedUsers) {
                        // Step 2: Set up variables for callbacks.
                        userSocketID = socketID;
                        data = this.connectedUsers[socketID].data;

                        if (this.loadUserOnJoin) {
                            this.loadUser(userSocketID, data);
                        }
                    }

                    // Step 3: Set up the results and rigging data.
                    var kalidokit = this.kalidokit;

                    this.socket.on('sentMPResults', function (results, socketID) {
                        // console.log(results);
                        this.on('sentRiggedData', function (riggedData, socketID) {
                            // console.log(kalidokit.virtualModels, socketID);
                            if (kalidokit && kalidokit.virtualModels[socketID]) {
                                kalidokit.virtualModels[socketID].riggedCharacter = riggedData;
                                kalidokit.onResults(results, socketID);
                            }
                        });
                    });

                    if (onLoad) {
                        onLoad(this.kalidokit);
                    }

                }

                if (this._userJoinCallback) {
                    // console.log("Calling client made callback...");
                    this._userJoinCallback();
                }

            } else { // Just updating users manually...
                if (this.renderModel) {
                    // console.log("Current Users: ", users);
                    this.renderModel();
                }

                if (this._userJoinCallback) {
                    // console.log("Calling client made callback...");
                    this._userJoinCallback();
                }

                if (this._userLeftCallback) {
                    this._userLeftCallback();
                }
            }

            console.log("Updated users from callback...", users);
        });
    }

    _renderModelCallback = (userSocketID, data) => {
        // console.log("Running renderModel() for ", userSocketID);
        if (userSocketID && data) {
            if (this.loadUserOnJoin) {
                this.loadUser(userSocketID, data);
            }
        }
    };
    renderModel = () => { };

    onUserJoined(callback) {
        this._userJoinCallback = callback;

        this.socket.on('userJoined', (userSocketID, data) => {
            // this._userJoinCallback = callback;

            this.renderModel = () => { this._renderModelCallback(userSocketID, data); };
            // console.log("Converted renderModel() to ", userSocketID);

            this.socket.emit('getConnectedUsers', data.roomCode); // This will update connectedUsers.
        });
    }

    onUserLeft(callback) {
        this._userLeftCallback = callback;

        this.socket.on('userLeft', (userSocketID, data) => {
            // this._userLeftCallback = callback;

            this.socket.emit('getConnectedUsers', data.roomCode); // This will update connectedUsers.

            if (this.unloadUserOnLeave) {
                this.unloadUser(userSocketID);
            }
        });
    }

    loadUser(userSocketID) {
        if (this.connectedUsers) {
            let userInfo = this.connectedUsers[userSocketID];

            if (userInfo && userSocketID) {
                console.log("Loading " + userSocketID + "...");

                // Load the user in Three.js
                let socketID = userInfo.socketID;
                let vrmURL = userInfo.data.vrmURL;
                let name = userInfo.data.name;

                this.kalidokit.loadUser(socketID, vrmURL, name);
            }
        } else {
            console.log("Missed loading ", userSocketID);
        }
    }

    unloadUser(userSocketID) {
        if (userSocketID) {
            console.log("Unloaded " + userSocketID + "...");
            this.kalidokit.unloadUser(userSocketID);
        } else {
            // User is not even loaded?
        }
    }

    onThreeSetUp(callback) {
        this.kalidokit._threeSetUpCallback = callback;
    }
}