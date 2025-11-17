import type { PrismaClient } from "@prisma/client";
import express, {Router} from "express";

export default function bossStatus(prisma: PrismaClient) {
    const router = Router();
    router.get("/summoned-boss-id", async (req, res) => {
        try {
            const allPosts = await prisma.team.findMany();
            res.json(allPosts);
        } catch (error) {
            res.status(404).send({error: error});
        }
    });
    return router;
}