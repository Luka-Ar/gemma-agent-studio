import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "@/lib/db/schema";

const connectionString = process.env.DATABASE_URL;
let hasWarned = false;

const sql = connectionString
  ? postgres(connectionString, { max: 1 })
  : null;

export const db = sql ? drizzle(sql, { schema }) : null;

export function hasDatabase(): boolean {
  if (!connectionString) {
    if (!hasWarned) {
      console.warn("DATABASE_URL is not set. Persistence is disabled.");
      hasWarned = true;
    }
    return false;
  }
  return true;
}
