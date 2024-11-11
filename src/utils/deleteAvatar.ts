import fs from "fs";
import path from "path";

export const deleteAvatar = async (fileName: string): Promise<boolean> => {
  const filePath = path.join(__dirname, "../uploads", fileName);

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

  await unlinkPromise(filePath);
  console.log(`Изображение ${fileName} успешно удалено`);
  return true;
};
