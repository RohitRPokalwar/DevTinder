
const socket = require("socket.io");

initializeSocket=(server)=>{
    const socketIO = require("socket.io");  

    const io = socketIO(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true,  
        },
    })

    io.on("connection", (socket) => {

        socket.on("joinRoom" , ({firstName , userId , targetUserId}) => {
            const roomId = [userId, targetUserId].sort().join("-");
            console.log(`User ${firstName} with ID ${userId} is joining room ${roomId}`);
            socket.join(roomId);
        }),

        socket.on("sendMessage", ({ userId , targetUserId , newMessage}) => {
               const roomId = [userId, targetUserId].sort().join("-");
                console.log(`Message from ${socket.id} in room ${roomId}: ${newMessage}`);
                io.to(roomId).emit("receiveMessage", { message: newMessage, senderId: socket.id });
        }),
        
        socket.on("receiveMessage", ({ message, senderId }) => {
            console.log(`Message received in room ${roomId} from ${senderId}: ${message}`);
            // Broadcast the message to all clients in the room except the sender
            socket.to(roomId).emit("receiveMessage", { message, senderId });
        }),

        socket.on("disconnect", () => {
            console.log("A user disconnected:", socket.id);
        });
    });

}
module.exports = {initializeSocket};