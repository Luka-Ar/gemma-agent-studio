import { desc, eq } from "drizzle-orm";
import { db, hasDatabase } from "@/lib/db";
import { conversations, messages, toolCalls } from "@/lib/db/schema";

export async function createConversation(title?: string) {
  if (!hasDatabase() || !db) {
    return null;
  }

  try {
    const [row] = await db
      .insert(conversations)
      .values({ title: title ?? "New conversation" })
      .returning();
    return row ?? null;
  } catch (error) {
    console.warn("Failed to create conversation", error);
    return null;
  }
}

export async function saveMessage(
  conversationId: string,
  role: string,
  content: string
) {
  if (!hasDatabase() || !db) {
    return null;
  }

  try {
    const [row] = await db
      .insert(messages)
      .values({ conversationId, role, content })
      .returning();
    await db
      .update(conversations)
      .set({ updatedAt: new Date() })
      .where(eq(conversations.id, conversationId));
    return row ?? null;
  } catch (error) {
    console.warn("Failed to save message", error);
    return null;
  }
}

export async function getConversationMessages(conversationId: string) {
  if (!hasDatabase() || !db) {
    return [];
  }

  try {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(desc(messages.createdAt));
  } catch (error) {
    console.warn("Failed to fetch messages", error);
    return [];
  }
}

export async function saveToolCall(
  conversationId: string | null,
  toolName: string,
  input: unknown,
  output: unknown
) {
  if (!hasDatabase() || !db) {
    return null;
  }

  try {
    const [row] = await db
      .insert(toolCalls)
      .values({
        conversationId,
        toolName,
        inputJson: input,
        outputJson: output,
      })
      .returning();
    return row ?? null;
  } catch (error) {
    console.warn("Failed to save tool call", error);
    return null;
  }
}
