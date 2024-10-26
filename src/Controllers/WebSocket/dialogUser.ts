import { query_MySql } from "../../config/MySql";

export const dialogUser = async (userId: number, dialog_user: number) => {
  try {
    if (!dialog_user) {
      return { message: "Поля dialog_user обязательно" };
    }
    if (userId === undefined || dialog_user === undefined) {
      return { message: "Параметры userId и dialog_user обязательны" };
    }
    const userCheckSql =
      "SELECT id, email, family, name, avatar, time FROM users WHERE id = ?";
    const userExists = await query_MySql(userCheckSql, [userId]);

    if (userExists.length === 0) {
      return { message: "Пользователь не найден" };
    }

    const dialog_userExists = await query_MySql(userCheckSql, [dialog_user]);
    if (dialog_userExists.length === 0) {
      return { message: "Пользователь не найден" };
    }

    const sql =
      "SELECT * FROM messengers WHERE (from_user, to_user) IN ((?, ?), (?, ?))";
    const messages = await query_MySql(sql, [
      userId,
      dialog_user,
      dialog_user,
      userId,
    ]);

    return {
      messages: messages,
      user: userExists,
      dialog_user: dialog_userExists,
    };
  } catch (error) {
    return { message: "Ошибка при получении сообщений", error };
  }
};
