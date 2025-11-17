import {Router} from "express";
import type {PrismaClient} from "@prisma/client";
import teamStatus from "./display/team-status.js";
import bossStatus from "./display/boss-status.js";

export default function displayRouter(prisma: PrismaClient) {
    const router = Router()
    router.use("/team-status", teamStatus(prisma));
    router.use("/boss-status", bossStatus(prisma));
    return router;
}