// /pages/api/session/route.tsx
import db from "@/lib/db";
import { templates, users } from "@/lib/schema";
import { NextApiRequest, NextApiResponse } from "next";
import { eq } from "drizzle-orm";
import { getSession, renewSession } from "@/lib/auth";

// Função para buscar o ID do usuário por username
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

// Função para buscar a escolha de template do usuário
export async function getUserTemplateChoice(userId: number) {
  const session = await getSession();
  if (!session) {
    console.log("Sessão inválida ou expirada.");
    return null;
  }
}

// Função para buscar o template pelo ID
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  if (method === "GET") {
    const { username, userId, templateId } = req.query;

    if (username) {
      const userId = await getUserIdByUsername(username as string);
      return res.status(200).json(userId);
    }

    if (userId) {
      const userTemplateChoice = await getUserTemplateChoice(Number(userId));
      return res.status(200).json(userTemplateChoice);
    }

    if (templateId) {
      const template = await getTemplateById(Number(templateId));
      return res.status(200).json(template);
    }

    return res.status(400).json({ message: "Invalid query" });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
