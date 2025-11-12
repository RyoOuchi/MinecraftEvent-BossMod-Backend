import { Router } from "express";
import { PrismaClient } from "@prisma/client";

export default function minecraftRouter(prisma: PrismaClient, broadcast: (data: any) => void) {
  const router = Router();

  // --- Boss Spawned ---
  router.post("/spawned-boss", async (req, res) => {
    try {
      const { teamID, bossID } = req.body;

      if (!teamID || !bossID) {
        return res.status(400).json({ error: "Missing teamID or bossID" });
      }

      const parsedBossId = parseInt(bossID, 10);
      if (isNaN(parsedBossId)) {
        return res.status(400).json({ error: "Invalid bossID: must be a number" });
      }

      console.log(`👾 Boss spawned for team: ${teamID} (bossID: ${parsedBossId})`);

      const team = await prisma.team.create({
        data: {
          name: teamID,
          bossId: parsedBossId,
          spawned: true,
        },
      });

      broadcast({ type: "BOSS_SPAWNED", teamID, bossID: parsedBossId });
      res.json({ success: true, team });
    } catch (error) {
      console.error("❌ Error in /minecraft/spawned-boss:", error);
      res.status(500).json({ error: "Failed to record boss spawn" });
    }
  });

  // --- Boss Defeated ---
  router.post("/defeated-boss", async (req, res) => {
    try {
      const { teamID, bossID } = req.body;

      if (!teamID || !bossID) {
        return res.status(400).json({ error: "Missing teamID or bossID" });
      }

      const parsedBossId = parseInt(bossID, 10);
      if (isNaN(parsedBossId)) {
        return res.status(400).json({ error: "Invalid bossID: must be a number" });
      }

      console.log(`🏆 Boss defeated for team: ${teamID} (bossID: ${parsedBossId})`);

      const team = await prisma.team.create({
        data: {
          name: teamID,
          bossId: parsedBossId,
          spawned: false,
        },
      });

      broadcast({ type: "BOSS_DEFEATED", teamID, bossID: parsedBossId });
      res.json({ success: true, team });
    } catch (error) {
      console.error("❌ Error in /minecraft/defeated-boss:", error);
      res.status(500).json({ error: "Failed to record boss defeat" });
    }
  });

  return router;
}