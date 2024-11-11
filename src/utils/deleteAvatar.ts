import fs from "fs";
import path from "path";

export const deleteAvatar = async (fileName: string): Promise<boolean> => {
  const filePath = path.join(__dirname, "../uploads", fileName);
  if (fileName === "no-photo.png") {
    return true;
  } else {
    const unlinkPromise = (filePath: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        fs.unlink(filePath, (err: any) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    };

    try {
      await unlinkPromise(filePath);
      console.log(`Изображение ${fileName} успешно удалено`);
      return true;
    } catch (err) {
      console.error(`Ошибка при удалении изображения ${fileName}:`, err);
      return false;
    }
  }
};
