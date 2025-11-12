import { WebSocketServer } from "ws";
import { Server } from "http";

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws, req) => {
    console.log(`🔗 WS connected from ${req.socket.remoteAddress}`);
    ws.send(JSON.stringify({ message: "Welcome to the server!" }));

    ws.on("message", (msg) => {
      console.log(`📨 WS message: ${msg.toString()}`);
    });

    ws.on("close", (code, reason) => {
      console.log(`❌ WS disconnected (${code}) ${reason}`);
    });

    ws.on("error", (err) => {
      console.error("⚠️ WS error:", err);
    });
  });

  function broadcast(data: any) {
    const json = JSON.stringify(data);
    console.log(`📢 Broadcasting: ${json}`);
    wss.clients.forEach((client) => {
      if (client.readyState === 1) client.send(json);
    });
  }

  return { broadcast };
}