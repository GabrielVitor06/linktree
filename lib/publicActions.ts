// import db from "@/lib/db";
// import { userTemplateChoices, templates, users } from "@/lib/schema";
// import { eq } from "drizzle-orm";

// export async function getUserIdByUsernames(
//   username: string
// ): Promise<number | null> {
//   try {
//     const decodedUsername = decodeURIComponent(username);

//     const user = await db
//       .select()
//       .from(users)
//       .where(eq(users.name, decodedUsername))
//       .execute();

//     return user.length > 0 ? user[0].id : null;
//   } catch (error) {
//     console.error("Erro ao buscar o ID do usuário:", error);
//     return null;
//   }
// }

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

// export async function getUserTemplateChoice(userId: number) {
//   const choice = await db
//     .select()
//     .from(userTemplateChoices)
//     .where(eq(userTemplateChoices.userId, userId))
//     .limit(1);
//   return choice[0] || null;
// }

// export async function getTemplateById(templateId: number) {
//   const template = await db
//     .select()
//     .from(templates)
//     .where(eq(templates.id, templateId))
//     .limit(1);
//   return template[0] || null;
// }

// interface User {
//   id: number;
//   name: string;
//   email: string;
// }

// export const getUserBySessionId = async (
//   userId: number
// ): Promise<User | null> => {
//   const result = await db
//     .select({
//       id: users.id,
//       name: users.name,
//       email: users.email,
//       password: users.password,
//     })
//     .from(users)
//     .where(eq(users.id, userId));

//   if (result.length > 0 && result[0].name) {
//     return result[0] as User;
//   }

//   return null;
// };

// // Funções de banco de dados com renovação de sessãox
// import { getSession, renewSession } from "@/lib/auth";
// import db from "@/lib/db";
// import { users, userTemplateChoices, templates, User } from "@/lib/schema";
// import { eq } from "drizzle-orm";

// // async function renewSession() {
// //   const response = await fetch("/api/session", { method: "POST" });
// //   if (!response.ok) {
// //     throw new Error("Erro ao renovar a sessão");
// //   }
// // }

// export async function getUserIdByUsernames(
//   username: string
// ): Promise<number | null> {
//   const session = await getSession();
//   if (!session) {
//     console.log("Sessão inválida ou expirada.");
//     return null;
//   }

//   try {
//     const decodedUsername = decodeURIComponent(username);
//     const user = await db
//       .select()
//       .from(users)
//       .where(eq(users.name, decodedUsername))
//       .execute();

//     if (user.length > 0) {
//       await renewSession(); // Renova a sessão após buscar o usuário
//       return user[0].id;
//     }
//     return null;
//   } catch (error) {
//     console.error("Erro ao buscar o ID do usuário:", error);
//     return null;
//   }
// }

// export async function getUserIdByUsername(
//   username: string
// ): Promise<number | null> {
//   try {
//     const decodedUsername = decodeURIComponent(username);

//     const user = await db
//       .select()
//       .from(users)
//       .where(eq(users.name, decodedUsername))
//       .execute();

//     return user.length > 0 ? user[0].id : null;
//   } catch (error) {
//     console.error("Erro ao buscar o ID do usuário:", error);
//     return null;
//   }
// }

// export async function getUserTemplateChoice(userId: number) {
//   const session = await getSession();
//   if (!session) {
//     console.log("Sessão inválida ou expirada.");
//     return null;
//   }

//   try {
//     const choice = await db
//       .select()
//       .from(userTemplateChoices)
//       .where(eq(userTemplateChoices.userId, userId))
//       .limit(1);

//     await renewSession(); // Renova a sessão após consultar a escolha do template
//     return choice[0] || null;
//   } catch (error) {
//     console.error("Erro ao buscar a escolha de template do usuário:", error);
//     return null;
//   }
// }

// export async function getTemplateById(templateId: number) {
//   const session = await getSession();
//   if (!session) {
//     console.log("Sessão inválida ou expirada.");
//     return null;
//   }

//   try {
//     const template = await db
//       .select()
//       .from(templates)
//       .where(eq(templates.id, templateId))
//       .limit(1);

//     await renewSession(); // Renova a sessão após buscar o template
//     return template[0] || null;
//   } catch (error) {
//     console.error("Erro ao buscar o template:", error);
//     return null;
//   }
// }

// export const getUserBySessionId = async (
//   userId: number
// ): Promise<User | null> => {
//   const session = await getSession();
//   if (!session) {
//     console.log("Sessão inválida ou expirada.");
//     return null;
//   }

//   try {
//     const result = await db
//       .select({
//         id: users.id,
//         name: users.name,
//         email: users.email,
//         password: users.password,
//       })
//       .from(users)
//       .where(eq(users.id, userId));

//     if (result.length > 0 && result[0].name) {
//       await renewSession(); // Renova a sessão após obter o usuário por ID de sessão
//       return result[0] as User;
//     }

//     return null;
//   } catch (error) {
//     console.error("Erro ao buscar o usuário pela sessão:", error);
//     return null;
//   }
// };

// Funções de banco de dados com renovação de sessão

import { renewSession, getSession } from "@/lib/auth";
import db from "@/lib/db";
import { users, userTemplateChoices, templates, User } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function getUserIdByUsernames(
  username: string
): Promise<number | null> {
  const session = await getSession();
  if (!session) {
    console.log("Sessão inválida ou expirada.");
    return null;
  }

  try {
    const decodedUsername = decodeURIComponent(username);
    const user = await db
      .select()
      .from(users)
      .where(eq(users.name, decodedUsername))
      .execute();

    if (user.length > 0) {
      await renewSession(); // Renova a sessão após buscar o usuário
      return user[0].id;
    }
    return null;
  } catch (error) {
    console.error("Erro ao buscar o ID do usuário:", error);
    return null;
  }
}

export async function getUserTemplateChoice(userId: number) {
  const session = await getSession();
  if (!session) {
    console.log("Sessão inválida ou expirada.");
    return null;
  }

  try {
    const choice = await db
      .select()
      .from(userTemplateChoices)
      .where(eq(userTemplateChoices.userId, userId))
      .limit(1);

    await renewSession(); // Renova a sessão após consultar a escolha do template
    return choice[0] || null;
  } catch (error) {
    console.error("Erro ao buscar a escolha de template do usuário:", error);
    return null;
  }
}

export async function getTemplateById(templateId: number) {
  const session = await getSession();
  if (!session) {
    console.log("Sessão inválida ou expirada.");
    return null;
  }

  try {
    const template = await db
      .select()
      .from(templates)
      .where(eq(templates.id, templateId))
      .limit(1);

    await renewSession(); // Renova a sessão após buscar o template
    return template[0] || null;
  } catch (error) {
    console.error("Erro ao buscar o template:", error);
    return null;
  }
}

export const getUserBySessionId = async (
  userId: number
): Promise<User | null> => {
  const session = await getSession();
  if (!session) {
    console.log("Sessão inválida ou expirada.");
    return null;
  }

  try {
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
      await renewSession(); // Renova a sessão após obter o usuário por ID de sessão
      return result[0] as User;
    }

    return null;
  } catch (error) {
    console.error("Erro ao buscar o usuário pela sessão:", error);
    return null;
  }
};
