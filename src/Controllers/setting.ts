import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types";
import { JwtPayload } from "jsonwebtoken";
import { updateUser } from "../Service_MySql/setting";
import { getUser } from "../Service_MySql/users";
import { deleteAvatar } from "../utils/deleteAvatar";
const fs = require("fs");
const path = require("path");

export const updateProfile = async (req: Request, res: Response) => {
  const user = (req as AuthenticatedRequest).user;
  if (user && typeof user !== "string") {
    const { userId } = user as JwtPayload;
    const id: number = Number(userId);

    try {
      // console.log(req.body);
      const { family, name, avatar, city } = req.body;

      if (!family) {
        res.status(400).json({ message: "Поля family обязательно" });
        return;
      }

      if (!name) {
        res.status(400).json({ message: "Поля name обязательно" });
        return;
      }

      if (!avatar) {
        res.status(400).json({ message: "Поля avatar обязательно" });
        return;
      }

      if (!city) {
        res.status(400).json({ message: "Поля city обязательно" });
        return;
      }

      const base64Data = avatar.replace(/^data:image\/png;base64,/, "");

      const timestamp = new Date().toISOString().replace(/:/g, "-");
      const fileName = `image-${timestamp}.png`;
      const filePath = path.join(__dirname, "../uploads", fileName);

      fs.writeFile(filePath, base64Data, "base64", async (err: any) => {
        if (err) {
          console.error("Ошибка при сохранении изображения:", err);
          return res.status(500).send("Ошибка при сохранении");
        }
        const user = await getUser(id);
        if (user?.avatar) {
          const resultAvatar = await deleteAvatar(user.avatar);
          if (resultAvatar) {
            const result = await updateUser(id, family, name, fileName, city);
            if (result) {
              res.status(200).json({ status: "ok", avatar: fileName });
            }
          }
        }
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Ошибка при получении пользователей", error: error });
    }
  }
};
