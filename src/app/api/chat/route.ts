import { NextResponse } from "next/server";
import { z } from "zod";
import { runAgentLoop } from "@/lib/agent/agent-loop";
import type { ChatRequest, ChatResponse } from "@/lib/agent/types";
import {
  createConversation,
  saveMessage,
} from "@/lib/memory/conversation-store";
import { db, hasDatabase } from "@/lib/db";

const chatRequestSchema = z.object({
  conversationId: z.string().min(1).optional(),
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant", "system"]),
      content: z.string().min(1),
    })
  ),
});

function getConversationTitle(messages: ChatRequest["messages"]): string | undefined {
  const firstUserMessage = messages.find((message) => message.role === "user");
  if (!firstUserMessage) {
    return undefined;
  }
  return firstUserMessage.content.trim().slice(0, 80) || undefined;
}

function getLatestUserMessage(messages: ChatRequest["messages"]) {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (message.role === "user") {
      return message;
    }
  }
  return null;
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as ChatRequest;
    const parsed = chatRequestSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request payload." },
        { status: 400 }
      );
    }

    const dbAvailable = hasDatabase() && db !== null;
    let conversationId = parsed.data.conversationId ?? null;

    if (dbAvailable && !conversationId) {
      const conversation = await createConversation(
        getConversationTitle(parsed.data.messages)
      );
      conversationId = conversation?.id ?? null;
    }

    const response = await runAgentLoop(parsed.data.messages, {
      conversationId,
    });

    if (dbAvailable && conversationId) {
      const latestUserMessage = getLatestUserMessage(parsed.data.messages);
      if (latestUserMessage) {
        await saveMessage(
          conversationId,
          latestUserMessage.role,
          latestUserMessage.content
        );
      }
      await saveMessage(
        conversationId,
        response.message.role,
        response.message.content
      );
    }

    const payloadResponse: ChatResponse = conversationId
      ? { conversationId, message: response.message }
      : response;

    return NextResponse.json(payloadResponse);
  } catch (error) {
    console.error("/api/chat error", error);
    return NextResponse.json(
      { error: "Failed to process the chat request." },
      { status: 500 }
    );
  }
}