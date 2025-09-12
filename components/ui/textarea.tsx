import * as React from 'react';
import { cn } from '../utils';
export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn('w-full min-h-[90px] p-3 border rounded-md outline-none focus:ring-2 focus:ring-green-300', className)} {...props} />
  )
);
Textarea.displayName = 'Textarea';
