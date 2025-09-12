import * as React from 'react';
import { cn } from '../utils';
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn('w-full h-10 px-3 border rounded-md outline-none focus:ring-2 focus:ring-green-300', className)} {...props} />
  )
);
Input.displayName = 'Input';
