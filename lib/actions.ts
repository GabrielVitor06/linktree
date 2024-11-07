"use server";

import { forms, NewForm, titles } from "@/lib/schema";
import db from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function linktree(formData: FormData) {
  "use server";

  const session = await getSession();

  const url = formData.get("url");
  const text = formData.get("text");
  const platforms = formData.getAll("platforms") as string[];

  if (url === null || text === null) {
    return { success: false, error: "Required fields are missing." };
  }

  if (!session || !session.id) {
    return { success: false, error: "User not authenticated." };
  }

  const userId = Number(session.id);

  let NewForm: NewForm | null = null;
  try {
    [NewForm] = (await db
      .insert(forms)
      .values({
        userId: userId,
        url: String(formData.get("url")),
        text: String(formData.get("text")),
        platforms: platforms.join(","),
      })
      .returning()) as unknown as [NewForm];
  } catch (dbError) {
    console.error("Failed to insert user", dbError);
    return { success: false, error: "Failed to register user." };
  }

  if (!NewForm) {
    return { success: false, error: "User registration failed." };
  }

  return { success: true, data: NewForm };
}

export async function Titles(formData: FormData) {
  "use server";

  const session = await getSession();

  if (!session || !session.id) {
    return { success: false, error: "User not authenticated." };
  }

  const userId = Number(session.id);

  let NewTitle: NewForm | null = null;
  try {
    [NewTitle] = (await db
      .insert(titles)
      .values({
        userId: userId,
        title: String(formData.get("title")),
        subtitulo: String(formData.get("subtitulo")),
        imageUrl: String(formData.get("imageUrl")),
      })
      .returning()) as unknown as [NewForm];
  } catch (dbError) {
    console.error("Failed to insert user", dbError);
    return { success: false, error: "Failed to register user." };
  }

  if (!NewTitle) {
    return { success: false, error: "User registration failed." };
  }

  return { success: true, data: NewTitle };
}

export const fetchUserData = async (userId: number) => {
  try {
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, userId),
      columns: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    });
    return user || null;
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
    throw new Error("Erro ao buscar dados do usuário");
  }
};
