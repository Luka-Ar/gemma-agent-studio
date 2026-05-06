import type { ChatMessage, ChatResponse } from "@/lib/agent/types";

export async function callGemmaModel(
  _messages: ChatMessage[]
): Promise<ChatResponse> {
  void _messages;
  return {
    message: {
      role: "assistant",
      content:
        "This is a mocked Gemma Agent Studio response. Gemma model integration will be added in Phase 2.",
    },
  };
}