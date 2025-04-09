"use server";

import db from "@/lib/db";
import {
  forms,
  titles,
  users,
  templates,
  userTemplateChoices,
} from "@/lib/schema";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function linktree(formData: FormData) {
  const session = await getSession();
  const url = formData.get("url");
  const text = formData.get("text");
  const platforms = formData.getAll("platforms") as string[];

  if (!url || !text || !session?.id) {
    return {
      success: false,
      error: "Campos obrigatórios ausentes ou usuário não autenticado.",
    };
  }

  try {
    const [NewForm] = (await db
      .insert(forms)
      .values({
        userId: Number(session.id),
        url: String(url),
        text: String(text),
        platforms: platforms.join(","),
      })
      .returning()) as [unknown];
    return { success: true, data: NewForm };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Erro ao salvar link." };
  }
}

export async function Titles(formData: FormData) {
  const session = await getSession();
  if (!session?.id)
    return { success: false, error: "Usuário não autenticado." };

  try {
    const [NewTitle] = (await db
      .insert(titles)
      .values({
        userId: Number(session.id),
        title: String(formData.get("title")),
        subtitulo: String(formData.get("subtitulo")),
        imageUrl: String(formData.get("imageUrl")),
      })
      .returning()) as [unknown];
    return { success: true, data: NewTitle };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Erro ao salvar título." };
  }
}

export async function fetchUserData(userId: number) {
  try {
    return await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, userId),
      columns: { id: true, name: true, email: true, password: true },
    });
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function fetchUserLinks(userId: number) {
  try {
    return await db.select().from(forms).where(eq(forms.userId, userId));
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao buscar links.");
  }
}

export async function deleteLink(linkId: number) {
  try {
    await db.delete(forms).where(eq(forms.id, linkId));
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao deletar link.");
  }
}

export async function editarLink(
  linkId: number,
  updatedValues: { url?: string; text?: string; platforms?: string }
) {
  try {
    await db.update(forms).set(updatedValues).where(eq(forms.id, linkId));
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao editar link.");
  }
}

export async function fetchUser(userId: number) {
  try {
    return await db.select().from(users).where(eq(users.id, userId));
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao buscar usuário.");
  }
}

export async function fetchUserTitles(userId: number) {
  try {
    return await db.select().from(titles).where(eq(titles.userId, userId));
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao buscar títulos.");
  }
}

export async function deleteTitle(titleId: number) {
  try {
    await db.delete(titles).where(eq(titles.id, titleId));
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao deletar título.");
  }
}

export async function editarTitle(
  titleId: number,
  updatedValues: { title?: string; subtitulo?: string }
) {
  try {
    await db.update(titles).set(updatedValues).where(eq(titles.id, titleId));
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Erro ao editar título." };
  }
}

export async function getUserIdByUsername(
  username: string
): Promise<number | null> {
  try {
    const decoded = decodeURIComponent(username);
    const result = await db
      .select()
      .from(users)
      .where(eq(users.name, decoded))
      .execute();
    return result.length > 0 ? result[0].id : null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getUserTemplateChoice(userId: number) {
  const result = await db
    .select()
    .from(userTemplateChoices)
    .where(eq(userTemplateChoices.userId, userId))
    .limit(1);
  return result[0] || null;
}

export async function getTemplateById(templateId: number) {
  const result = await db
    .select()
    .from(templates)
    .where(eq(templates.id, templateId))
    .limit(1);
  return result[0] || null;
}

export async function getUserBySessionId(userId: number) {
  const result = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      password: users.password,
    })
    .from(users)
    .where(eq(users.id, userId));
  return result[0] || null;
}
