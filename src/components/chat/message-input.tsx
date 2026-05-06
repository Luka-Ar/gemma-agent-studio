"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type MessageInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
};

export default function MessageInput({
  value,
  onChange,
  onSubmit,
  disabled = false,
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
        Message
      </label>
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-panel px-4 py-4">
        <Textarea
          className="min-h-[110px] bg-panel text-sm"
          placeholder="Describe what you want to build with Gemma."
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            {disabled
              ? "Waiting for response"
              : "Press send to submit your prompt"}
          </p>
          <Button type="submit" disabled={disabled} className="uppercase">
            Send
          </Button>
        </div>
      </div>
    </form>
  );
}