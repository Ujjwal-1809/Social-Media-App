import { Server } from "socket.io";

const setupSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",  // Match frontend URL
            credentials: true,
        }
    });

    io.on("connection", (socket) => {
        console.log("A user connected", socket.id);

          // Join a chat room
          socket.on("join-chat", (chatId) => {
            socket.join(chatId);
            console.log(`User ${socket.id} joined chat ${chatId}`);
        });

        // Handle sending messages
        socket.on("send-message", ({ chatId, message }) => {
            console.log(`New message in chat ${chatId}:`, message);

            // Broadcast the message to others in the same chat room
            io.to(chatId).emit("receive-message", message);
        });
        socket.on("disconnect", () => {
            console.log("A user disconnected", socket.id);
        });
    });

    return io;
};

export { setupSocket };
