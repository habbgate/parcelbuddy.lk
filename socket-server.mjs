// Standalone Socket.io server for real-time chat.
// Run with: node socket-server.mjs   (set NEXT_PUBLIC_SOCKET_URL to its origin)
import { createServer } from "http";
import { Server } from "socket.io";

const PORT = process.env.SOCKET_PORT || 3001;
const httpServer = createServer((_, res) => {
  res.writeHead(200);
  res.end("ParcelBuddy socket server");
});

const io = new Server(httpServer, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  socket.on("join", (requestId) => {
    socket.join(`request:${requestId}`);
  });

  // A client signals a new message was posted; broadcast to the room so
  // other participants re-fetch. (Persistence happens via the REST API.)
  socket.on("message", ({ requestId }) => {
    socket.to(`request:${requestId}`).emit("message", { requestId });
  });
});

httpServer.listen(PORT, () => {
  console.log(`⚡ Socket.io server listening on :${PORT}`);
});
