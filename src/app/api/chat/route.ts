import { NextResponse } from "next/server";
import { z } from "zod";
import { callGemmaModel } from "@/lib/model/gemma-client";
import type { ChatRequest, ChatResponse } from "@/lib/agent/types";

const chatRequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant", "system"]),
      content: z.string().min(1),
    })
  ),
});

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

    const response: ChatResponse = await callGemmaModel(parsed.data.messages);
    return NextResponse.json(response);
  } catch (error) {
    console.error("/api/chat error", error);
    return NextResponse.json(
      { error: "Failed to process the chat request." },
      { status: 500 }
    );
  }
}