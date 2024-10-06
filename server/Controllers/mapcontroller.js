const http = require("http");
const socketio = require("socket.io");
const express = require("express");

const mapRouter = express.Router();
const sockets = [];

const initializeSocket = (server) => {
    const io = socketio(server);
    
    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);
        sockets.push(socket);

        socket.on("send-location", (data) => {
            console.log("Received location from client", data);
            io.emit("receive-location", { id: socket.id, ...data });
        });
        
        socket.on("disconnect", () => {
            console.log("Socket disconnected:", socket.id);
            const index = sockets.indexOf(socket);
            if (index > -1) {
                sockets.splice(index, 1);
            }
        });
    });
};

mapRouter.get("/", (req, res) => {
    res.send("Map API is working");
});

module.exports = { mapRouter, initializeSocket };
