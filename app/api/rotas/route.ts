// // /app/api/templates/route/[userId].ts
// import { NextResponse } from "next/server";
// import db from "@/lib/db";
// import { templates, userTemplateChoices } from "@/lib/schema";
// import { getSession } from "@/lib/actions";
// import { eq } from "drizzle-orm"; // Certifique-se de que este é o caminho correto para o pacote ORM

// export async function GET(
//   req: Request,
//   { params }: { params: { userId: string } }
// ) {
//   const session = await getSession();

//   // Verifica se o usuário está autenticado
//   if (!session || !session.id) {
//     return NextResponse.json({
//       success: false,
//       message: "User not authenticated.",
//     });
//   }

//   const userId = Number(params.userId); // Obtém o ID do usuário da URL

//   try {
//     // Passo 1: Busca a escolha do template do usuário
//     const userTemplateChoice = await db
//       .select({
//         templateId: userTemplateChoices.templateId,
//       })
//       .from(userTemplateChoices)
//       .where(eq(userTemplateChoices.userId, userId))
//       .get();

//     if (!userTemplateChoice) {
//       return NextResponse.json({
//         success: false,
//         message: "No template choice found for user.",
//       });
//     }

//     // Passo 2: Busca o template associado ao templateId obtido
//     const template = await db
//       .select()
//       .from(templates)
//       .where(eq(templates.id, userTemplateChoice.templateId))
//       .get();

//     if (!template) {
//       return NextResponse.json({
//         success: false,
//         message: "Template not found.",
//       });
//     }

//     // Retorna a rota do template
//     return NextResponse.json({
//       success: true,
//       message: "Template route retrieved successfully.",
//       filePath: template.filePath,
//     });
//   } catch (error) {
//     console.error("Error fetching template route:", error);
//     return NextResponse.json({
//       success: false,
//       message: "An error occurred while fetching the template route.",
//     });
//   }
// }

import { NextResponse } from "next/server";
import db from "@/lib/db";
import { templates } from "@/lib/schema";
import { getSession } from "@/lib/actions";

export async function GET() {
  const session = await getSession();

  // Verifica se o usuário está autenticado
  if (!session || !session.id) {
    return NextResponse.json({
      success: false,
      message: "User not authenticated.",
    });
  }

  // Busca todos os templates disponíveis
  const allTemplates = await db.select().from(templates);
  return NextResponse.json(allTemplates);
}
