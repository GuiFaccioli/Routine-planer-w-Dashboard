import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  pool?: Pool;
  db?: ReturnType<typeof drizzle<typeof schema>>;
};

function getDatabaseUrl(): string {
  const value = process.env.DATABASE_URL;
  if (!value) throw new Error("DATABASE_URL não está configurada.");
  return value;
}

export function getDb() {
  if (!globalForDb.db) {
    globalForDb.pool ??= new Pool({ connectionString: getDatabaseUrl() });
    globalForDb.db = drizzle(globalForDb.pool, { schema });
  }

  return globalForDb.db;
}
