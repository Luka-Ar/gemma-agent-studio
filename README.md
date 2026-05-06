# Gemma Agent Studio

Gemma Agent Studio is a developer-focused, open-source agentic AI studio. It is currently in Phase 5 with a Postgres-backed memory foundation, while the full agentic system is planned for later phases.

## Project Vision
Gemma Agent Studio is being built as an open-source developer-focused agentic AI studio with chat, structured reasoning, tool calling, memory, document RAG, GitHub repo analysis, and workflow automation.

## Current Status (Phase 5)
Phase 1 includes:
- Clean Next.js chat interface
- Mocked assistant API response
- Modular project structure
- Roadmap documented in PLAN.md

Phase 2 adds:
- Model client abstraction added
- Provider-agnostic Gemma client with mock fallback

Phase 2.1 adds:
- Ollama local provider support

Phase 3 adds:
- Structured agent loop with JSON response handling
- Mock tool registry with a project info tool
- Deterministic routing for project-info questions
- Intent-aware, concise project-info answers

Phase 4 adds:
- Internal tool calling foundation
- Deterministic, local tools for datetime, summarization, action items, and intent classification

Phase 5 adds:
- Postgres + Drizzle schema for conversations, messages, saved memories, and tool calls
- Optional persistence for chat messages and tool calls (no vector/RAG memory yet)

Current internal tools:
- getCurrentProjectInfo
- getDateTime
- summarizeText
- extractActionItems
- classifyIntent

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

## Tech Stack
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Zod
- Drizzle ORM
- Postgres
- Future: pgvector, Gemma model provider, GitHub API

## Getting Started
```bash
npm install
npm run dev
```

Open http://localhost:3000

### Environment Setup
Create a `.env.local` file using `.env.example` as a template:

```bash
GEMMA_PROVIDER=mock
GEMMA_API_KEY=
GEMMA_MODEL=
GEMMA_BASE_URL=
DATABASE_URL=
```

#### Mock Provider
The mock provider returns a safe placeholder response for local development.

#### Ollama Provider (Local)
1. Install Ollama: https://ollama.com
2. Pull or install a Gemma model locally. For first tests, `gemma3:1b` is recommended:
  ```bash
  ollama pull gemma3:1b
  ```
3. Set `.env.local`:
  ```bash
  GEMMA_PROVIDER=ollama
  GEMMA_MODEL=gemma3:1b
  GEMMA_BASE_URL=http://127.0.0.1:11434
  ```
4. Run the app:
  ```bash
  npm run dev
  ```

The project supports Ollama provider mode, but you must install the model locally. After validation, you can switch to a larger model such as `gemma4:e2b`.

#### Optional Database Setup (Phase 5)
Persistence is optional. If `DATABASE_URL` is not set, the app still runs without saving conversations, messages, or tool calls.

Example Postgres connection string:
```bash
DATABASE_URL=postgres://user:password@localhost:5432/gemma_agent_studio
```

Drizzle commands:
```bash
npm run db:generate
npm run db:migrate
npm run db:studio
```

## Current API
POST /api/chat

Request:
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Hello"
    }
  ]
}
```

Optional request with persistence:
```json
{
  "conversationId": "uuid",
  "messages": [
    {
      "role": "user",
      "content": "Hello"
    }
  ]
}
```

Response:
```json
{
  "message": {
    "role": "assistant",
    "content": "Mock provider active. Real Gemma integration will be added after provider credentials are configured."
  }
}
```

Optional response when persistence is enabled:
```json
{
  "conversationId": "uuid",
  "message": {
    "role": "assistant",
    "content": "Mock provider active. Real Gemma integration will be added after provider credentials are configured."
  }
}
```

## Repo Description Suggestion
Open-source Gemma-powered agentic AI studio with chat, tool calling, memory, RAG, and developer workflow automation.