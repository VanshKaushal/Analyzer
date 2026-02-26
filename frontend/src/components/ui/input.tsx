import * as React from 'react';
import { cn } from '@/utils';

export const Input = React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
    <input
        ref={ref}
        className={cn(
            'flex h-11 w-full rounded-lg border border-border bg-input px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary/50',
            'disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
            className,
        )}
        {...props}
    />
));
Input.displayName = 'Input';
