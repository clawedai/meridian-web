import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-sm text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-accent-primary text-accent-foreground hover:brightness-110 active:brightness-95 active:scale-[0.98]",
        destructive:
          "bg-error text-white hover:bg-error/90 active:scale-[0.98]",
        outline:
          "border border-foreground-muted bg-transparent text-foreground-secondary hover:border-accent-primary hover:text-foreground",
        secondary:
          "bg-background-tertiary text-foreground-secondary hover:bg-background-tertiary/80 hover:text-foreground",
        ghost:
          "bg-transparent text-foreground-secondary hover:bg-background-tertiary hover:text-foreground",
        link:
          "text-accent-primary underline-offset-4 hover:underline",
        success:
          "bg-success text-white hover:bg-success/90 active:scale-[0.98]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-sm px-3",
        lg: "h-11 rounded-sm px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
