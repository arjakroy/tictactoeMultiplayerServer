const { Socket } = require('socket.io');

const io = require('../app').io;

const roomStatus = new Map();

exports.socketController = ()=>{    
    io.on("connection", (socket) => {
        console.log(`Socket connected: ${socket.id}`);
        socket.on("disconnect", (data) => {
            console.log(`Socket disconnected: ${socket.id}`);
        })
        socket.on("createRoom", (roomName)=>{
            socket.join(roomName);
            roomStatus.set(roomName, socket.id);
            console.log(`Socket ${socket.id} joined room ${roomName}`);
        })
        socket.on("joinRoom", (roomName)=>{
            socket.join(roomName);
            console.log(`Socket ${socket.id} joined room ${roomName}`);
            socket.emit("joinedToRoon", roomName);
            var roomHost = roomStatus.get(roomName);
            socket.to(roomHost).emit("otherplayerJoined", socket.id);

       });
       socket.on("moveMade", (data)=>{
        console.log(data.roomname);
        socket.to(data.roomname).emit("moveMade", {
            madeBy: data.madeBy,
            roomname: data.roomname,
            move: data.move
        });
       })

    })
}