import { Router } from "express";
export default function teamStatus(prisma) {
    const router = Router();
    router.get("/currently-fighting-boss", async (req, res) => {
        const teamID = req.query.teamID;
        if (teamID == undefined)
            return res.status(404).send("No team ID found.");
        try {
            const bossesTeamFighting = await prisma.team.findMany({
                where: {
                    name: teamID,
                    spawned: true,
                },
                select: {
                    bossId: true
                }
            });
            const bossesTeamDefeated = await prisma.team.findMany({
                where: {
                    name: teamID,
                    spawned: false,
                },
                select: {
                    bossId: true
                }
            });
            console.log("");
            const bossesTeamFightingID = bossesTeamFighting.map(boss => boss.bossId);
            const bossesTeamDefeatedID = bossesTeamDefeated.map(boss => boss.bossId);
            const bossesCurrentlyFightingID = bossesTeamFightingID.filter((bossID) => {
                return !bossesTeamDefeatedID.includes(bossID);
            });
            const response = bossesTeamFighting.filter((boss) => {
                return bossesCurrentlyFightingID.includes(boss.bossId);
            });
            res.status(200).json(response);
        }
        catch (error) {
            res.status(500).send("Something went wrong");
        }
    });
    router.get("/defeated-boss", async (req, res) => {
        const teamID = req.query.teamID;
        if (teamID == undefined)
            return res.status(404).send("No team ID found.");
        try {
            const summonedBosses = await prisma.team.findMany({
                where: {
                    name: teamID,
                    spawned: true,
                },
                select: {
                    bossId: true,
                    createdAt: true
                }
            });
            const defeatedBosses = await prisma.team.findMany({
                where: {
                    name: teamID,
                    spawned: false,
                },
                select: {
                    bossId: true,
                    createdAt: true
                }
            });
            const summonedMap = new Map(summonedBosses.map(boss => [boss.bossId, boss.createdAt]));
            const defeatedMap = new Map(defeatedBosses.map(boss => [boss.bossId, boss.createdAt]));
            const resultMap = new Map();
            defeatedMap.forEach((date, id) => {
                const summonedTime = summonedMap.get(id)?.getTime();
                console.log("Summoned Time: " + summonedTime);
                if (summonedTime != undefined) {
                    resultMap.set(id, date.getTime() - summonedTime);
                }
            });
            res.status(200).json(Object.fromEntries(resultMap));
        }
        catch (error) {
            res.status(500).send(error);
        }
    });
    return router;
}
//# sourceMappingURL=team-status.js.map