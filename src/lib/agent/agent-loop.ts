import type {
  AgentResponse,
  ChatMessage,
  ChatResponse,
  ToolCallResult,
} from "@/lib/agent/types";
import { STRUCTURED_AGENT_PROMPT } from "@/lib/agent/prompts";
import { callGemmaModel } from "@/lib/model/gemma-client";
import { TOOL_REGISTRY } from "@/lib/tools";

const MAX_ITERATIONS = 3;
const PROJECT_INFO_TOOL = "getCurrentProjectInfo";

type ProjectInfoIntent =
  | "project_identity"
  | "current_phase"
  | "current_capabilities"
  | "general_project_info";

type ProjectInfoData = {
  name?: string;
  currentPhase?: string;
  capabilities?: string[];
};

const PROJECT_INFO_PATTERNS = [
  /\bwhat\s+project\b/i,
  /\bwhat\s+project\s+is\s+this\b/i,
  /\bwhat\s+phase\b/i,
  /\bcurrent\s+phase\b/i,
  /\bwhat\s+can\s+this\s+app\s+do\b/i,
  /\bapp\s+capabilities\b/i,
  /\btell\s+me\s+about\s+(this|the)\s+project\b/i,
];

const PROJECT_IDENTITY_PATTERNS = [
  /\bwhat\s+project\b/i,
  /\bproject\s+name\b/i,
  /\bwhat\s+is\s+this\s+project\b/i,
  /\bwhat\s+is\s+this\b/i,
];

const PROJECT_PHASE_PATTERNS = [
  /\bphase\b/i,
  /\bstage\b/i,
  /\bwhere\s+are\s+we\b/i,
  /\bcurrent\s+phase\b/i,
];

const PROJECT_CAPABILITIES_PATTERNS = [
  /\bcan\s+do\b/i,
  /\bcapabilities\b/i,
  /\bfeatures\b/i,
  /\bwhat\s+can\s+this\s+app\s+do\b/i,
  /\bwhat\s+does\s+it\s+support\b/i,
];

function parseAgentResponse(raw: string): AgentResponse | null {
  try {
    return JSON.parse(raw) as AgentResponse;
  } catch {
    return null;
  }
}

function buildToolResultMessage(result: ToolCallResult): ChatMessage {
  return {
    role: "system",
    content: `Tool result: ${JSON.stringify(result)}`,
  };
}

function getLatestUserMessage(messages: ChatMessage[]): ChatMessage | null {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (message.role === "user") {
      return message;
    }
  }

  return null;
}

function classifyProjectInfoIntent(text: string): ProjectInfoIntent {
  if (PROJECT_IDENTITY_PATTERNS.some((pattern) => pattern.test(text))) {
    return "project_identity";
  }
  if (PROJECT_PHASE_PATTERNS.some((pattern) => pattern.test(text))) {
    return "current_phase";
  }
  if (PROJECT_CAPABILITIES_PATTERNS.some((pattern) => pattern.test(text))) {
    return "current_capabilities";
  }
  return "general_project_info";
}

function formatProjectInfoAnswer(
  intent: ProjectInfoIntent,
  info: ProjectInfoData
): string {
  const name = info.name ?? "Gemma Agent Studio";
  const phase = info.currentPhase ?? "Phase 3";
  const capabilities = info.capabilities ?? [];

  switch (intent) {
    case "project_identity":
      return `${name}. A developer-focused agentic AI studio project.`;
    case "current_phase":
      return `${phase}. We are focused on the structured agent loop right now.`;
    case "current_capabilities":
      if (capabilities.length === 0) {
        return "Current capabilities are not listed yet.";
      }
      return `Current capabilities: ${capabilities.join(", ")}.`;
    default:
      return `${name} is a developer-focused agentic AI studio. It is currently in ${phase} with a structured agent loop and local provider support.`;
  }
}

function isProjectInfoQuery(messages: ChatMessage[]): boolean {
  const latestMessage = getLatestUserMessage(messages);
  if (!latestMessage) {
    return false;
  }
  const text = latestMessage.content.trim();
  return PROJECT_INFO_PATTERNS.some((pattern) => pattern.test(text));
}

export async function runAgentLoop(
  messages: ChatMessage[]
): Promise<ChatResponse> {
  const conversation: ChatMessage[] = [
    { role: "system", content: STRUCTURED_AGENT_PROMPT },
    ...messages,
  ];

  let lastRawResponse = "";

  if (isProjectInfoQuery(messages)) {
    const latestMessage = getLatestUserMessage(messages);
    const intent = latestMessage
      ? classifyProjectInfoIntent(latestMessage.content)
      : "general_project_info";
    const tool = TOOL_REGISTRY[PROJECT_INFO_TOOL];
    const toolResult = tool
      ? await tool.run({})
      : {
          tool: PROJECT_INFO_TOOL,
          ok: false,
          error: "Requested tool is not available.",
        };

    if (!toolResult.ok || !toolResult.result) {
      return {
        message: {
          role: "assistant",
          content:
            toolResult.error ??
            "Project info is not available right now. Please try again.",
        },
      };
    }

    const info = toolResult.result as ProjectInfoData;
    return {
      message: {
        role: "assistant",
        content: formatProjectInfoAnswer(intent, info),
      },
    };
  }

  for (let step = 0; step < MAX_ITERATIONS; step += 1) {
    const modelResult = await callGemmaModel(conversation);
    const rawResponse = modelResult.message.content.trim();
    lastRawResponse = rawResponse;

    const agentResponse = parseAgentResponse(rawResponse);
    if (!agentResponse) {
      return {
        message: {
          role: "assistant",
          content: rawResponse,
        },
      };
    }

    if (agentResponse.type === "final") {
      return {
        message: {
          role: "assistant",
          content: agentResponse.answer,
        },
      };
    }

    if (agentResponse.type === "error") {
      return {
        message: {
          role: "assistant",
          content: agentResponse.message,
        },
      };
    }

    if (agentResponse.type === "tool_call") {
      const tool = TOOL_REGISTRY[agentResponse.tool];
      let toolResult: ToolCallResult;

      if (!tool) {
        toolResult = {
          tool: agentResponse.tool,
          ok: false,
          error: "Requested tool is not available.",
        };
      } else {
        try {
          toolResult = await tool.run(agentResponse.args ?? {});
        } catch {
          toolResult = {
            tool: agentResponse.tool,
            ok: false,
            error: "Tool execution failed.",
          };
        }
      }

      conversation.push(buildToolResultMessage(toolResult));
      conversation.push({
        role: "system",
        content:
          "Summarize the tool result for the user. Respond with JSON only using type 'final'.",
      });
    }
  }

  return {
    message: {
      role: "assistant",
      content:
        lastRawResponse ||
        "Agent loop reached the maximum number of steps without a final answer.",
    },
  };
}