const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const {
    pubClient,
    subClient,
    connectRedis
} = require("./redisClient");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {

    cors: {

        origin: "*",

        methods: ["GET","POST"]

    }

});

const PORT = 3001;
const SERVER_NAME = "Server 2";

let users = [];

app.use(express.static("public"));

async function startServer() {

    await connectRedis();

    console.log("✅ Redis Connected");

    // Subscribe Redis Channel
    await subClient.subscribe("nexatech_channel", (message) => {

        const data = JSON.parse(message);

        switch (data.type) {

            case "message":

                console.log(
                    `[SYNC] ${data.payload.username} (${data.payload.role}) : ${data.payload.text}`
                );

                io.emit("message", data.payload);

                break;

            case "users":

                users = data.payload;
                io.emit("users", users);
                break;
        }

    });

    io.on("connection", (socket) => {

        console.log(`🔌 Client Connected : ${socket.id}`);

        // USER JOIN
        socket.on("join", async (user) => {

            const newUser = {
                id: socket.id,
                username: user.username,
                role: user.role,
                server: SERVER_NAME
            };

            users.push(newUser);

            await pubClient.publish(
                "nexatech_channel",
                JSON.stringify({
                    type: "users",
                    payload: users
                })
            );

            console.log(
                `[JOIN] ${user.username} (${user.role}) connected to ${SERVER_NAME}`
            );
        });

        // MESSAGE
        socket.on("message", async (msg) => {

            console.log(
                `[PUBLISHED] ${msg.username} (${msg.role}) : ${msg.text}`
            );

            await pubClient.publish(
                "nexatech_channel",
                JSON.stringify({
                    type: "message",
                    payload: msg
                })
            );

        });

        // DISCONNECT
        socket.on("disconnect", async () => {

            users = users.filter(
                user => user.id !== socket.id
            );

            await pubClient.publish(
                "nexatech_channel",
                JSON.stringify({
                    type: "users",
                    payload: users
                })
            );

            console.log(`❌ Client Disconnected : ${socket.id}`);

        });

    });

    server.listen(PORT, () => {

        console.log(`🚀 ${SERVER_NAME} running at http://localhost:${PORT}`);

    });

}

startServer();