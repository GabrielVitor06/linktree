import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { users } from "./schema";

const client = createClient({
  url: process.env.NEXT_PUBLIC_DATABASE_URL!,
  authToken: process.env.NEXT_PUBLIC_DATABASE_AUTH_TOKEN,
});

// Verificação das variáveis de ambiente
if (
  !process.env.NEXT_PUBLIC_DATABASE_URL ||
  !process.env.NEXT_PUBLIC_DATABASE_AUTH_TOKEN
) {
  throw new Error("Database URL or Auth Token is not defined");
}

// Passando o esquema ao Drizzle
const db = drizzle(client, {
  schema: {
    users, // Certifique-se de incluir seu esquema aqui
  },
});
export const drizzleInstance = drizzle(client);

export default db;
