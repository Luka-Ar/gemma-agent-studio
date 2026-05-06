# Gemma Agent Studio

Gemma Agent Studio is a developer-focused, open-source agentic AI studio. It is currently in Phase 1 with a polished chat interface and mocked responses, while the full agentic system is planned for later phases.

## Project Vision
Gemma Agent Studio is being built as an open-source developer-focused agentic AI studio with chat, structured reasoning, tool calling, memory, document RAG, GitHub repo analysis, and workflow automation.

## Current Status (Phase 1)
Phase 1 includes:
- Clean Next.js chat interface
- Mocked assistant API response
- Modular project structure
- Roadmap documented in PLAN.md

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
    "content": "This is a mocked Gemma Agent Studio response. Gemma model integration will be added in Phase 2."
  }
}
```

## Repo Description Suggestion
Open-source Gemma-powered agentic AI studio with chat, tool calling, memory, RAG, and developer workflow automation.