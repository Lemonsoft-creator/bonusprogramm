'use client';
import * as React from 'react';
import { cn } from '../utils';

type DialogContext = {
  open: boolean;
  setOpen: (v: boolean) => void;
};
const DialogCtx = React.createContext<DialogContext | null>(null);

type DialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
};

/** Dialog-Root: funktioniert kontrolliert (open/onOpenChange) oder unkontrolliert */
export function Dialog({ open, onOpenChange, children }: DialogProps) {
  const [internal, setInternal] = React.useState(false);
  const isControlled = open !== undefined;
  const value = isControlled ? !!open : internal;
  const setOpen = (v: boolean) => {
    if (isControlled) onOpenChange?.(v);
    else setInternal(v);
  };
  return (
    <DialogCtx.Provider value={{ open: value, setOpen }}>
      {children}
    </DialogCtx.Provider>
  );
}

type TriggerProps = {
  asChild?: boolean;
  children: React.ReactElement | React.ReactNode;
};
export function DialogTrigger({ asChild, children }: TriggerProps) {
  const ctx = React.useContext(DialogCtx);
  if (!ctx) return null;
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: (e: any) => {
        children.props?.onClick?.(e);
        ctx.setOpen(true);
      },
    });
  }
  return (
    <button type="button" onClick={() => ctx.setOpen(true)}>
      {children}
    </button>
  );
}

export function DialogContent({ children, className }: { children: React.ReactNode; className?: string }) {
  const ctx = React.useContext(DialogCtx);
  if (!ctx || !ctx.open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={() => ctx.setOpen(false)} />
      <div className={cn('relative z-10 w-full max-w-md rounded-xl bg-white p-4 shadow-lg', className)}>
        {children}
      </div>
    </div>
  );
}

export function DialogHeader(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-2', props.className)} {...props} />;
}
export function DialogTitle(props: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-lg font-semibold', props.className)} {...props} />;
}
export function DialogDescription(props: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-slate-500', props.className)} {...props} />;
}

// Optionaler Default-Export (wird nirgends verwendet, aber schadet nicht)
export default Dialog;
