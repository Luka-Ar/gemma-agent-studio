export type ToolExecutionContext = {
	now: Date;
	timeZone?: string;
};

export type ToolResult = {
	ok: boolean;
	tool: string;
	result?: unknown;
	error?: string;
};

export type ToolDefinition = {
	name: string;
	description: string;
	run: (
		args: Record<string, unknown>,
		context: ToolExecutionContext
	) => Promise<ToolResult>;
};

function buildContext(): ToolExecutionContext {
	const now = new Date();
	const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	return { now, timeZone };
}

function normalizeText(value: unknown): string {
	if (typeof value === "string") {
		return value.trim();
	}
	return "";
}

function splitSentences(text: string): string[] {
	return text
		.split(/(?<=[.!?])\s+/)
		.map((sentence) => sentence.trim())
		.filter(Boolean);
}

function summarizeDeterministic(text: string): string {
	const sentences = splitSentences(text);
	if (sentences.length === 0) {
		return "No content provided to summarize.";
	}
	if (sentences.length === 1) {
		return sentences[0];
	}
	return `${sentences[0]} ${sentences[1]}`.trim();
}

function extractActionItemsDeterministic(text: string): string[] {
	const sentences = splitSentences(text);
	const actionVerbs = [
		"do",
		"review",
		"send",
		"update",
		"fix",
		"plan",
		"schedule",
		"ship",
		"follow up",
	];

	const actions = sentences.filter((sentence) =>
		actionVerbs.some((verb) => sentence.toLowerCase().includes(verb))
	);

	if (actions.length > 0) {
		return actions.slice(0, 5);
	}

	return sentences.slice(0, 3);
}

const getCurrentProjectInfo: ToolDefinition = {
	name: "getCurrentProjectInfo",
	description: "Return basic information about the current project.",
	run: async (args, context) => {
		void args;
		void context;
		return {
		tool: "getCurrentProjectInfo",
		ok: true,
		result: {
			name: "Gemma Agent Studio",
			currentPhase: "Phase 4",
			capabilities: [
				"chat",
				"model provider abstraction",
				"ollama local provider",
				"structured agent loop",
				"internal tools foundation",
			],
		},
		};
	},
};

const getDateTime: ToolDefinition = {
	name: "getDateTime",
	description: "Return the current date and time.",
	run: async (_args, context) => {
		const iso = context.now.toISOString();
		const local = context.now.toLocaleString();
		return {
			tool: "getDateTime",
			ok: true,
			result: {
				iso,
				local,
				timeZone: context.timeZone,
			},
		};
	},
};

const summarizeText: ToolDefinition = {
	name: "summarizeText",
	description: "Summarize a block of text deterministically.",
	run: async (args) => {
		const text = normalizeText(args.text);
		if (!text) {
			return {
				tool: "summarizeText",
				ok: false,
				error: "No text provided to summarize.",
			};
		}
		return {
			tool: "summarizeText",
			ok: true,
			result: {
				summary: summarizeDeterministic(text),
			},
		};
	},
};

const extractActionItems: ToolDefinition = {
	name: "extractActionItems",
	description: "Extract action items deterministically.",
	run: async (args) => {
		const text = normalizeText(args.text);
		if (!text) {
			return {
				tool: "extractActionItems",
				ok: false,
				error: "No text provided to extract action items.",
			};
		}
		return {
			tool: "extractActionItems",
			ok: true,
			result: {
				items: extractActionItemsDeterministic(text),
			},
		};
	},
};

const classifyIntent: ToolDefinition = {
	name: "classifyIntent",
	description: "Classify the intent of a message deterministically.",
	run: async (args) => {
		const message = normalizeText(args.message).toLowerCase();
		let intent = "general_chat";
		if (message.includes("project")) {
			intent = "project_info";
		} else if (message.includes("summarize")) {
			intent = "summarization";
		} else if (message.includes("action") || message.includes("todo")) {
			intent = "action_items";
		} else if (message.includes("time") || message.includes("date")) {
			intent = "datetime";
		}

		return {
			tool: "classifyIntent",
			ok: true,
			result: { intent },
		};
	},
};

export const toolRegistry: Record<string, ToolDefinition> = {
	getCurrentProjectInfo,
	getDateTime,
	summarizeText,
	extractActionItems,
	classifyIntent,
};

export function createToolContext(): ToolExecutionContext {
	return buildContext();
}