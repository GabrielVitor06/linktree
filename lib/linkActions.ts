import db from "@/lib/db";
import { forms } from "@/lib/schema";
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
