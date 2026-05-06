# Gemma Agent Studio

Gemma Agent Studio is a developer-focused, open-source agentic AI studio. It is currently in Phase 4 with an internal tool calling foundation, while the full agentic system is planned for later phases.

## Project Vision
Gemma Agent Studio is being built as an open-source developer-focused agentic AI studio with chat, structured reasoning, tool calling, memory, document RAG, GitHub repo analysis, and workflow automation.

## Current Status (Phase 4)
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
- Future: Postgres, pgvector, Gemma model provider, GitHub API

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

Response:
```json
{
  "message": {
    "role": "assistant",
    "content": "Mock provider active. Real Gemma integration will be added after provider credentials are configured."
  }
}
```

## Repo Description Suggestion
Open-source Gemma-powered agentic AI studio with chat, tool calling, memory, RAG, and developer workflow automation.