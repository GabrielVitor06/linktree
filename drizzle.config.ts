import type { Config } from "drizzle-kit";
import { loadEnvConfig } from "@next/env";

loadEnvConfig("./");

export default {
  dialect: "turso", // "mysql" | "sqlite" | "postgresql"
  schema: "lib/schema.ts",
  // driver: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
} satisfies Config;
