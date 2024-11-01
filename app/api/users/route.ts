import { NextResponse } from "next/server";
import db from "@/lib/db";
import { templates, userTemplateChoices } from "@/lib/schema";
import { getSession } from "@/lib/actions";
import { eq } from "drizzle-orm"; // Substitua com o local correto do pacote ORM que fornece `eq`

// Função GET para obter todos os templates
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

// Função POST para salvar a escolha do template
export async function POST(req: Request) {
  const session = await getSession();

  // Verifica se o usuário está autenticado
  if (!session || !session.id) {
    return NextResponse.json({
      success: false,
      message: "User not authenticated.",
    });
  }

  const { templateId } = await req.json();
  const userId = Number(session.id); // Obtém o ID do usuário da sessão

  // Verifica se o template existe
  const template = await db
    .select()
    .from(templates)
    .where(eq(templates.id, templateId))
    .get();

  // Verifica se o template foi encontrado
  if (!template) {
    return NextResponse.json({
      success: false,
      message: "Template not found.",
    });
  }

  // Salvar a escolha do template no banco de dados
  await db.insert(userTemplateChoices).values({
    userId: userId, // Certifique-se de que isso é um número
    templateId: templateId, // Certifique-se de que isso é um número
  });

  return NextResponse.json({
    success: true,
    message: "Template escolhido com sucesso!",
    filePath: template.filePath,
  });
}
