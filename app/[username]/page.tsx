// import { notFound } from "next/navigation";
// import {
//   getUserIdByUsername,
//   getUserTemplateChoice,
//   getTemplateById,
// } from "@/lib/publicActions";
// import React, { Suspense } from "react";

// interface PublicPageProps {
//   params: { username: string };
// }

// const loadTemplate = (filePath: string) =>
//   React.lazy(() => import(`@/app/components/${filePath}/page`));

// export default async function PublicPage({ params }: PublicPageProps) {
//   // Aguardar a resolução dos parâmetros
//   const { username } = await params;

//   console.log("Fetching userId for username:", username);
//   // 1. Buscar o userId a partir do username
//   const userId = await getUserIdByUsername(username);
//   console.log("User ID:", userId);
//   if (!userId) return notFound();

//   // 2. Buscar o templateId escolhido pelo usuário na tabela `user_template_choices`
//   const userTemplateChoice = await getUserTemplateChoice(userId);
//   console.log("User Template Choice:", userTemplateChoice);
//   if (!userTemplateChoice) return notFound();

//   // 3. Usar o templateId para buscar o caminho do template na tabela `templates`
//   const template = await getTemplateById(userTemplateChoice.templateId);
//   console.log("Template:", template);
//   if (!template) return notFound();

//   // 4. Carregar o template dinamicamente usando `React.lazy`
//   const TemplateComponent = loadTemplate(template.filePath);

//   return (
//     <div>
//       <Suspense fallback={<p>Loading template...</p>}>
//         <TemplateComponent />
//       </Suspense>
//     </div>
//   );
// }

import { notFound } from "next/navigation";
import {
  getUserIdByUsername,
  getUserTemplateChoice,
  getTemplateById,
} from "@/lib/publicActions";
import React, { Suspense } from "react";

interface PublicPageProps {
  params: Promise<{ username: string }>; // Ajustar para `Promise`
}

const loadTemplate = (filePath: string) =>
  React.lazy(() => import(`@/app/components/${filePath}/page`));

export default async function PublicPage({ params }: PublicPageProps) {
  // Aguardar a resolução dos parâmetros
  const { username } = await params;

  console.log("Fetching userId for username:", username);
  // 1. Buscar o userId a partir do username
  const userId = await getUserIdByUsername(username);
  console.log("User ID:", userId);
  if (!userId) return notFound();

  // 2. Buscar o templateId escolhido pelo usuário na tabela `user_template_choices`
  const userTemplateChoice = await getUserTemplateChoice(userId);
  console.log("User Template Choice:", userTemplateChoice);
  if (!userTemplateChoice) return notFound();

  // 3. Usar o templateId para buscar o caminho do template na tabela `templates`
  const template = await getTemplateById(userTemplateChoice.templateId);
  console.log("Template:", template);
  if (!template) return notFound();

  // 4. Carregar o template dinamicamente usando `React.lazy`
  const TemplateComponent = loadTemplate(template.filePath);

  return (
    <div>
      <Suspense fallback={<p>Loading template...</p>}>
        <TemplateComponent />
      </Suspense>
    </div>
  );
}
