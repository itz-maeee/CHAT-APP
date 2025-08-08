import {Server} from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    }
});

export function getReceiverSocketId(userId){
    return userSocketMap[userId];
}

//used to store online users
const userSocketMap = {};

io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    const userId = socket.handshake.query.userId;
    console.log("Received userId:", userId);

    if (userId) {
        userSocketMap[userId] = socket.id;

        // Emit immediately
        io.emit("getOnlineUsers", Object.keys(userSocketMap));

        // Emit again after 500ms to avoid race condition
        setTimeout(() => {
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        }, 500);
    }

    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});


export {io, app, server};