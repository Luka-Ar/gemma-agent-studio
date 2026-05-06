# Gemma Agent Studio Plan

## Roadmap
- Phase 1: Basic chat UI with mocked backend response
- Phase 2: Gemma model client integration
- Phase 3: Structured agent loop
- Phase 4: Tool calling
- Phase 5: Memory with Postgres
- Phase 6: File/document RAG
- Phase 7: GitHub repo assistant
- Phase 8: Telegram/Discord interface
- Phase 9: Evaluation and portfolio polish

## Phase 1 Implementation Plan (Complete)
1. Move the Next.js App Router structure under src/.
2. Create chat UI components (window, message list, input) and a clean homepage layout.
3. Define shared types for messages and API payloads.
4. Implement a mocked /api/chat route with validation and error handling.
5. Add a placeholder Gemma client function that returns the mocked response.
6. Wire client-side loading and basic error states in the chat UI.
7. Polish the Phase 1 UI with shadcn/ui components and refined spacing.

## Phase 2 Implementation Notes (Complete)
1. Add a provider-agnostic model client interface and types.
2. Implement a Gemma client that reads environment configuration.
3. Support a mock provider fallback for local development.
4. Route /api/chat through the model client abstraction.
5. Document environment setup and Phase 2 status in README.

## Phase 2.1 Implementation Notes (Complete)
1. Add Ollama provider support in the Gemma client.
2. Use the Ollama local API without extra SDKs.
3. Add config examples for local providers in .env.example.
4. Document Ollama setup steps in README.

## Phase 3 Implementation Notes (Complete)
1. Add structured agent response types and tool call result types.
2. Add a JSON-only structured agent system prompt.
3. Implement a mock tool registry with project info.
4. Run a bounded agent loop with tool calls and safe fallbacks.
5. Route /api/chat through the agent loop.
6. Add deterministic routing for project-info questions.
7. Add intent-aware, concise formatting for project-info responses.

## Phase 4 Implementation Notes (Complete)
1. Introduce internal tool definitions, execution context, and result types.
2. Add deterministic internal tools for datetime, summarization, and action items.
3. Add intent classification helper tool.
4. Route specific queries to tools before invoking the model.