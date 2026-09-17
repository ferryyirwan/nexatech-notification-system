const servers = [
    "http://localhost:3000",
    "http://localhost:3001"
];

let currentServer =
    window.location.port === "3001"
        ? 1
        : 0;
let socket = null;

const username = document.getElementById("username");
const connectBtn = document.getElementById("connectBtn");
const userList = document.getElementById("userList");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const currentSession =
    document.getElementById("currentSession");

const announcementCard =
    document.getElementById("announcementCard");
    
const responses =
    document.getElementById("responses");
const serverStatus = document.getElementById("serverStatus");

let currentUser = "";
let currentRole = "";
let hasJoined = false;

let retryCount = 0;
const MAX_RETRY = servers.length;
let reconnectInterval = null;  

// ======================================
// CONNECT TO SERVER
// ======================================

function connectSocket() {

    if (socket) {
        socket.removeAllListeners();
        socket.disconnect();
    }

    socket = io(servers[currentServer], {
        reconnection: false,
        timeout: 3000
    });

    // Connected
    socket.on("connect", () => {

        retryCount = 0;
        if (reconnectInterval) {

            clearInterval(reconnectInterval);

            reconnectInterval = null;

        }

        serverStatus.innerHTML =
            `🟢 Connected to Server ${currentServer + 1}`;



        console.log(`Connected to ${servers[currentServer]}`);

        if (hasJoined) {
            

            socket.emit("join", {
                username: currentUser,
                role: currentRole
            });

        }

    });

    // Connection Failed
    socket.on("connect_error", () => {

        console.log(`Cannot connect to ${servers[currentServer]}`);

        failover();

    });

    // Server disconnected
    socket.on("disconnect", (reason) => {

        console.log("Disconnected:", reason);

        if (reason !== "io client disconnect") {

            serverStatus.innerHTML =
                "🔴 Server Disconnected";

                connectBtn.innerHTML = "Connect";
                connectBtn.disabled = false;
                connectBtn.style.background = "#2563EB";

            failover();

        }

    });

    // Connected Users
    socket.on("users", (users) => {

        if (!hasJoined) return;

        userList.innerHTML = "";

        users.forEach(user => {

            const li = document.createElement("li");

const serverClass =
    user.server === "Server 1"
        ? "server1"
        : "server2";

            li.innerHTML = `
            <div class="user-card">

                <strong>🟢 ${user.username}</strong>

                <br>

                <span class="role-badge">

                    ${user.role}

                </span>

                <br>

                <span class="server-badge ${serverClass}">

                    🖥️ ${user.server}

                </span>

            </div>
            `;

            userList.appendChild(li);

        });

    });

    // ======================================
    // RECEIVE MESSAGE
    // ======================================

    socket.on("message", (msg) => {

        if (!hasJoined) return;

        // ==========================
        // LECTURER = ANNOUNCEMENT
        // ==========================


        if (msg.role === "Lecturer") {

            const empty =
                announcementCard.querySelector(".empty-announcement");

            if (empty) {

                empty.remove();

            }

            const card = document.createElement("div");

            card.className = "announcement-item";

            card.innerHTML = `

                <div class="announcement-title">

                    📢 Announcement

                </div>

                <div class="announcement-text">

                    ${msg.text}

                </div>

                <div class="announcement-footer">

                    <span>

                        Posted by <strong>${msg.username}</strong>

                    </span>

                    <span>

                        ${msg.time}

                    </span>

                </div>

            `;

            
            announcementCard.appendChild(card);

            return;

        }

        // ==========================
        // STUDENT = RESPONSE
        // ==========================

        const empty =
            responses.querySelector(".empty-response");

        if (empty) {

            empty.remove();

        }

        const div = document.createElement("div");

        div.className = "message student";

        div.innerHTML = `

            <div class="message-card">

                <div class="message-header">

                    <strong>

                        💬 ${msg.username}

                    </strong>

                    <span class="message-time">

                        ${msg.time}

                    </span>

                </div>

                <div class="message-body">

                    ${msg.text}

                </div>

            </div>

        `;

        responses.appendChild(div);

        responses.scrollTop = responses.scrollHeight;

    });

}

// ======================================
// FAILOVER
// ======================================

function failover() {

    retryCount++;

    if (retryCount >= MAX_RETRY) {

        serverStatus.innerHTML =
            "🔴 No Server Available";

        console.log("No available server.");

        startBackgroundReconnect();

        return;

    }

    currentServer = (currentServer + 1) % servers.length;

    serverStatus.innerHTML =
        `🟡 Switching to Server ${currentServer + 1}...`;

    setTimeout(() => {

        connectSocket();

    }, 1000);

}

// ======================================
// BACKGROUND RECONNECT
// ======================================

function startBackgroundReconnect() {

    if (reconnectInterval) return;

    reconnectInterval = setInterval(() => {

        console.log("Checking available servers...");

        const testSocket = io(servers[currentServer], {

            timeout: 2000,
            reconnection: false

        });

        testSocket.on("connect", () => {

            clearInterval(reconnectInterval);

            reconnectInterval = null;

            testSocket.disconnect();

            retryCount = 0;

            serverStatus.innerHTML =
                "🟡 Reconnecting...";

            connectSocket();

        });

        testSocket.on("connect_error", () => {

            testSocket.disconnect();

            currentServer =
                (currentServer + 1) % servers.length;

        });

    }, 3000);

}

// ======================================
// INITIAL CONNECT
// ======================================

connectSocket();

// ======================================
// LOGIN
// ======================================

connectBtn.onclick = () => {

    console.log("Connect button clicked");

    if (username.value.trim() === "") {

        alert("Please enter username.");
        return;

    }

    currentUser = username.value;

    currentRole =
        document.querySelector(
            'input[name="role"]:checked'
        ).value;

        // Change UI based on role

        if (currentRole === "Lecturer") {

            messageInput.placeholder =
                "Write announcement...";

            sendBtn.innerHTML =
                "📢 Post Announcement";

        } else {

            messageInput.placeholder =
                "Write your response...";

            sendBtn.innerHTML =
                "💬 Reply";

        }

        if (currentRole === "Lecturer") {

            currentSession.innerHTML = `

                <div class="session-title">

                    Current Session

                </div>

                <div class="session-role">

                    👨‍🏫 Lecturer

                </div>

                <div class="session-user">

                    👤 ${currentUser}

                </div>

            `;

        } else {

            currentSession.innerHTML = `

                <div class="session-title">

                    Current Session

                </div>

                <div class="session-role">

                    🎓 Student

                </div>

                <div class="session-user">

                    👤 ${currentUser}

                </div>

            `;

        }

    hasJoined = true;

        connectBtn.innerHTML = "✅ Connected";
        connectBtn.disabled = true;
        connectBtn.style.background = "#16A34A";

    socket.emit("join", {
        username: currentUser,
        role: currentRole
    });

};

// ======================================
// SEND MESSAGE
// ======================================

sendBtn.onclick = () => {

    if(!hasJoined){

        alert("Please login first.");

        return;

    }

    if (messageInput.value.trim() === "")
        return;

    socket.emit("message", {

        username: currentUser,
        role: currentRole,
        text: messageInput.value,
        time: new Date().toLocaleTimeString()

    });

    messageInput.value = "";

};

// ======================================
// PRESS ENTER TO SEND MESSAGE
// ======================================

messageInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        event.preventDefault();

        sendBtn.click();

    }

});