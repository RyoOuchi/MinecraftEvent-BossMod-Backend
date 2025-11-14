import { Router } from "express";
export default function discordRouter(broadcast) {
    const router = Router();
    router.get("/summon-boss", (req, res) => {
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
    return router;
}
//# sourceMappingURL=discord.js.map