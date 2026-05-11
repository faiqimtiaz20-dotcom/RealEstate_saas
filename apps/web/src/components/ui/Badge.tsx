import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

const tones = {
  default: "bg-accent text-foreground border border-border",
  primary: "bg-primary/15 text-primary border border-primary/20",
  success: "bg-success/15 text-success border border-success/25",
  warning: "bg-warning/20 text-foreground border border-warning/30",
  danger: "bg-danger/15 text-danger border border-danger/25",
  muted: "bg-card text-muted border border-border",
} as const;

export function Badge({
  className,
  tone = "default",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: keyof typeof tones }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
