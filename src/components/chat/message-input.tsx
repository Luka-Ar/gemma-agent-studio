"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type MessageInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  canSend?: boolean;
};

export default function MessageInput({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  canSend = false,
}: MessageInputProps) {
  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Prompt
      </label>
      <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-panel px-4 py-4">
        <Textarea
          className="min-h-[110px] bg-transparent text-sm leading-relaxed"
          placeholder="Describe what you want to build with Gemma."
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              if (!isLoading && canSend) {
                onSubmit();
              }
            }
          }}
          disabled={isLoading}
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            Local tools and structured routing are enabled.
          </p>
          <Button
            type="submit"
            disabled={isLoading || !canSend}
            className="uppercase"
          >
            Send
          </Button>
        </div>
      </div>
    </form>
  );
}