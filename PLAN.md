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

## Phase 1 Implementation Plan (Current)
1. Move the Next.js App Router structure under src/.
2. Create chat UI components (window, message list, input) and a clean homepage layout.
3. Define shared types for messages and API payloads.
4. Implement a mocked /api/chat route with validation and error handling.
5. Add a placeholder Gemma client function that returns the mocked response.
6. Wire client-side loading and basic error states in the chat UI.
7. Polish the Phase 1 UI with shadcn/ui components and refined spacing.