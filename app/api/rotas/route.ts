// import { NextResponse } from "next/server";
// import db from "@/lib/db";
// import { templates } from "@/lib/schema";
// import { getSession } from "@/lib/actions";

// export async function GET() {
//   const session = await getSession();

//   // Verifica se o usuário está autenticado
//   if (!session || !session.id) {
//     return NextResponse.json({
//       success: false,
//       message: "User not authenticated.",
//     });
//   }

//   // Busca todos os templates disponíveis
//   const allTemplates = await db.select().from(templates);
//   return NextResponse.json(allTemplates);
// }
