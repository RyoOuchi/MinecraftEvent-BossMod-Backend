import express from "express";
import { createServer } from "http";
import cors from "cors";
import { WebSocketServer } from "ws";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const app = express();
app.use(express.json());
// middleware: set header + request logging
app.use(cors({
    origin: "*", // allow all origins
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "ngrok-skip-browser-warning"],
    credentials: false // don’t require cookies or credentials
}));
app.use((req, _res, next) => {
    console.log(`➡️ [${req.method}] ${req.url}`);
    next();
});
app.use((req, res, next) => {
    res.setHeader("ngrok-skip-browser-warning", "true");
    next();
});
// --- WebSocket setup ---
const server = createServer(app);
const wss = new WebSocketServer({ server });
// Broadcast helper
function broadcast(data) {
    const json = JSON.stringify(data);
    console.log(`📢 Broadcasting: ${json}`);
    wss.clients.forEach((client) => {
        if (client.readyState === 1)
            client.send(json);
    });
}
// WebSocket connection logic
wss.on("connection", (ws, req) => {
    console.log(`🔗 WebSocket connected from ${req.socket.remoteAddress}`);
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
// --- REST endpoints ---
// POST /teams
app.post("/teams", async (req, res) => {
    try {
        let { name, bossId, spawned } = req.body;
        console.log("📥 Received POST /teams:", req.body);
        if (!name || bossId === undefined || spawned === undefined) {
            console.warn("⚠️ Missing fields in /teams");
            return res.status(400).json({ error: "Missing required fields" });
        }
        bossId = Number(bossId);
        if (isNaN(bossId)) {
            console.warn("⚠️ Invalid bossId in /teams");
            return res.status(400).json({ error: "bossId must be a valid number" });
        }
        if (typeof spawned === "string") {
            spawned = spawned.toLowerCase() === "true";
        }
        const team = await prisma.team.create({
            data: { name, bossId, spawned },
        });
        console.log("✅ Team created:", team);
        res.json(team);
    }
    catch (error) {
        console.error("❌ Error creating team:", error);
        res.status(500).json({ error: "Failed to create team" });
    }
});
// GET /summon-boss
app.get("/summon-boss", (req, res) => {
    const { teamName } = req.query;
    console.log(`🔥 Summon boss requested for team: ${teamName}`);
    try {
        broadcast({ type: "SUMMON_BOSS", teamName });
        res.json({ success: true, teamName });
    }
    catch (error) {
        console.error("❌ Error broadcasting summon:", error);
        res.status(500).json({ error: "Failed to summon boss" });
    }
});
// GET /debug/db
app.get("/debug/db", async (_req, res) => {
    console.log("🔍 Debug DB requested");
    try {
        const [players, teams] = await Promise.all([
            prisma.player.findMany(),
            prisma.team.findMany(),
        ]);
        console.log(`📊 Players: ${players.length}, Teams: ${teams.length}`);
        res.json({ players, teams });
    }
    catch (error) {
        console.error("❌ Error fetching DB objects:", error);
        res.status(500).json({ error: "Failed to fetch DB objects" });
    }
});
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`🚀 HTTP + WS server running on http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map