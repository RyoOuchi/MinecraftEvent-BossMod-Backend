import { Router } from "express";
import { PrismaClient } from "@prisma/client";

export default function minecraftRouter(prisma: PrismaClient, broadcast: (data: any) => void) {
  const router = Router();

  router.post("/spawned-boss", async (req, res) => {
    try {
      const { teamName } = req.body;
      console.log(`👾 Boss spawned for team: ${teamName}`);

      if (!teamName) return res.status(400).json({ error: "Missing teamName" });

      await prisma.team.updateMany({
        where: { name: teamName },
        data: { spawned: true },
      });

      broadcast({ type: "BOSS_SPAWNED", teamName });
      res.json({ success: true });
    } catch (error) {
      console.error("❌ Error in /minecraft/spawned-boss:", error);
      res.status(500).json({ error: "Failed to mark boss as spawned" });
    }
  });

  router.post("/defeated-boss", async (req, res) => {
    try {
      const { teamName } = req.body;
      console.log(`🏆 Boss defeated for team: ${teamName}`);

      if (!teamName) return res.status(400).json({ error: "Missing teamName" });

      await prisma.team.updateMany({
        where: { name: teamName },
        data: { spawned: false },
      });

      broadcast({ type: "BOSS_DEFEATED", teamName });
      res.json({ success: true });
    } catch (error) {
      console.error("❌ Error in /minecraft/defeated-boss:", error);
      res.status(500).json({ error: "Failed to mark boss as defeated" });
    }
  });

  return router;
}