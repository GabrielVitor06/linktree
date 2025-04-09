import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import {
  getUserIdByUsername,
  getUserTemplateChoice,
  getTemplateById,
} from "@/lib/publicActions";

// o Next já entende o tipo do parâmetro `params`
export default async function PublicPage({
  params,
}: {
  params: { username: string };
}) {
  const { username } = params;

  const userId = await getUserIdByUsername(username);
  if (!userId) return notFound();

  const userTemplateChoice = await getUserTemplateChoice(userId);
  if (!userTemplateChoice) return notFound();

  const template = await getTemplateById(userTemplateChoice.templateId);
  if (!template) return notFound();

  const TemplateComponent = dynamic(
    () => import(`@/app/components/${template.filePath}/page`)
  );

  return <TemplateComponent />;
}
