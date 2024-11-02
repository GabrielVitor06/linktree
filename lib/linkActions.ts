import db from "@/lib/db";
import { forms, users, titles } from "@/lib/schema";
import { eq } from "drizzle-orm";

export const fetchUserLinks = async (userId: number) => {
  try {
    return await db.select().from(forms).where(eq(forms.userId, userId));
  } catch (error) {
    console.error("Erro ao buscar links do usuário:", error);
    throw new Error("Não foi possível buscar os links do usuário.");
  }
};

export const deleteLink = async (linkId: number) => {
  try {
    await db.delete(forms).where(eq(forms.id, linkId));
  } catch (error) {
    console.error("Erro ao deletar o link:", error);
    throw new Error("Não foi possível deletar o link.");
  }
};

export const editarLink = async (
  linkId: number,
  updatedValues: { url?: string; text?: string; platforms?: string }
) => {
  try {
    await db.update(forms).set(updatedValues).where(eq(forms.id, linkId));
  } catch (error) {
    console.error("Erro ao editar o link:", error);
    throw new Error("Não foi possível editar o link.");
  }
};

export const fetchUser = async (userId: number) => {
  try {
    return await db.select().from(users).where(eq(users.id, userId));
  } catch (error) {
    console.error("Erro ao buscar informações do usuário:", error);
    throw new Error("Não foi possível buscar as informações do usuário.");
  }
};

export const fetchUserTitles = async (userId: number) => {
  try {
    return await db.select().from(titles).where(eq(titles.userId, userId));
  } catch (error) {
    console.error("Erro ao buscar títulos do usuário:", error);
    throw new Error("Não foi possível buscar os títulos do usuário.");
  }
};

export const deleteTitle = async (titleId: number) => {
  try {
    await db.delete(titles).where(eq(titles.id, titleId));
  } catch (error) {
    console.error("Erro ao deletar o título:", error);
    throw new Error("Não foi possível deletar o título.");
  }
};

export const editarTitle = async (
  titleId: number,
  updatedValues: { title?: string; subtitulo?: string }
) => {
  try {
    await db.update(titles).set(updatedValues).where(eq(titles.id, titleId));
  } catch (error) {
    console.error("Erro ao editar o título:", error);
    throw new Error("Não foi possível editar o título.");
  }
};
