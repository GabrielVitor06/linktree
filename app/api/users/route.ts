import { NextResponse } from "next/server";
import db from "@/lib/db";
import { templates, userTemplateChoices } from "@/lib/schema";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await getSession();

  if (!session || !session.id) {
    return NextResponse.json({
      success: false,
      message: "User not authenticated.",
    });
  }

  const allTemplates = await db.select().from(templates);
  return NextResponse.json(allTemplates);
}

export async function POST(req: Request) {
  const session = await getSession();

  if (!session || !session.id) {
    return NextResponse.json({
      success: false,
      message: "User not authenticated.",
    });
  }

  const { templateId } = await req.json();
  const userId = Number(session.id);

  const template = await db
    .select()
    .from(templates)
    .where(eq(templates.id, templateId))
    .get();

  if (!template) {
    return NextResponse.json({
      success: false,
      message: "Template not found.",
    });
  }

  await db.insert(userTemplateChoices).values({
    userId: userId,
    templateId: templateId,
  });

  return NextResponse.json({
    success: true,
    message: "Template escolhido com sucesso!",
    filePath: template.filePath,
  });
}
