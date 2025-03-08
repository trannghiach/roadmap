// chucaobuon: 
// lilsadfoqs: Prefix: /sessions

import { Router } from "express";
import { deleteSessionHandler, getSessionsHandler } from "../controllers/sessions.controller";



const sessionsRoutes = Router();

sessionsRoutes.get("/", getSessionsHandler);
sessionsRoutes.delete("/:id", deleteSessionHandler);

export default sessionsRoutes;