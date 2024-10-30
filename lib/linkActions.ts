import db from "@/lib/db";
import { forms, users, titles } from "@/lib/schema";
import { eq } from "drizzle-orm";

// Função para buscar links de um usuário
export const fetchUserLinks = async (userId: number) => {
  return await db.select().from(forms).where(eq(forms.userId, userId));
};

// Função para deletar um link
export const deleteLink = async (linkId: number) => {
  await db.delete(forms).where(eq(forms.id, linkId)); // Excluindo o link
};

// Função para deletar um link
export const editarLink = async (
  linkId: number,
  updatedValues: { url?: string; text?: string; platforms?: string }
) => {
  await db.update(forms).set(updatedValues).where(eq(forms.id, linkId)); // Atualiza com base no linkId
};

export const fetchUser = async (userId: number) => {
  return await db.select().from(users).where(eq(users.id, userId));
};

// Função para buscar links de um usuário
export const fetchUserTitles = async (userId: number) => {
  return await db.select().from(titles).where(eq(titles.userId, userId));
};

// Função para deletar um titles
export const deleteTitle = async (titleId: number) => {
  await db.delete(titles).where(eq(titles.id, titleId)); // Excluindo o title
};

// Função para deletar um title
export const editarTitle = async (
  titleId: number,
  updatedValues: { title?: string; subtitulo?: string }
) => {
  await db.update(titles).set(updatedValues).where(eq(titles.id, titleId)); // Atualiza com base no titleId
};
