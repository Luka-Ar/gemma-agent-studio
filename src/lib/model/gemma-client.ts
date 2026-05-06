import type { ChatMessage } from "@/lib/agent/types";
import type {
  GenerateInput,
  GenerateResult,
  ModelClient,
} from "@/lib/model/model-client";

type GemmaProvider = "mock" | string;

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
    void input;

    if (this.provider !== "mock") {
      void this.apiKey;
      void this.model;
      void this.baseUrl;
      throw new Error(
        "Gemma provider is not configured. Set GEMMA_PROVIDER=mock for local development."
      );
    }

    return {
      message: {
        role: "assistant",
        content:
          "Mock provider active. Real Gemma integration will be added after provider credentials are configured.",
      },
    };
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