import type {
  AgentResponse,
  ChatMessage,
  ChatResponse,
} from "@/lib/agent/types";
import { STRUCTURED_AGENT_PROMPT } from "@/lib/agent/prompts";
import { callGemmaModel } from "@/lib/model/gemma-client";
import {
  createToolContext,
  toolRegistry,
  type ToolResult,
} from "@/lib/tools";
import { saveToolCall } from "@/lib/memory/conversation-store";

const MAX_ITERATIONS = 3;
const PROJECT_INFO_TOOL = "getCurrentProjectInfo";
const DATETIME_TOOL = "getDateTime";
const SUMMARIZE_TOOL = "summarizeText";
const ACTION_ITEMS_TOOL = "extractActionItems";

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

function buildToolResultMessage(result: ToolResult): ChatMessage {
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

function getLatestUserText(messages: ChatMessage[]): string {
  const message = getLatestUserMessage(messages);
  return message ? message.content.trim() : "";
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
  const phase = info.currentPhase ?? "Phase 5";
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

function isDateTimeQuery(text: string): boolean {
  return /\b(time|date|day|timezone)\b/i.test(text);
}

function isSummarizeQuery(text: string): boolean {
  return /\bsummarize\b/i.test(text);
}

function isActionItemsQuery(text: string): boolean {
  return /\b(action\s+items|todo|to-do)\b/i.test(text);
}

function extractInlineText(text: string): string {
  const match = text.match(/\b(?:summarize|summary|extract action items|action items|todo)\b[:\s-]*(.*)/i);
  if (match && match[1]) {
    return match[1].trim();
  }
  return "";
}

type AgentLoopOptions = {
  conversationId?: string | null;
};

async function recordToolCall(
  conversationId: string | null | undefined,
  toolName: string,
  input: unknown,
  output: unknown
) {
  if (!conversationId) {
    return;
  }

  await saveToolCall(conversationId, toolName, input, output);
}

export async function runAgentLoop(
  messages: ChatMessage[],
  options?: AgentLoopOptions
): Promise<ChatResponse> {
  const conversationId = options?.conversationId ?? null;
  const conversation: ChatMessage[] = [
    { role: "system", content: STRUCTURED_AGENT_PROMPT },
    ...messages,
  ];

  let lastRawResponse = "";
  const toolContext = createToolContext();
  const latestUserText = getLatestUserText(messages);

  if (isProjectInfoQuery(messages)) {
    const latestMessage = getLatestUserMessage(messages);
    const intent = latestMessage
      ? classifyProjectInfoIntent(latestMessage.content)
      : "general_project_info";
    const tool = toolRegistry[PROJECT_INFO_TOOL];
    const toolResult = tool
      ? await tool.run({}, toolContext)
      : {
          tool: PROJECT_INFO_TOOL,
          ok: false,
          error: "Requested tool is not available.",
        };

    await recordToolCall(conversationId, PROJECT_INFO_TOOL, {}, toolResult);

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

  if (latestUserText && isDateTimeQuery(latestUserText)) {
    const tool = toolRegistry[DATETIME_TOOL];
    const toolResult = tool
      ? await tool.run({}, toolContext)
      : { tool: DATETIME_TOOL, ok: false, error: "Tool is unavailable." };

    await recordToolCall(conversationId, DATETIME_TOOL, {}, toolResult);
    if (!toolResult.ok || !toolResult.result) {
      return {
        message: {
          role: "assistant",
          content: toolResult.error ?? "Date and time are not available.",
        },
      };
    }
    const result = toolResult.result as {
      iso?: string;
      local?: string;
      timeZone?: string;
    };
    const timeZoneLabel = result.timeZone ? ` (${result.timeZone})` : "";
    return {
      message: {
        role: "assistant",
        content: `${result.local ?? "Current time"}${timeZoneLabel}.`,
      },
    };
  }

  if (latestUserText && isSummarizeQuery(latestUserText)) {
    const inlineText = extractInlineText(latestUserText);
    const tool = toolRegistry[SUMMARIZE_TOOL];
    const toolResult = tool
      ? await tool.run({ text: inlineText }, toolContext)
      : { tool: SUMMARIZE_TOOL, ok: false, error: "Tool is unavailable." };

    await recordToolCall(
      conversationId,
      SUMMARIZE_TOOL,
      { text: inlineText },
      toolResult
    );
    if (!toolResult.ok || !toolResult.result) {
      return {
        message: {
          role: "assistant",
          content:
            toolResult.error ??
            "Please provide the text you want summarized.",
        },
      };
    }
    const result = toolResult.result as { summary?: string };
    return {
      message: {
        role: "assistant",
        content: result.summary ?? "No summary available.",
      },
    };
  }

  if (latestUserText && isActionItemsQuery(latestUserText)) {
    const inlineText = extractInlineText(latestUserText);
    const tool = toolRegistry[ACTION_ITEMS_TOOL];
    const toolResult = tool
      ? await tool.run({ text: inlineText }, toolContext)
      : {
          tool: ACTION_ITEMS_TOOL,
          ok: false,
          error: "Tool is unavailable.",
        };

    await recordToolCall(
      conversationId,
      ACTION_ITEMS_TOOL,
      { text: inlineText },
      toolResult
    );
    if (!toolResult.ok || !toolResult.result) {
      return {
        message: {
          role: "assistant",
          content:
            toolResult.error ??
            "Please provide the text you want action items extracted from.",
        },
      };
    }
    const result = toolResult.result as { items?: string[] };
    const items = result.items ?? [];
    if (items.length === 0) {
      return {
        message: {
          role: "assistant",
          content: "No action items found.",
        },
      };
    }
    return {
      message: {
        role: "assistant",
        content: `Action items: ${items.join("; ")}.`,
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
      const tool = toolRegistry[agentResponse.tool];
      const toolResult = tool
        ? await tool.run(agentResponse.args ?? {}, toolContext)
        : {
            tool: agentResponse.tool,
            ok: false,
            error: "Requested tool is not available.",
          };

      await recordToolCall(
        conversationId,
        agentResponse.tool,
        agentResponse.args ?? {},
        toolResult
      );

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