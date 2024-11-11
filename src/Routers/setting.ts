import { Router } from "express";
import { verifyToken } from "../Controllers/auth";
import { updateProfile } from "../Controllers/setting";

const settingRouter = Router();

settingRouter.post("/update-profile", verifyToken, updateProfile);

export default settingRouter;
