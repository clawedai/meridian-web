import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-accent-primary/20 text-accent-primary",
        secondary: "bg-background-tertiary text-foreground-secondary",
        success: "bg-success/20 text-success",
        warning: "bg-warning/20 text-warning",
        error: "bg-error/20 text-error",
        outline: "border border-foreground-muted text-foreground-secondary",
        critical: "bg-priority-critical/20 text-priority-critical",
        high: "bg-priority-high/20 text-priority-high",
        medium: "bg-priority-medium/20 text-priority-medium",
        low: "bg-priority-low/20 text-priority-low",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
