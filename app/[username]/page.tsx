import { notFound } from "next/navigation";
import {
  getUserIdByUsername,
  getUserTemplateChoice,
  getTemplateById,
} from "@/lib/publicActions";
import React, { Suspense } from "react";

interface PublicPageProps {
  params: Promise<{ username: string }>;
}

const loadTemplate = (filePath: string) =>
  React.lazy(() => import(`@/app/components/${filePath}/page`));

export default async function PublicPage({ params }: PublicPageProps) {
  const { username } = await params;

  const userId = await getUserIdByUsername(username);
  if (!userId) return notFound();

  const userTemplateChoice = await getUserTemplateChoice(userId);
  if (!userTemplateChoice) return notFound();

  const template = await getTemplateById(userTemplateChoice.templateId);
  if (!template) return notFound();

  const TemplateComponent = loadTemplate(template.filePath);

  return (
    <div>
      <Suspense fallback={<p>Loading template...</p>}>
        <TemplateComponent />
      </Suspense>
    </div>
  );
}
