import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { users, otps } from "./schema";

const client = createClient({
  url: process.env.NEXT_PUBLIC_DATABASE_URL!,
  authToken: process.env.NEXT_PUBLIC_DATABASE_AUTH_TOKEN,
});

const db = drizzle(client, {
  schema: {
    users,
    otps,
  },
});
export const drizzleInstance = drizzle(client);

export default db;
