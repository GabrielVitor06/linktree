// lib/dbQueries.ts

import db from "@/lib/db"; // Conexão com o banco de dados
import { userTemplateChoices, templates, users } from "@/lib/schema"; // Schemas de tabela
import { eq } from "drizzle-orm";

// // Busca o userId pelo username
// export async function getUserIdByUsername(username: string) {
//   const user = await db
//     .select()
//     .from(users)
//     .where(eq(users.name, username))
//     .limit(1);
//   return user[0]?.id || null;
// }
export async function getUserIdByUsername(username: string) {
  const decodedUsername = decodeURIComponent(username); // Decodifica o nome de usuário

  const user = await db
    .select()
    .from(users)
    .where(eq(users.name, decodedUsername)) // Usando o método correto de comparação
    .execute();

  return user.length > 0 ? user[0].id : null; // Retorna o ID se encontrado, caso contrário, retorna null
}

// Busca a escolha de template do usuário pelo userId
export async function getUserTemplateChoice(userId: number) {
  const choice = await db
    .select()
    .from(userTemplateChoices)
    .where(eq(userTemplateChoices.userId, userId))
    .limit(1);
  return choice[0] || null;
}

// Busca o template pelo templateId
export async function getTemplateById(templateId: number) {
  const template = await db
    .select()
    .from(templates)
    .where(eq(templates.id, templateId))
    .limit(1);
  return template[0] || null;
}

// fetchUser.ts

interface User {
  id: number;
  name: string; // Garante que o nome seja apenas string
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
      password: users.password, // Ajuste conforme a estrutura real da tabela
    })
    .from(users)
    .where(eq(users.id, userId));

  // Verifica se o usuário existe e se o campo `name` não é `null`
  if (result.length > 0 && result[0].name) {
    return result[0] as User;
  }

  return null;
};
