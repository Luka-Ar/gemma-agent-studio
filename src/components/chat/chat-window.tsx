"use client";

import { useCallback, useState } from "react";
import MessageInput from "@/components/chat/message-input";
import MessageList from "@/components/chat/message-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { ChatMessage, ChatResponse } from "@/lib/agent/types";

const initialMessages: ChatMessage[] = [];

export default function ChatWindow() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canSend = input.trim().length > 0;

  const suggestedPrompts = [
    "What project is this?",
    "What can this app do now?",
    "Summarize this: Add an internal timeline for Phase 4 release readiness.",
    "Extract action items: Follow up on provider performance, update README, and prep demo.",
  ];

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || isLoading) {
        return;
      }

      const nextMessages: ChatMessage[] = [
        ...messages,
        { role: "user", content: trimmed },
      ];

      setMessages(nextMessages);
      setInput("");
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: nextMessages }),
        });

        if (!response.ok) {
          throw new Error("Request failed");
        }

        const data = (await response.json()) as ChatResponse;
        setMessages((current) => [...current, data.message]);
      } catch (err) {
        console.error("Chat request failed", err);
        setError("Unable to fetch a response. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages]
  );

  const handleSend = useCallback(() => {
    void sendMessage(input);
  }, [input, sendMessage]);

  const handleSuggestedPrompt = useCallback(
    (prompt: string) => {
      void sendMessage(prompt);
    },
    [sendMessage]
  );

  return (
    <Card className="relative flex min-h-[640px] flex-col border-border/70 bg-panel/80 shadow-[0_8px_40px_rgba(23,20,19,0.35)]">
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-primary/80" />
            <CardTitle className="text-base">Agent Console</CardTitle>
            <Badge variant="outline" className="uppercase tracking-[0.2em]">
              Phase 4
            </Badge>
          </div>
          <Badge variant={isLoading ? "secondary" : "outline"}>
            {isLoading ? "Thinking" : "Ready"}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Structured routing and deterministic tools are active for local workflows.
        </p>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col gap-6">
        <MessageInput
          value={input}
          onChange={setInput}
          onSubmit={handleSend}
          isLoading={isLoading}
          canSend={canSend}
        />

        {messages.length === 0 ? (
          <div className="rounded-2xl border border-border/70 bg-panel-muted/70 px-5 py-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Quick Prompts
              </div>
              <span className="text-xs text-muted-foreground">
                Click to run a focused workflow.
              </span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {suggestedPrompts.map((prompt) => (
                <Button
                  key={prompt}
                  type="button"
                  variant="outline"
                  className="h-auto items-start justify-start whitespace-normal rounded-xl border-border/70 bg-panel/70 px-4 py-3 text-left text-sm text-app-foreground hover:border-primary/40"
                  onClick={() => handleSuggestedPrompt(prompt)}
                  disabled={isLoading}
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Conversation
            </span>
            <span className="text-xs text-muted-foreground">
              {messages.length} message{messages.length === 1 ? "" : "s"}
            </span>
          </div>
          <Separator className="bg-border/70" />
          <MessageList
            messages={messages}
            isLoading={isLoading}
            showEmptyState={messages.length === 0}
            className={
              messages.length === 0
                ? "h-[240px]"
                : "h-[520px]"
            }
          />
        </div>

        {error ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}