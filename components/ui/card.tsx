import * as React from 'react';
import { cn } from '../utils';

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('bg-white border rounded-xl shadow-sm', className)} {...props} />;
}
export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-4', className)} {...props} />;
}
export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <h3 className={cn('text-lg font-semibold', className)} {...props} />;
}
export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <p className={cn('text-sm text-slate-500', className)} {...props} />;
}
export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-4 pt-0', className)} {...props} />;
}
