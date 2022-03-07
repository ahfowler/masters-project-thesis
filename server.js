const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
var path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html/');
});

// When a user opens the application...
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.broadcast.emit("userConnected", socket.id); // Broadcast new user entering.

    socket.on('disconnect', () => {
        console.log('user disconnected');
        socket.broadcast.emit("userDisconnected", socket.id); // Broadcast new user entering.
    });
});

// When a desktop application gets MediaPipe results, broadcast it to the mobile phone.
io.on('connection', (socket) => {
    socket.on('recievedMPResults', (results) => {
        // console.log(results);
        socket.broadcast.emit("sentMPResults", results); // Broadcast the results to the mobile users.
    });  
});

io.on('connection', (socket) => {
    socket.on('recievedRiggedData', (data) => {
        // console.log(results);
        socket.broadcast.emit("sentRiggedData", data); // Broadcast the rigged data to the mobile users.
    });  
});

// When a user selects a character.
io.on('connection', (socket) => {
    socket.on('receivedVRMModel', (vrmURL) => {
        // console.log(results);
        socket.broadcast.emit("sentVRMModel", vrmURL, socket.id); // Broadcast the new character to the mobile users.
    });  
});

// io.on('connection', (socket) => {
//     socket.on('chat message', (msg) => {
//         console.log('message: ' + msg);
//     });
// });

// io.on('connection', (socket) => {
//     socket.on('chat message', (msg) => {
//         io.emit('chat message', msg);
//     });
// });


// server.listen(8080, () => {
//     console.log('listening on localhost:8080');
// });

// Establishing the port
const PORT = process.env.PORT || 8080;
 
// Executing the server on given port number
server.listen(PORT, console.log(
  `Server started on port ${PORT}`));