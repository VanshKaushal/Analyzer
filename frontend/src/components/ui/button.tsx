import * as React from 'react';
import { cn } from '@/utils';

export const Button = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & {
        variant?: 'default' | 'outline' | 'ghost' | 'destructive';
        size?: 'default' | 'sm' | 'lg' | 'icon';
    }
>(({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const base =
        'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 select-none';

    const variants = {
        default:
            'bg-primary text-primary-foreground hover:bg-primary/90 glow-blue shadow-lg',
        outline:
            'border border-border bg-transparent hover:bg-secondary hover:text-foreground',
        ghost: 'hover:bg-secondary hover:text-foreground',
        destructive:
            'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    };

    const sizes = {
        default: 'h-10 px-5 py-2 text-sm',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-8 text-base',
        icon: 'h-9 w-9',
    };

    return (
        <button
            ref={ref}
            className={cn(base, variants[variant], sizes[size], className)}
            {...props}
        />
    );
});
Button.displayName = 'Button';
