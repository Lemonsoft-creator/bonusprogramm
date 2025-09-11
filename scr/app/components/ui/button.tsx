import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: "default" | "outline";
  size?: "sm" | "md";
  className?: string;
};

export const Button = React.forwardRef<HTMLButtonElement, Props>(
  ({ asChild, variant = "default", size = "md", className = "", ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const base = "inline-flex items-center justify-center gap-1 px-3 py-2 font-medium rounded-md transition border";
    const v = variant === "outline" ? "bg-white border-slate-300 text-slate-700 hover:bg-slate-50" : "bg-green-500 text-white border-green-500 hover:bg-green-600";
    const s = size === "sm" ? "text-sm px-2 py-1" : "";
    return <Comp ref={ref as any} className={`${base} ${v} ${s} ${className}`} {...props} />;
  }
);
Button.displayName = "Button";