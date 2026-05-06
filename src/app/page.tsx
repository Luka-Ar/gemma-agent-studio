import ChatWindow from "@/components/chat/chat-window";
import ThemeToggle from "@/components/theme/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const provider = process.env.GEMMA_PROVIDER ?? "mock";
  const model = process.env.GEMMA_MODEL ?? "Not set";
  const providerLabel = provider === "ollama" ? "Ollama" : "Mock";
  const statusLabel = provider === "ollama" ? "Local Ready" : "Mock Mode";

  const navItems = [
    { label: "Chat", active: true },
    { label: "Tools", disabled: true },
    { label: "Memory", disabled: true },
    { label: "Workspaces", disabled: true },
    { label: "Settings", disabled: true },
  ];

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 px-6 py-8 lg:flex-row">
        <aside className="flex flex-col gap-6 rounded-2xl border border-border/70 bg-panel/70 p-5 backdrop-blur lg:w-64">
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
              Workspace
            </div>
            <div className="text-lg font-semibold text-app-foreground">
              Gemma Agent Studio
            </div>
            <p className="text-xs text-muted-foreground">
              Premium agentic tooling for developers.
            </p>
          </div>

          <Separator className="bg-border/70" />

          <nav className="space-y-2">
            {navItems.map((item) => (
              <div
                key={item.label}
                className={`flex items-center justify-between rounded-xl border px-3 py-2 text-sm transition ${
                  item.active
                    ? "border-primary/40 bg-primary/10 text-app-foreground"
                    : "border-border/70 text-muted-foreground"
                } ${item.disabled ? "opacity-60" : "hover:border-primary/30"}`}
              >
                <span className="font-medium">{item.label}</span>
                {item.disabled ? (
                  <Badge variant="outline" className="text-[10px] uppercase tracking-[0.18em]">
                    Soon
                  </Badge>
                ) : null}
              </div>
            ))}
          </nav>

          <Separator className="bg-border/70" />

          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Provider Status
            </div>
            <div className="rounded-xl border border-border/70 bg-panel-muted px-3 py-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Provider</span>
                <span className="text-app-foreground">{providerLabel}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>Model</span>
                <span className="text-app-foreground">{model}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>Phase</span>
                <span className="text-app-foreground">Phase 4</span>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <header className="rounded-2xl border border-border/70 bg-panel/70 px-6 py-6 backdrop-blur">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Agentic AI Workspace
                </div>
                <h1 className="text-3xl font-semibold text-app-foreground sm:text-4xl">
                  Build and test local agentic workflows
                </h1>
                <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                  A Gemma-powered developer workspace with model providers, structured routing, and internal tools.
                </p>
              </div>
              <div className="flex flex-col items-end gap-3">
                <ThemeToggle className="min-w-[144px]" />
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="uppercase tracking-[0.2em]">
                    {statusLabel}
                  </Badge>
                  <Badge variant="outline" className="uppercase tracking-[0.2em]">
                    Phase 4
                  </Badge>
                </div>
              </div>
            </div>
          </header>

          <ChatWindow />
        </div>

        <aside className="hidden w-72 flex-col gap-6 xl:flex">
          <Card className="border-border/70 bg-panel/70">
            <CardHeader>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Context Panel
                </span>
                <Badge variant="outline" className="uppercase tracking-[0.18em]">
                  Live
                </Badge>
              </div>
              <CardDescription>
                Track the local tooling, routing, and runtime state while you iterate.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="rounded-xl border border-border/70 bg-panel-muted px-3 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Structured routing</span>
                  <span className="text-app-foreground">Enabled</span>
                </div>
              </div>
              <div className="rounded-xl border border-border/70 bg-panel-muted px-3 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Local tools</span>
                  <span className="text-app-foreground">Ready</span>
                </div>
              </div>
              <div className="rounded-xl border border-border/70 bg-panel-muted px-3 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Memory</span>
                  <span className="text-app-foreground">Foundation</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-panel/70">
            <CardHeader>
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Workspace Notes
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Run local workflows, validate tool calls, and keep transcripts organized.</p>
              <Separator className="bg-border/70" />
              <p>Use the prompt cards to explore internal tools without extra setup.</p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}