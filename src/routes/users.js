import { Router } from "express";
import userController from "../controllers/users.js";
import authMiddleware from "../midlewares/authenticate.js";

const userRouter = Router();

userRouter.get("/users",userController.getAllUsers);
userRouter.get("/user/:id",userController.getUserById);
userRouter.post("/user",userController.createUser);
userRouter.put("/user/:id",userController.updateUser);
userRouter.delete("/user/:id",userController.deleteUser);

userRouter.post("/profileUpdate", authMiddleware, userController.updateProfile);
userRouter.post("/user/updatePassword", authMiddleware, userController.updatePassword);
userRouter.post("/user/updateProfilePic", authMiddleware, userController.updateProfilePic);

export default userRouter;