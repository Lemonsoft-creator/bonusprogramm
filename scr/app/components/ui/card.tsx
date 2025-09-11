import * as React from "react";

export function Card({ className = "", ...p }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`bg-white border border-slate-200 shadow-sm ${className}`} {...p} />;
}
export function CardHeader({ className = "", ...p }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`p-4 ${className}`} {...p} />;
}
export function CardTitle({ className = "", ...p }: React.HTMLAttributes<HTMLDivElement>) {
  return <h3 className={`text-lg font-semibold ${className}`} {...p} />;
}
export function CardDescription({ className = "", ...p }: React.HTMLAttributes<HTMLDivElement>) {
  return <p className={`text-sm text-slate-500 ${className}`} {...p} />;
}
export function CardContent({ className = "", ...p }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`p-4 ${className}`} {...p} />;
}