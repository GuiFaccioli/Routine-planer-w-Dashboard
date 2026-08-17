import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

function getDatabaseUrl(): string {
  const value = process.env.DATABASE_URL;
  if (!value) throw new Error("DATABASE_URL não está configurada.");
  return value;
}

export function getDb() {
  return drizzle(neon(getDatabaseUrl()), { schema });
}
