import { Router } from "express";
import userRouter from "./users.js";
import authRouter from "./auth.js";
import applicationRouter from "./application.js";

const appRouter = Router();

appRouter.use(userRouter);
appRouter.use(authRouter);
appRouter.use('/api/applications', applicationRouter)



export default appRouter;