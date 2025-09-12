'use client';
import * as React from 'react';
import { cn } from '../utils';

export function Tabs({ defaultValue, children }: { defaultValue: string; children: React.ReactNode }) {
  const [value, setValue] = React.useState(defaultValue);
  return <div data-value={value} className="w-full">{React.Children.map(children, (c:any)=> React.cloneElement(c, { value, setValue }))}</div>;
}
export function TabsList({ children, value, setValue }: any) {
  return <div className="inline-flex rounded-lg border p-1 bg-slate-50">{React.Children.map(children, (c:any)=> React.cloneElement(c, { value, setValue }))}</div>;
}
export function TabsTrigger({ value: v, setValue, children, value }: any) {
  const active = v === value;
  return <button onClick={()=>setValue(value)} className={cn('px-3 py-1 rounded-md text-sm', active ? 'bg-white shadow' : 'text-slate-600')}>{children}</button>;
}
export function TabsContent({ children, value: v, value }: any) {
  if (v !== value) return null;
  return <div>{children}</div>;
}
