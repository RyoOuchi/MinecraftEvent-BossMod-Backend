import { Router } from "express";
import teamStatus from "./display/team-status.js";
import bossStatus from "./display/boss-status.js";
export default function displayRouter(prisma) {
    const router = Router();
    router.use("/team-status", teamStatus(prisma));
    router.use("/boss-status", bossStatus(prisma));
    return router;
}
//# sourceMappingURL=display.js.map