// routes/auth.js
import { Router } from "express";
import authController from "../controllers/auth.js";

const authRouter = Router();

authRouter.post("/login", authController.login);
authRouter.post("/register", authController.register);
authRouter.post("/forgot-password", authController.forgotPassword);

export default authRouter;