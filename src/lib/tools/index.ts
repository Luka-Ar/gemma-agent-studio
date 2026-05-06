import type { ToolCallResult } from "@/lib/agent/types";

export type ToolDefinition = {
	name: string;
	description: string;
	run: (args: Record<string, unknown>) => Promise<ToolCallResult>;
};

const getCurrentProjectInfo: ToolDefinition = {
	name: "getCurrentProjectInfo",
	description: "Return basic information about the current project.",
	run: async () => ({
		tool: "getCurrentProjectInfo",
		ok: true,
		result: {
			name: "Gemma Agent Studio",
			currentPhase: "Phase 3",
			capabilities: [
				"chat",
				"model provider abstraction",
				"ollama local provider",
				"structured agent loop",
			],
		},
	}),
};

export const TOOL_REGISTRY: Record<string, ToolDefinition> = {
	getCurrentProjectInfo,
};