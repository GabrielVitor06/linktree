// src/app/api/links/[id]/route.ts
import { deleteLink } from "@/lib/linkActions";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const linkId = Number(params.id);

  if (isNaN(linkId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    await deleteLink(linkId);
    return NextResponse.json({ success: true });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao deletar link" },
      { status: 500 }
    );
  }
}

// src/app/api/user/links/route.ts
import { getSession } from "@/lib/actions"; // Ajuste o caminho conforme necessário
import { fetchUserLinks } from "@/lib/linkActions";

export async function GET() {
  const session = await getSession();

  if (!session || !session.id) {
    return NextResponse.json(
      { error: "Usuário não autenticado" },
      { status: 401 }
    );
  }

  const userId = Number(session.id);

  try {
    const userLinks = await fetchUserLinks(userId);
    return NextResponse.json({ userLinks });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar links do usuário" },
      { status: 500 }
    );
  }
}
