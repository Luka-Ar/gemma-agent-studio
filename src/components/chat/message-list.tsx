"use client";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ChatMessage } from "@/lib/agent/types";
import { cn } from "@/lib/utils";

type MessageListProps = {
  messages: ChatMessage[];
  isLoading?: boolean;
  showEmptyState?: boolean;
  className?: string;
};

export default function MessageList({
  messages,
  isLoading = false,
  showEmptyState = true,
  className,
}: MessageListProps) {
  return (
    <ScrollArea
      className={cn(
        "rounded-2xl border border-border/70 bg-panel-muted/80",
        className
      )}
    >
      <div className="flex flex-col gap-4 p-5">
        {messages.length === 0 && showEmptyState ? (
          <div className="rounded-2xl border border-dashed border-border/70 bg-panel px-5 py-6 text-left">
            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Conversation
              </div>
              <h3 className="text-base font-semibold text-app-foreground">
                Your responses will appear here.
              </h3>
              <p className="text-sm text-muted-foreground">
                Send a prompt to begin a new agentic session.
              </p>
            </div>
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
                  "max-w-[82%] space-y-2 rounded-2xl border px-4 py-3 text-sm leading-relaxed",
                  isUser
                    ? "border-primary/30 bg-primary/15 text-app-foreground"
                    : "border-border/70 bg-panel/90 text-app-foreground"
                )}
              >
                <div className="flex items-center gap-2">
                  <Badge variant={isUser ? "secondary" : "outline"}>
                    {isUser ? "User" : "Assistant"}
                  </Badge>
                  <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                    {isUser ? "Request" : "Response"}
                  </span>
                </div>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content}
                </p>
              </div>
            </div>
          );
        })}

        {isLoading ? (
          <div className="flex justify-start">
            <div className="max-w-[70%] rounded-2xl border border-border/70 bg-panel/80 px-4 py-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em]">
                <span className="h-2 w-2 rounded-full bg-primary/70 animate-pulse" />
                Generating response
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </ScrollArea>
  );
}