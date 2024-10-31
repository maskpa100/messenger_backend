// Routers/user.ts
import { Router } from "express";
import { getAllUsers, getUsersById } from "../Controllers/users";

const userRouter = Router();

//userRouter.get("/profile", getUserProfile);

userRouter.post("/by-ids", getUsersById);

userRouter.get("/all-users", getAllUsers);

export default userRouter;
