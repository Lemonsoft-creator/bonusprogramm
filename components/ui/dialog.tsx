'use client';
import * as React from 'react';
import { cn } from '../utils';

export function Dialog({ children }: { children: React.ReactNode }) { return <div>{children}</div>; }
export function DialogTrigger({ asChild, children }: any) {
  const ctx = React.useContext(DialogCtx);
  if (asChild) return React.cloneElement(children, { onClick: () => ctx.setOpen(true) });
  return <button onClick={()=>ctx.setOpen(true)}>{children}</button>;
}
export function DialogContent({ children }: any) {
  const ctx = React.useContext(DialogCtx);
  if (!ctx.open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={()=>ctx.setOpen(false)} />
      <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-4 shadow-lg">{children}</div>
    </div>
  );
}
export function DialogHeader(props: React.HTMLAttributes<HTMLDivElement>) { return <div className={cn('mb-2', props.className)} {...props}/>; }
export function DialogTitle(props: React.HTMLAttributes<HTMLHeadingElement>) { return <h3 className={cn('text-lg font-semibold', props.className)} {...props}/>; }
export function DialogDescription(props: React.HTMLAttributes<HTMLParagraphElement>) { return <p className={cn('text-sm text-slate-500', props.className)} {...props}/>; }

const DialogCtx = React.createContext<{open:boolean; setOpen:(b:boolean)=>void}>({ open: false, setOpen: ()=>{} });
export default function DialogProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  return <DialogCtx.Provider value={{open,setOpen}}>{children}</DialogCtx.Provider>;
}
