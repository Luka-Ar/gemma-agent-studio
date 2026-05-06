export type ChatRole = "user" | "assistant" | "system";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type ChatRequest = {
  conversationId?: string;
  messages: ChatMessage[];
};

export type ChatResponse = {
  conversationId?: string;
  message: ChatMessage;
};

export type AgentFinalResponse = {
  type: "final";
  answer: string;
};

export type AgentToolCallResponse = {
  type: "tool_call";
  tool: string;
  args: Record<string, unknown>;
};

export type AgentErrorResponse = {
  type: "error";
  message: string;
};

export type AgentResponse =
  | AgentFinalResponse
  | AgentToolCallResponse
  | AgentErrorResponse;

export type ToolCallResult = {
  tool: string;
  ok: boolean;
  result?: unknown;
  error?: string;
};