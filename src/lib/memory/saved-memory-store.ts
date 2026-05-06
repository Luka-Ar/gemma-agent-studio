import { asc, eq } from "drizzle-orm";
import { db, hasDatabase } from "@/lib/db";
import { savedMemories } from "@/lib/db/schema";

export async function saveMemory(key: string, value: string) {
  if (!hasDatabase() || !db) {
    return null;
  }

  try {
    const [row] = await db
      .insert(savedMemories)
      .values({ key, value })
      .onConflictDoUpdate({
        target: savedMemories.key,
        set: { value, updatedAt: new Date() },
      })
      .returning();
    return row ?? null;
  } catch (error) {
    console.warn("Failed to save memory", error);
    return null;
  }
}

export async function getMemory(key: string) {
  if (!hasDatabase() || !db) {
    return null;
  }

  try {
    const [row] = await db
      .select()
      .from(savedMemories)
      .where(eq(savedMemories.key, key));
    return row ?? null;
  } catch (error) {
    console.warn("Failed to get memory", error);
    return null;
  }
}

export async function listMemories() {
  if (!hasDatabase() || !db) {
    return [];
  }

  try {
    return await db.select().from(savedMemories).orderBy(asc(savedMemories.key));
  } catch (error) {
    console.warn("Failed to list memories", error);
    return [];
  }
}
