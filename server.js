const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
var path = require('path');
const fs = require('fs');
const { SocketAddress } = require('net');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html/');
});

// var classroomSocketID;

// When a user opens any application...
// io.on('connection', (socket) => {
//     socket.on('getSocketID', () => {
//         console.log("Giving the client their socket ID...");
//         let socketID = socket.id;
//         socket.emit('recievedSocketID', socketID);
//     });

//     socket.on('classroomConnected', () => {
//         classroomSocketID = socket.id;
//         console.log('classroom ' + socket.id + ' connected');
//         console.log("Getting connected users...");

//         // Let the client that opened the window know your socketID.
//         socket.broadcast.emit("sendMainUserDetails", classroomSocketID);

//         fs.readFile('./public/examples/embodied-vr/virtual-classroom-data/connected-users.json', 'utf8', function readFileCallback(err, data) {
//             if (err) {
//                 console.log(err);
//             } else {
//                 let users = JSON.parse(data);
//                 console.log("Sending connected users to classroom...", users);
//                 socket.emit("recievedConnectedUsers", users, classroomSocketID); // Broadcast the connected users the classroom socket ID.
//             }
//         });
//     });


//     socket.on("disconnect", () => {
//         if (socket.id != classroomSocketID) {
//             console.log("user " + socket.id + " disconnecting...");

//             fs.readFile('./public/examples/embodied-vr/virtual-classroom-data/connected-users.json', 'utf8', function readFileCallback(err, data) {
//                 if (err) {
//                     console.log(err);
//                 } else {
//                     let users = JSON.parse(data);
//                     for (var i = 0; i < users.length; i++) {
//                         if (users[i].socketID == socket.id) {
//                             users.splice(i, 1); // Remove the user.
//                             break;
//                         }
//                     }
//                     jsonString = JSON.stringify(users);
//                     fs.writeFile('./public/examples/embodied-vr/virtual-classroom-data/connected-users.json', jsonString, 'utf8', () => {
//                         console.log("Updated connected users to classroom...", users);
//                         socket.emit("recievedConnectedUsers", users); // Broadcast the connected users.
//                     });

//                     socket.broadcast.emit("removeModel", socket.id);
//                 }
//             });
//         }
//     });
// });

// // When a user selects a character and sends it.
// io.on('connection', (socket) => {
//     // Recieve the main character model from the client.
//     socket.on('sendMainVRMModel', (vrmURL, userName, indexSocketID, cSocketID) => {
//         if (classroomSocketID == cSocketID) {
//             fs.readFile('./public/examples/embodied-vr/virtual-classroom-data/connected-users.json', 'utf8', function readFileCallback(err, data) {
//                 if (err) {
//                     console.log(err);
//                 } else {
//                     users = JSON.parse(data);

//                     // Check if user already has a model.
//                     let foundModel = false;
//                     for (var i = 0; i < users.length; i++) {
//                         if (users[i].socketID == indexSocketID) {
//                             users[i].userName = userName;
//                             users[i].vrmURL = vrmURL;
//                             foundModel = true;
//                             break;
//                         }
//                     }

//                     // If the user doesn't have a model, make a new one.
//                     if (!foundModel) {
//                         users.push({ socketID: indexSocketID, userName: userName, vrmURL: vrmURL });
//                     }

//                     jsonString = JSON.stringify(users);
//                     fs.writeFile('./public/examples/embodied-vr/virtual-classroom-data/connected-users.json', jsonString, 'utf8', () => {
//                         socket.broadcast.emit("recievedMainVRMModel", vrmURL, indexSocketID, userName); // Tell the classroom your main character.                    // Broadcast the new character to the mobile users.
//                     });
//                 }
//             });
//         }
//     });

//     socket.on('sendVRMModel', (vrmURL, userName, indexSocketID, cSocketID) => {
//         if (classroomSocketID != cSocketID) {
//             fs.readFile('./public/examples/embodied-vr/virtual-classroom-data/connected-users.json', 'utf8', function readFileCallback(err, data) {
//                 if (err) {
//                     console.log(err);
//                 } else {
//                     users = JSON.parse(data);

//                     // Check if user already has a model.
//                     let foundModel = false;
//                     for (var i = 0; i < users.length; i++) {
//                         if (users[i].socketID == indexSocketID) {
//                             users[i].userName = userName;
//                             users[i].vrmURL = vrmURL;
//                             foundModel = true;
//                             break;
//                         }
//                     }

//                     // If the user doesn't have a model, make a new one.
//                     if (!foundModel) {
//                         users.push({ socketID: indexSocketID, userName: userName, vrmURL: vrmURL });
//                     }

//                     jsonString = JSON.stringify(users);
//                     fs.writeFile('./public/examples/embodied-vr/virtual-classroom-data/connected-users.json', jsonString, 'utf8', () => {
//                         socket.broadcast.emit("recievedVRMModel", vrmURL, indexSocketID, userName); // Broadcast the new character to the mobile users.
//                     });
//                 }
//             });
//         }
//     });
// });

// Methods -----------------------------------------------------------------------------------------------------------
var allClients = [];

// When a user joins a room, assign them to the room.
io.on('connection', (socket) => {
    allClients.push(socket);

    socket.on('joinRoom', (roomNumber, data) => {
        try {
            socket.clientType = "user";
            socket.roomNumber = roomNumber;
            socket.data = data;

            console.log(data.name + " " + socket.id + " has joined room: " + roomNumber)
            socket.join(roomNumber);

            updateClassroomData(socket.id, data, () => {
                // Notify the room you joined!
                io.in(roomNumber).emit('userJoined', socket.id, data);
            }, false);
        } catch (e) {
            console.log('[error]', 'join room :', e);
            socket.emit('error', 'couldnt perform requested action');
        }
    });

    socket.on('connectClassroom', (roomNumber) => {
        try {
            socket.clientType = "classroom";
            socket.roomNumber = roomNumber;

            socket.join(roomNumber);
            console.log("classroom " + socket.id + " " + roomNumber + " is online");

            // Update the room with new users.
            getConnectedUsers(roomNumber, (connectedUsers) => {
                io.in(roomNumber).emit('sentConnectedUsers', connectedUsers);
            });

        } catch (e) {
            console.log('[error]', 'join room :', e);
            socket.emit('error', 'couldnt perform requested action');
        }
    });

    socket.on('getConnectedUsers', (roomNumber) => {
        getConnectedUsers(roomNumber, (connectedUsers) => {
            io.in(roomNumber).emit('sentConnectedUsers', connectedUsers);
        });
    });

    socket.on('disconnect', () => {
        if (socket.clientType == "user" && socket.roomNumber && socket.data) { // A user disconnected...
            console.log(socket.roomNumber, socket.data);

            let roomNumber = socket.roomNumber;
            let data = socket.data;

            try {
                console.log(data.name + " " + socket.id + " has left room: " + roomNumber)
                socket.leave(roomNumber);

                updateClassroomData(socket.id, data, () => {
                    // Notify the room you joined!
                    io.in(roomNumber).emit('userLeft', socket.id, data);
                }, true);
            } catch (e) {
                console.log('[error]', 'leave room :', e);
                socket.emit('error', 'couldnt perform requested action');
            }

        } else if (socket.clientType == "classroom") { // A classroom viewer disconnected...

        }

    });

    socket.on('leaveRoom', (roomNumber, data) => {
        try {
            console.log(data.name + " " + socket.id + " has left room: " + roomNumber)
            socket.leave(roomNumber);

            updateClassroomData(socket.id, data, () => {
                // Notify the room you joined!
                io.in(roomNumber).emit('userLeft', socket.id, data);
            }, true);
        } catch (e) {
            console.log('[error]', 'leave room :', e);
            socket.emit('error', 'couldnt perform requested action');
        }
    });
})

// When a desktop application gets MediaPipe results, broadcast it to the mobile phone.
io.on('connection', (socket) => {
    socket.on('recievedMPResults', (results, indexSocketID, roomNumber) => {
        // console.log(results);
        if (roomNumber) {
            io.in(roomNumber).emit("sentMPResults", results, indexSocketID); // Broadcast the results to the mobile users.
        }
    });

    socket.on('recievedRiggedData', (data, indexSocketID, roomNumber) => {
        // console.log(data);
        if (roomNumber) {
            io.in(roomNumber).emit("sentRiggedData", data, indexSocketID); // Broadcast the rigged data to the mobile users.
        }
    });
});


// Establishing the port
const PORT = process.env.PORT || 8080;

// Executing the server on given port number
server.listen(PORT, console.log(
    `Server started on port ${PORT}`));


function updateClassroomData(userSocketID, userData, callback, remove) {
    fs.readFile('./public/examples/embodied-vr/virtual-classroom-data/connected-users.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            var rooms = JSON.parse(data);

            if (!remove) {
                if (rooms[userData.roomCode] == undefined) {
                    rooms[userData.roomCode] = {};
                }
                // Update the model.
                rooms[userData.roomCode][userSocketID] = {};
                rooms[userData.roomCode][userSocketID].socketID = userSocketID;
                rooms[userData.roomCode][userSocketID].data = userData;
            } else {
                if (rooms[userData.roomCode] != undefined) {
                    delete rooms[userData.roomCode][userSocketID];
                }
            }

            jsonString = JSON.stringify(rooms, null, 2);
            fs.writeFile('./public/examples/embodied-vr/virtual-classroom-data/connected-users.json', jsonString, 'utf8', () => { });
            callback();
        }
    });
}

function getConnectedUsers(roomNumber, callback) {
    fs.readFile('./public/examples/embodied-vr/virtual-classroom-data/connected-users.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            var rooms = JSON.parse(data);
            var usersInRoom = rooms[roomNumber];
            if (usersInRoom) {
                callback(usersInRoom);
            }
        }
    });
}