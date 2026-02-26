import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
    type: 'invalid-repo' | 'backend-failure' | 'timeout' | 'network' | 'generic';
    message?: string;
    onRetry?: () => void;
}

const ERROR_COPY = {
    'invalid-repo': {
        title: 'Repository Not Found',
        description:
            'The GitHub repository you entered does not exist or is private. Please check the URL and try again.',
        icon: '🔍',
    },
    'backend-failure': {
        title: 'Analysis Failed',
        description:
            'The analysis service encountered an error. Please try again in a moment.',
        icon: '⚠️',
    },
    timeout: {
        title: 'Analysis Timed Out',
        description:
            'The analysis took too long to complete. This may happen with very large repositories.',
        icon: '⏱️',
    },
    network: {
        title: 'Network Error',
        description:
            'Could not reach the analysis server. Please check your connection and try again.',
        icon: '🌐',
    },
    generic: {
        title: 'Something Went Wrong',
        description: 'An unexpected error occurred. Please try again.',
        icon: '💥',
    },
} as const;

export function ErrorState({ type, message, onRetry }: ErrorStateProps) {
    const copy = ERROR_COPY[type];

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-6 text-center">
            {/* Icon */}
            <div className="w-20 h-20 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center text-4xl">
                {copy.icon}
            </div>

            {/* Text */}
            <div className="space-y-2 max-w-md">
                <div className="flex items-center justify-center gap-2 text-destructive">
                    <AlertTriangle className="w-5 h-5" />
                    <h2 className="text-xl font-bold">{copy.title}</h2>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                    {message ?? copy.description}
                </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
                {/* Back to Home — styled as outline button via Tailwind, using React Router Link */}
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 h-10 px-5 py-2 text-sm font-medium rounded-lg border border-border bg-transparent hover:bg-secondary hover:text-foreground transition-all duration-200"
                >
                    <Home className="w-4 h-4" />
                    Back to Home
                </Link>
                {onRetry && (
                    <Button onClick={onRetry} variant="default" className="gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                    </Button>
                )}
            </div>
        </div>
    );
}
