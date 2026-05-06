import type { ChatMessage, ChatResponse } from "@/lib/agent/types";

export async function runAgentLoop(
  messages: ChatMessage[]
): Promise<ChatResponse> {
  void messages;
  return {
    message: {
      role: "assistant",
      content:
        "Agent loop orchestration will be introduced in Phase 3 after Gemma integration.",
    },
  };
}