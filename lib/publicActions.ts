import db from "@/lib/db";
import { userTemplateChoices, templates, users } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function getUserIdByUsernames(
  username: string
): Promise<number | null> {
  try {
    const decodedUsername = decodeURIComponent(username);

    const user = await db
      .select()
      .from(users)
      .where(eq(users.name, decodedUsername))
      .execute();

    return user.length > 0 ? user[0].id : null;
  } catch (error) {
    console.error("Erro ao buscar o ID do usuário:", error);
    return null;
  }
}

export async function getUserIdByUsername(
  username: string
): Promise<number | null> {
  try {
    const decodedUsername = decodeURIComponent(username);

    const user = await db
      .select()
      .from(users)
      .where(eq(users.name, decodedUsername))
      .execute();

    return user.length > 0 ? user[0].id : null;
  } catch (error) {
    console.error("Erro ao buscar o ID do usuário:", error);
    return null;
  }
}

export async function getUserTemplateChoice(userId: number) {
  const choice = await db
    .select()
    .from(userTemplateChoices)
    .where(eq(userTemplateChoices.userId, userId))
    .limit(1);
  return choice[0] || null;
}

export async function getTemplateById(templateId: number) {
  const template = await db
    .select()
    .from(templates)
    .where(eq(templates.id, templateId))
    .limit(1);
  return template[0] || null;
}

interface User {
  id: number;
  name: string;
  email: string;
}

export const getUserBySessionId = async (
  userId: number
): Promise<User | null> => {
  const result = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      password: users.password,
    })
    .from(users)
    .where(eq(users.id, userId));

  if (result.length > 0 && result[0].name) {
    return result[0] as User;
  }

  return null;
};
