// Routers/user.ts
import { Router } from "express";
import { getUsersById } from "../Controllers/users";

const userRouter = Router();

//userRouter.get("/profile", getUserProfile);

userRouter.post("/by-ids", getUsersById);

export default userRouter;
