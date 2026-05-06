"use client";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ChatMessage } from "@/lib/agent/types";
import { cn } from "@/lib/utils";

type MessageListProps = {
  messages: ChatMessage[];
  isLoading?: boolean;
};

export default function MessageList({
  messages,
  isLoading = false,
}: MessageListProps) {
  return (
    <ScrollArea className="h-[420px] rounded-xl border border-border bg-panel-muted">
      <div className="flex flex-col gap-4 p-4">
        {messages.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-panel px-4 py-8 text-center text-sm text-muted-foreground">
            Start the conversation to see responses here.
          </div>
        ) : null}

        {messages.map((message, index) => {
          const isUser = message.role === "user";
          return (
            <div
              key={`${message.role}-${index}`}
              className={cn(
                "flex",
                isUser ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[82%] space-y-2 rounded-2xl border border-border/70 px-4 py-3 text-sm leading-relaxed shadow-sm",
                  isUser
                    ? "bg-app-foreground text-panel"
                    : "bg-panel text-app-foreground"
                )}
              >
                <Badge variant={isUser ? "secondary" : "outline"}>
                  {isUser ? "User" : "Assistant"}
                </Badge>
                <p className="whitespace-pre-wrap text-sm">
                  {message.content}
                </p>
              </div>
            </div>
          );
        })}

        {isLoading ? (
          <div className="flex justify-start">
            <div className="max-w-[70%] rounded-2xl border border-border/70 bg-panel px-4 py-3 text-sm text-muted-foreground shadow-sm">
              Assistant is drafting a response...
            </div>
          </div>
        ) : null}
      </div>
    </ScrollArea>
  );
}