import express from "express";
import { createServer } from "http";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { setupWebSocket } from "./ws/websocket.js";
import discordRouter from "./Routes/discord.js";
import minecraftRouter from "./Routes/minecraft.js";
import debugRouter from "./Routes/debug.js";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "ngrok-skip-browser-warning"],
    credentials: false,
  })
);

app.use((req, _res, next) => {
  console.log(`➡️ [${req.method}] ${req.url}`);
  next();
});
app.use((req, res, next) => {
  res.setHeader("ngrok-skip-browser-warning", "true");
  next();
});

const server = createServer(app);
const { broadcast } = setupWebSocket(server);

app.use("/discord", discordRouter(broadcast));
app.use("/minecraft", minecraftRouter(prisma));
app.use("/debug", debugRouter(prisma));

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});