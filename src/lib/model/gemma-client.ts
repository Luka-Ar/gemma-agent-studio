import type { ChatMessage, ChatRole } from "@/lib/agent/types";
import { BASE_SYSTEM_PROMPT } from "@/lib/agent/prompts";
import type {
  GenerateInput,
  GenerateResult,
  ModelClient,
} from "@/lib/model/model-client";

type GemmaProvider = "mock" | "ollama" | string;
type OllamaMessage = { role: ChatRole; content: string };
type OllamaResponse = {
  message?: { content?: string };
  error?: string;
};

const OLLAMA_DEFAULT_BASE_URL = "http://127.0.0.1:11434";
const MODEL_NOT_FOUND_MESSAGE =
  "Ollama model not found. Pull the model or verify GEMMA_MODEL.";
const OLLAMA_UNAVAILABLE_MESSAGE =
  "Ollama is not reachable. Ensure it is running locally.";

class GemmaClient implements ModelClient {
  private readonly provider: GemmaProvider;
  private readonly apiKey: string | undefined;
  private readonly model: string | undefined;
  private readonly baseUrl: string | undefined;

  constructor() {
    this.provider = process.env.GEMMA_PROVIDER ?? "mock";
    this.apiKey = process.env.GEMMA_API_KEY;
    this.model = process.env.GEMMA_MODEL;
    this.baseUrl = process.env.GEMMA_BASE_URL;
  }

  async generate(input: GenerateInput): Promise<GenerateResult> {
    if (this.provider === "mock") {
      void this.apiKey;
      void this.model;
      void this.baseUrl;
      return {
        message: {
          role: "assistant",
          content:
            "Mock provider active. Real Gemma integration will be added after provider credentials are configured.",
        },
      };
    }

    if (this.provider === "ollama") {
      return this.generateWithOllama(input);
    }

    throw new Error("Unsupported GEMMA_PROVIDER. Use mock or ollama.");
  }

  private async generateWithOllama(
    input: GenerateInput
  ): Promise<GenerateResult> {
    if (!this.model) {
      throw new Error("GEMMA_MODEL is required for the ollama provider.");
    }

    const baseUrl = this.baseUrl ?? OLLAMA_DEFAULT_BASE_URL;
    const messages: OllamaMessage[] = [
      { role: "system", content: BASE_SYSTEM_PROMPT },
      ...input.messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
    ];

    try {
      const response = await fetch(`${baseUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: this.model,
          messages,
          stream: false,
          options: {
            temperature: 0.4,
          },
        }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(MODEL_NOT_FOUND_MESSAGE);
        }

        const errorMessage = await this.readOllamaError(response);
        throw new Error(errorMessage);
      }

      const data = (await response.json()) as OllamaResponse;
      const content = data.message?.content?.trim();

      if (!content) {
        throw new Error("Ollama returned an empty response.");
      }

      return {
        message: {
          role: "assistant",
          content,
        },
      };
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === MODEL_NOT_FOUND_MESSAGE) {
          throw error;
        }

        if (error.message.includes("fetch")) {
          throw new Error(OLLAMA_UNAVAILABLE_MESSAGE);
        }

        throw error;
      }

      throw new Error(OLLAMA_UNAVAILABLE_MESSAGE);
    }
  }

  private async readOllamaError(response: Response): Promise<string> {
    try {
      const data = (await response.json()) as OllamaResponse;
      if (data.error?.toLowerCase().includes("model")) {
        return MODEL_NOT_FOUND_MESSAGE;
      }
      if (data.error) {
        return "Ollama request failed. Verify the model and service status.";
      }
    } catch {
      return "Ollama request failed. Verify the model and service status.";
    }

    return "Ollama request failed. Verify the model and service status.";
  }
}

export function createGemmaClient(): ModelClient {
  return new GemmaClient();
}

export async function callGemmaModel(
  messages: ChatMessage[]
): Promise<GenerateResult> {
  const client = createGemmaClient();
  return client.generate({ messages });
}