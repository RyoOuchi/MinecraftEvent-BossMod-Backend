import type {PrismaClient} from "@prisma/client";
import {Router} from "express";

export default function teamStatus(prisma: PrismaClient) {
    const router = Router();
    router.get("/currently-fighting-boss", async (req, res) => {
        const teamID = req.query.teamID;
        if (teamID == undefined) return res.status(404).send("No team ID found.");
        try {
            const bossesTeamFighting = await prisma.team.findMany({
                where: {
                    name: teamID as string,
                    spawned: true,
                },
                select: {
                    bossId: true
                }
            });

            const bossesTeamDefeated = await prisma.team.findMany({
                where: {
                    name: teamID as string,
                    spawned: false,
                },
                select: {
                    bossId: true
                }
            })

            const bossesTeamFightingID = bossesTeamFighting.map(boss => boss.bossId);
            const bossesTeamDefeatedID = bossesTeamDefeated.map(boss => boss.bossId);
            const bossesCurrentlyFightingID = bossesTeamFightingID.filter((bossID) => {
                !bossesTeamDefeatedID.includes(bossID)
            });

            const response = bossesTeamFighting.filter((boss) => {
                bossesCurrentlyFightingID.includes(boss.bossId)
            });

            res.status(200).json(response);
        } catch(error) {
            res.status(500).send("Something went wrong");
        }
    });

    router.get("/defeated-boss", async (req, res) => {
        const teamID = req.query.teamID;
        if (teamID == undefined) return res.status(404).send("No team ID found.");
        try {
            const summonedBosses = await prisma.team.findMany({
                where: {
                    name: teamID as string,
                    spawned: true,
                },
                select: {
                    bossId: true,
                    createdAt: true
                }
            });

            const defeatedBosses = await prisma.team.findMany({
                where: {
                    name: teamID as string,
                    spawned: false,
                },
                select: {
                    bossId: true,
                    createdAt: true
                }
            })

            const summonedMap = new Map(
                summonedBosses.map(boss => [boss.bossId, boss.createdAt])
            );

            const defeatedMap = new Map(
                defeatedBosses.map(boss => [boss.bossId, boss.createdAt])
            );

            const resultMap = new Map();

            defeatedMap.forEach((date, id) => {
                const summonedTime = summonedMap.get(id)?.getTime();
                if (summonedTime != undefined) {
                    resultMap.set(id, summonedTime - date.getTime());
                }
            });
            res.status(200).json(resultMap);
        } catch (error) {
            res.status(500).send(error);
        }
    });
    return router;
}