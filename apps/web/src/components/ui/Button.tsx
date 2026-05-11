import { cn } from "@/lib/cn";
import { forwardRef, type ButtonHTMLAttributes } from "react";

const variants = {
  primary:
    "bg-primary text-primary-foreground hover:opacity-95 shadow-sm disabled:opacity-50",
  secondary:
    "bg-card text-foreground border border-border hover:bg-accent disabled:opacity-50",
  ghost: "text-foreground hover:bg-accent disabled:opacity-50",
  danger: "bg-danger text-white hover:opacity-95 disabled:opacity-50",
  outline: "border border-border bg-transparent hover:bg-accent",
} as const;

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        variants[variant],
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = "Button";
