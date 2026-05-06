import type { ChatMessage } from "@/lib/agent/types";

export type GenerateInput = {
  messages: ChatMessage[];
};

export type GenerateResult = {
  message: ChatMessage;
};

export interface ModelClient {
  generate(input: GenerateInput): Promise<GenerateResult>;
}