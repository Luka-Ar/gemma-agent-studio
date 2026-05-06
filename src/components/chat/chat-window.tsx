"use client";

import { useCallback, useState } from "react";
import MessageInput from "@/components/chat/message-input";
import MessageList from "@/components/chat/message-list";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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

  const handleSend = useCallback(async () => {
    const content = input.trim();
    if (!content || isLoading) {
      return;
    }

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content },
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
  }, [input, isLoading, messages]);

  return (
    <Card className="border-border/80 bg-panel/95 shadow-sm">
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <CardTitle className="text-base">Chat Console</CardTitle>
            <Badge variant="outline" className="uppercase tracking-[0.2em]">
              Phase 3
            </Badge>
          </div>
          <Badge variant={isLoading ? "secondary" : "outline"}>
            {isLoading ? "Thinking" : "Ready"}
          </Badge>
        </div>
        <CardDescription>
          Structured agent loop enabled. Local Ollama and mock providers are
          supported.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Separator />
        <MessageList messages={messages} isLoading={isLoading} />
        {error ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <MessageInput
          value={input}
          onChange={setInput}
          onSubmit={handleSend}
          disabled={isLoading}
        />
      </CardFooter>
    </Card>
  );
}