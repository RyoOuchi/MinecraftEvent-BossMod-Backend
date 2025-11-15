import {Router} from "express";
import {PrismaClient} from "@prisma/client";

export default function debugRouter(prisma: PrismaClient) {
    const router = Router();

    router.get("/db", async (_req, res) => {
        console.log("🔍 Debug DB requested");
        try {
            const [players, teams] = await Promise.all([
                prisma.player.findMany(),
                prisma.team.findMany(),
            ]);
            res.json({players, teams});
        } catch (error) {
            console.error("❌ Error fetching DB objects:", error);
            res.status(500).json({error: "Failed to fetch DB objects"});
        }
    });

    router.delete("/reset-db", async (_req, res) => {
        console.log("🗑️ Resetting DB...");
        try {
            await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Player" RESTART IDENTITY CASCADE;`);
            await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Team" RESTART IDENTITY CASCADE;`);

            console.log("✅ DB cleared & IDs reset");
            res.json({success: true, message: "Database reset complete"});
        } catch (error) {
            console.error("❌ Error resetting DB:", error);
            res.status(500).json({error: "Failed to reset database"});
        }
    });

    return router;
}