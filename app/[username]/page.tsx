import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import {
  getUserIdByUsername,
  getUserTemplateChoice,
  getTemplateById,
} from "@/lib/publicActions";

interface PublicPageProps {
  params: { username: string };
}

export default async function PublicPage(props: PublicPageProps) {
  const { username } = await props.params;

  const userId = await getUserIdByUsername(username);
  if (!userId) return notFound();

  const userTemplateChoice = await getUserTemplateChoice(userId);
  if (!userTemplateChoice) return notFound();

  const template = await getTemplateById(userTemplateChoice.templateId);
  if (!template) return notFound();

  const TemplateComponent = dynamic(
    () => import(`@/app/components/${template.filePath}/page`)
  );

  return (
    <div>
      <TemplateComponent />
    </div>
  );
}
