import ChatWindow from "@/components/chat/chat-window";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-panel/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Gemma Agent Studio
            </span>
            <h1 className="text-2xl font-semibold text-app-foreground">
              Agentic AI Workspace
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="uppercase tracking-[0.2em]">
              Phase 3
            </Badge>
            <span className="text-xs text-muted-foreground">
              Structured agent loop
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-10">
        <Card className="border-border/80 bg-panel/90">
          <CardHeader className="gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="uppercase tracking-[0.2em]">
                Console
              </Badge>
              <Separator className="hidden h-4 sm:block" orientation="vertical" />
              <span className="text-xs text-muted-foreground">
                Developer-focused assistant workspace
              </span>
            </div>
            <h2 className="text-3xl font-semibold text-app-foreground sm:text-4xl">
              Talk to your Gemma-powered assistant
            </h2>
            <CardDescription className="max-w-2xl text-base">
              Phase 3 adds a structured agent loop with tool-aware routing on
              top of the existing model provider abstraction.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 text-sm text-muted-foreground sm:grid-cols-3">
              <div className="rounded-lg border border-border/70 bg-panel p-4">
                Structured chat threads with consistent formatting.
              </div>
              <div className="rounded-lg border border-border/70 bg-panel p-4">
                Clear loading and error states for reliable feedback.
              </div>
              <div className="rounded-lg border border-border/70 bg-panel p-4">
                Deterministic routing for project context questions.
              </div>
            </div>
          </CardContent>
        </Card>

        <ChatWindow />
      </main>
    </div>
  );
}