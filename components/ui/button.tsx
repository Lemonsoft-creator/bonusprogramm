import * as React from 'react';
import { cn } from '../utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant='default', size='md', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-colors rounded-md',
        size === 'sm' ? 'h-8 px-3 text-sm' : size === 'lg' ? 'h-11 px-5' : 'h-10 px-4',
        variant === 'outline' ? 'border border-slate-300 bg-white hover:bg-slate-50' : 'bg-slate-900 text-white hover:bg-slate-800',
        className
      )}
      {...props}
    />
  )
);
Button.displayName = 'Button';
