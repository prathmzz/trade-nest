
import { Server } from "socket.io"; // Import the Server class directly from socket.io
import express from "express";

const mapRouter = express.Router();
const sockets = [];

const initializeSocket = (server) => {
    const io = new Server(server); // Create a new instance of Server

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

// Exporting using ES module syntax
export { mapRouter, initializeSocket };
