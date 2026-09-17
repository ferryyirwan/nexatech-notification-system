# NexaTech Notification System

A distributed real-time notification system built with Node.js, Socket.IO and Redis Pub/Sub for lecturer-student communication.

## ðŸ“Œ Overview

NexaTech Notification System is a distributed real-time communication system developed as an academic project.

The system allows Lecturers to broadcast announcements and Students to receive and respond to messages in real time. WebSocket communication is used for instant message delivery, while Redis Pub/Sub synchronizes communication between multiple application servers.

The system also implements client-side failover and automatic reconnection to maintain communication when one application server becomes unavailable.

## âœ¨ Features

- ðŸ‘¨â€ðŸ« Lecturer and Student role-based interaction
- ðŸ“¢ Real-time announcement broadcasting
- ðŸ’¬ Real-time student responses
- âš¡ WebSocket communication using Socket.IO
- ðŸ”„ Redis Pub/Sub for cross-server synchronization
- ðŸ–¥ï¸ Multi-server architecture
- ðŸ›¡ï¸ Client-side server failover
- ðŸ”Œ Automatic reconnection after server failure
- ðŸ‘¥ Multi-user communication
- ðŸ“‹ Real-time connected-user updates

## ðŸ—ï¸ System Architecture

The system uses two application servers connected through Redis Pub/Sub.

```text
                    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                    â”‚      Redis       â”‚
                    â”‚    Pub / Sub     â”‚
                    â””â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                             â”‚
              â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
              â”‚                             â”‚
     â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â–¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”         â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â–¼â”€â”€â”€â”€â”€â”€â”€â”€â”
     â”‚    Server 1      â”‚         â”‚     Server 2      â”‚
     â”‚    Port 3000     â”‚         â”‚     Port 3001      â”‚
     â”‚   Node.js +      â”‚         â”‚   Node.js +       â”‚
     â”‚    Socket.IO     â”‚         â”‚    Socket.IO      â”‚
     â””â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜         â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
              â”‚                             â”‚
              â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                             â”‚
                     â”Œâ”€â”€â”€â”€â”€â”€â”€â–¼â”€â”€â”€â”€â”€â”€â”€â”€â”
                     â”‚     Clients    â”‚
                     â”‚ Lecturer /     â”‚
                     â”‚    Student     â”‚
                     â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

Redis Pub/Sub allows messages and connected-user information to be synchronized between Server 1 and Server 2.

## ðŸ”„ Failover Mechanism

NexaTech includes client-side failover to improve service availability.

When the connected application server becomes unavailable:

1. The client detects the server disconnection.
2. The client attempts to connect to another available server.
3. The client reconnects automatically.
4. Communication can continue through the available server.

If both servers are unavailable, the system displays a **"No Server Available"** state.

## ðŸ› ï¸ Technologies

- Node.js
- Express.js
- Socket.IO
- Redis
- Redis Pub/Sub
- HTML
- CSS
- JavaScript

## ðŸ“ Project Structure

```text
nexatech-notification/
â”œâ”€â”€ public/
â”‚   â”œâ”€â”€ index.html
â”‚   â”œâ”€â”€ script.js
â”‚   â””â”€â”€ style.css
â”œâ”€â”€ redisClient.js
â”œâ”€â”€ server1.js
â”œâ”€â”€ server2.js
â”œâ”€â”€ package.json
â”œâ”€â”€ package-lock.json
â””â”€â”€ README.md
```

## ðŸš€ How to Run

### 1. Install Dependencies

Make sure Node.js and Redis are installed.

Install the project dependencies:

```bash
npm install
```

### 2. Start Redis

Start the Redis server:

```bash
redis-server
```

Keep Redis running.

### 3. Start Server 1

Open another terminal in the project directory:

```bash
node server1.js
```

Server 1 runs on:

```text
http://localhost:3000
```

### 4. Start Server 2

Open another terminal:

```bash
node server2.js
```

Server 2 runs on:

```text
http://localhost:3001
```

### 5. Open the Application

Open the application in a web browser and connect as a Lecturer or Student.

The system can then be tested using multiple browser sessions to simulate multiple users and different servers.

## ðŸ§ª Fault Tolerance Testing

The system can be tested by:

1. Starting Redis.
2. Starting Server 1 and Server 2.
3. Connecting clients to the application.
4. Sending announcements and responses.
5. Stopping one application server.
6. Observing the client failover and automatic reconnection.
7. Verifying that communication continues through the available server.

## ðŸŽ¯ Project Purpose

The project demonstrates the implementation of real-time communication and distributed application concepts, including:

- WebSocket-based communication
- Redis Pub/Sub
- Multi-server communication
- Client-side failover
- Automatic reconnection
- Real-time user synchronization
- Role-based interaction

## ðŸ‘¨â€ðŸ’» Developer

**Ferry Irwan Shah bin Azman**

Diploma in Computer Science  
Kolej Profesional MARA Beranang (KPM)

GitHub: [ferryyirwan](https://github.com/ferryyirwan)

LinkedIn: [Ferry Irwan](https://www.linkedin.com/in/ferry-irwan-889b25428)
