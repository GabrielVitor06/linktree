// lib/dbQueries.ts

import db from "@/lib/db"; // Conexão com o banco de dados
import { userTemplateChoices, templates, users } from "@/lib/schema"; // Schemas de tabela
import { eq } from "drizzle-orm";

export async function getUserIdByUsernames(
  username: string
): Promise<number | null> {
  try {
    // Decodifica o nome de usuário, se necessário
    const decodedUsername = decodeURIComponent(username);

    // Realiza a consulta no banco de dados para buscar o usuário
    const user = await db
      .select()
      .from(users)
      .where(eq(users.name, decodedUsername)) // Substitua 'name' pelo nome correto do campo no seu schema
      .execute();

    // Retorna o ID do usuário, ou null se não encontrado
    return user.length > 0 ? user[0].id : null;
  } catch (error) {
    console.error("Erro ao buscar o ID do usuário:", error);
    return null; // Retorna null em caso de erro
  }
}

export async function getUserIdByUsername(
  username: string
): Promise<number | null> {
  try {
    const decodedUsername = decodeURIComponent(username); // Decodifica o nome de usuário, se necessário

    // Busca o usuário pelo nome de usuário
    const user = await db
      .select()
      .from(users)
      .where(eq(users.name, decodedUsername)) // Certifique-se de que o campo seja o correto
      .execute();

    // Retorna o ID se encontrado, caso contrário, retorna null
    return user.length > 0 ? user[0].id : null;
  } catch (error) {
    console.error("Erro ao buscar o ID do usuário:", error);
    return null; // Retorna null em caso de erro
  }
}
// export async function getUserIdByUsername(username: string) {
//   const decodedUsername = decodeURIComponent(username); // Decodifica o nome de usuário

//   const user = await db
//     .select()
//     .from(users)
//     .where(eq(users.name, decodedUsername)) // Usando o método correto de comparação
//     .execute();

//   return user.length > 0 ? user[0].id : null; // Retorna o ID se encontrado, caso contrário, retorna null
// }

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
