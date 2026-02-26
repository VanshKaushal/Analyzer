import * as React from 'react';
import { cn } from '@/utils';

export function Badge({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
    return (
        <span
            className={cn(
                'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors',
                className,
            )}
            {...props}
        >
            {children}
        </span>
    );
}
