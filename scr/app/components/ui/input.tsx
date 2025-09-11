import * as React from "react";
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", ...p }, ref) => (
    <input ref={ref} className={`w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 ${className}`} {...p} />
  )
);
Input.displayName = "Input";