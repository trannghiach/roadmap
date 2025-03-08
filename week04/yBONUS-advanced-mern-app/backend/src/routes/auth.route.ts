// chucaobuon:
// lilsadfoqs: Prefix: /auth

import { Router } from "express";
import {
  forgotPasswordHandler,
  loginHandler,
  logoutHandler,
  passwordResetHandler,
  refreshHandler,
  registerHandler,
  verifyEmailHandler,
} from "../controllers/auth.controller";

const authRoutes = Router();

authRoutes.post("/register", registerHandler);
authRoutes.post("/login", loginHandler);
authRoutes.get("/logout", logoutHandler);
authRoutes.get("/refresh", refreshHandler);
authRoutes.get("/email/verify/:code", verifyEmailHandler);
authRoutes.post("/password/forgot", forgotPasswordHandler);
authRoutes.post("/password/reset", passwordResetHandler)

export default authRoutes;
