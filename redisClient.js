const { createClient } = require("redis");

// Publisher
const pubClient = createClient({
    url: "redis://localhost:6379"
});

// Subscriber
const subClient = pubClient.duplicate();

async function connectRedis() {

    await pubClient.connect();
    await subClient.connect();


}

module.exports = {
    pubClient,
    subClient,
    connectRedis
};