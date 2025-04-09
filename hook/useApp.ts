import { useEffect, useState } from "react";
import {
  fetchUserLinks,
  deleteLink,
  editarLink,
  fetchUser,
  fetchUserTitles,
  deleteTitle,
  editarTitle,
} from "@/lib/linkActions";
import {
  getUserIdByUsername,
  getUserTemplateChoice,
  getTemplateById,
  getUserBySessionId,
} from "@/lib/publicActions";
import { linktree, Titles, fetchUserData } from "@/lib/action";
import { getSession } from "@/lib/auth";

type RequestKey =
  | "createLink"
  | "getUserLinks"
  | "removeLink"
  | "updateLink"
  | "createTitle"
  | "getTitles"
  | "removeTitle"
  | "updateTitle"
  | "getUser"
  | "getUserData"
  | "getUserId"
  | "getUserBySession"
  | "getTemplateChoice"
  | "getTemplate";

export function useApp() {
  const [userId, setUserId] = useState<number | null>(null);

  const [loadingMap, setLoadingMap] = useState<Record<RequestKey, boolean>>(
    () =>
      Object.fromEntries(
        [
          "createLink",
          "getUserLinks",
          "removeLink",
          "updateLink",
          "createTitle",
          "getTitles",
          "removeTitle",
          "updateTitle",
          "getUser",
          "getUserData",
          "getUserId",
          "getUserBySession",
          "getTemplateChoice",
          "getTemplate",
        ].map((key) => [key, false])
      ) as Record<RequestKey, boolean>
  );

  const [errorMap, setErrorMap] = useState<Record<RequestKey, string | null>>(
    () =>
      Object.fromEntries(
        [
          "createLink",
          "getUserLinks",
          "removeLink",
          "updateLink",
          "createTitle",
          "getTitles",
          "removeTitle",
          "updateTitle",
          "getUser",
          "getUserData",
          "getUserId",
          "getUserBySession",
          "getTemplateChoice",
          "getTemplate",
        ].map((key) => [key, null])
      ) as Record<RequestKey, string | null>
  );

  // Pega o userId da sessão apenas uma vez
  useEffect(() => {
    const fetchSession = async () => {
      const session = (await getSession()) as { id: number } | null;
      setUserId(session?.id ?? null);
    };

    fetchSession();
  }, []);

  const handleRequest = async <T = unknown>(
    key: RequestKey,
    callback: () => Promise<T>
  ): Promise<T | null> => {
    setLoadingMap((prev) => ({ ...prev, [key]: true }));
    setErrorMap((prev) => ({ ...prev, [key]: null }));

    try {
      if (!userId) throw new Error("Usuário não autenticado.");
      return await callback();
    } catch (err) {
      console.error(err);
      setErrorMap((prev) => ({
        ...prev,
        [key]: "Erro ao processar a requisição.",
      }));
      return null;
    } finally {
      setLoadingMap((prev) => ({ ...prev, [key]: false }));
    }
  };

  return {
    loadingMap,
    errorMap,
    userId, // você ainda pode expor o userId se quiser usar fora

    // Links
    createLink: (formData: FormData) =>
      handleRequest("createLink", () => linktree(formData)),
    getUserLinks: (userId: number) =>
      handleRequest("getUserLinks", () => fetchUserLinks(userId!)),
    removeLink: (linkId: number) =>
      handleRequest("removeLink", () => deleteLink(linkId)),
    updateLink: (
      linkId: number,
      updatedValues: { url?: string; text?: string; platforms?: string }
    ) => handleRequest("updateLink", () => editarLink(linkId, updatedValues)),

    // Títulos
    createTitle: (formData: FormData) =>
      handleRequest("createTitle", () => Titles(formData)),
    getTitles: () => handleRequest("getTitles", () => fetchUserTitles(userId!)),
    removeTitle: (titleId: number) =>
      handleRequest("removeTitle", () => deleteTitle(titleId)),
    updateTitle: (
      titleId: number,
      updatedValues: { title?: string; subtitulo?: string }
    ) =>
      handleRequest("updateTitle", () => editarTitle(titleId, updatedValues)),

    // Usuário
    getUser: () => handleRequest("getUser", () => fetchUser(userId!)),
    getUserData: () =>
      handleRequest("getUserData", () => fetchUserData(userId!)),
    getUserId: (username: string) =>
      handleRequest("getUserId", () => getUserIdByUsername(username)),
    getUserBySession: () =>
      handleRequest("getUserBySession", () => getUserBySessionId(userId!)),

    // Template
    getTemplateChoice: () =>
      handleRequest("getTemplateChoice", () => getUserTemplateChoice(userId!)),
    getTemplate: (templateId: number) =>
      handleRequest("getTemplate", () => getTemplateById(templateId)),
  };
}

export type UseApp = ReturnType<typeof useApp>;
