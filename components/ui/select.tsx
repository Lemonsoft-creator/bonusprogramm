'use client';
import * as React from 'react';
import { cn } from '../utils';

type SelectCtx = {
  value: string;
  setValue: (v: string) => void;
};
const Ctx = React.createContext<SelectCtx | null>(null);

// Generische Select-API: Select<T> kennt den Typ des Werts
export function Select<T extends string = string>({
  value,
  onValueChange,
  children,
}: {
  value: T;
  onValueChange: (value: T) => void;
  children: React.ReactNode;
}) {
  const setValue = (v: string) => onValueChange(v as T);
  return <Ctx.Provider value={{ value: String(value), setValue }}>{children}</Ctx.Provider>;
}

export function SelectTrigger({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('h-10 px-3 border rounded-md flex items-center justify-between bg-white', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const ctx = React.useContext(Ctx);
  return <span className="text-slate-700">{ctx?.value || placeholder || ''}</span>;
}

export function SelectContent({ children }: { children: React.ReactNode }) {
  // Vereinfachtes Dropdown: direkt rendern
  return <div className="mt-2 grid gap-1">{children}</div>;
}

export function SelectItem({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  const ctx = React.useContext(Ctx);
  if (!ctx) return null;
  const active = ctx.value === value;
  return (
    <button
      type="button"
      onClick={() => ctx.setValue(value)}
      className={cn(
        'w-full text-left px-3 py-2 rounded-md border',
        active ? 'bg-green-50 border-green-300' : 'bg-white hover:bg-slate-50 border-slate-200'
      )}
    >
      {children}
    </button>
  );
}
