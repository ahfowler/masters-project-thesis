const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
var path = require('path');
const fs = require('fs');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html/');
});

var classroomSocketID;

// When a user opens any application...
io.on('connection', (socket) => {
    socket.on('getSocketID', () => {
        console.log("Giving the client their socket ID...");
        let socketID = socket.id;
        socket.emit('recievedSocketID', socketID);
    });

    socket.on('classroomConnected', () => {
        classroomSocketID = socket.id;
        console.log('classroom ' + socket.id + ' connected');
        console.log("Getting connected users...");

        // Let the client that opened the window know your socketID.
        socket.broadcast.emit("sendMainUserDetails", classroomSocketID);

        fs.readFile('./public/examples/embodied-vr/virtual-classroom-data/connected-users.json', 'utf8', function readFileCallback(err, data) {
            if (err) {
                console.log(err);
            } else {
                let users = JSON.parse(data);
                console.log("Sending connected users to classroom...", users);
                socket.emit("recievedConnectedUsers", users, classroomSocketID); // Broadcast the connected users the classroom socket ID.
            }
        });
    });


    socket.on("disconnect", () => {
        if (socket.id != classroomSocketID) {
            console.log("user " + socket.id + " disconnecting...");

            fs.readFile('./public/examples/embodied-vr/virtual-classroom-data/connected-users.json', 'utf8', function readFileCallback(err, data) {
                if (err) {
                    console.log(err);
                } else {
                    let users = JSON.parse(data);
                    for (var i = 0; i < users.length; i++) {
                        if (users[i].socketID == socket.id) {
                            users.splice(i, 1); // Remove the user.
                            break;
                        }
                    }
                    jsonString = JSON.stringify(users);
                    fs.writeFile('./public/examples/embodied-vr/virtual-classroom-data/connected-users.json', jsonString, 'utf8', () => {
                        console.log("Updated connected users to classroom...", users);
                        socket.emit("recievedConnectedUsers", users); // Broadcast the connected users.
                    });

                    socket.broadcast.emit("removeModel", socket.id);
                }
            });
        }
    });
});

// When a desktop application gets MediaPipe results, broadcast it to the mobile phone.
io.on('connection', (socket) => {
    socket.on('recievedMPResults', (results, indexSocketID) => {
        // console.log(results);
        socket.broadcast.emit("sentMPResults", results, indexSocketID); // Broadcast the results to the mobile users.
    });

    socket.on('recievedRiggedData', (data, indexSocketID) => {
        // console.log(results);
        socket.broadcast.emit("sentRiggedData", data, indexSocketID); // Broadcast the rigged data to the mobile users.
    });
});

// When a user selects a character and sends it.
io.on('connection', (socket) => {
    // Recieve the main character model from the client.
    socket.on('sendMainVRMModel', (vrmURL, userName, indexSocketID, cSocketID) => {
        if (classroomSocketID == cSocketID) {
            fs.readFile('./public/examples/embodied-vr/virtual-classroom-data/connected-users.json', 'utf8', function readFileCallback(err, data) {
                if (err) {
                    console.log(err);
                } else {
                    users = JSON.parse(data);

                    // Check if user already has a model.
                    let foundModel = false;
                    for (var i = 0; i < users.length; i++) {
                        if (users[i].socketID == indexSocketID) {
                            users[i].userName = userName;
                            users[i].vrmURL = vrmURL;
                            foundModel = true;
                            break;
                        }
                    }

                    // If the user doesn't have a model, make a new one.
                    if (!foundModel) {
                        users.push({ socketID: indexSocketID, userName: userName, vrmURL: vrmURL });
                    }

                    jsonString = JSON.stringify(users);
                    fs.writeFile('./public/examples/embodied-vr/virtual-classroom-data/connected-users.json', jsonString, 'utf8', () => {
                        socket.broadcast.emit("recievedMainVRMModel", vrmURL, indexSocketID, userName); // Tell the classroom your main character.                    // Broadcast the new character to the mobile users.
                    });
                }
            });
        }
    });

    socket.on('sendVRMModel', (vrmURL, userName, indexSocketID, cSocketID) => {
        if (classroomSocketID != cSocketID) {
            fs.readFile('./public/examples/embodied-vr/virtual-classroom-data/connected-users.json', 'utf8', function readFileCallback(err, data) {
                if (err) {
                    console.log(err);
                } else {
                    users = JSON.parse(data);

                    // Check if user already has a model.
                    let foundModel = false;
                    for (var i = 0; i < users.length; i++) {
                        if (users[i].socketID == indexSocketID) {
                            users[i].userName = userName;
                            users[i].vrmURL = vrmURL;
                            foundModel = true;
                            break;
                        }
                    }

                    // If the user doesn't have a model, make a new one.
                    if (!foundModel) {
                        users.push({ socketID: indexSocketID, userName: userName, vrmURL: vrmURL });
                    }

                    jsonString = JSON.stringify(users);
                    fs.writeFile('./public/examples/embodied-vr/virtual-classroom-data/connected-users.json', jsonString, 'utf8', () => {
                        socket.broadcast.emit("recievedVRMModel", vrmURL, indexSocketID, userName); // Broadcast the new character to the mobile users.
                    });
                }
            });
        }
    });
});

// Establishing the port
const PORT = process.env.PORT || 8080;

// Executing the server on given port number
server.listen(PORT, console.log(
    `Server started on port ${PORT}`));