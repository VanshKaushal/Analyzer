import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

const LOADING_MESSAGES = [
    'Analyzing repository architecture…',
    'Cloning repository metadata…',
    'Parsing file structure…',
    'Detecting tech stack…',
    'Analyzing commit history…',
    'Running complexity analysis…',
    'Generating architecture diagram…',
    'Compiling insights…',
    'Almost there…',
];

export function LoadingUI() {
    const [msgIdx, setMsgIdx] = useState(0);

    useEffect(() => {
        const id = setInterval(() => {
            setMsgIdx((i) => (i + 1) % LOADING_MESSAGES.length);
        }, 2200);
        return () => clearInterval(id);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-8 px-6">

            {/* Animated spinner */}
            <div className="relative">
                <div className="w-20 h-20 rounded-full border-2 border-primary/20 absolute inset-0" />
                <div className="w-20 h-20 rounded-full border-2 border-transparent border-t-primary animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            </div>

            {/* Status message */}
            <div className="text-center space-y-2">
                <p className="text-lg font-semibold text-foreground animate-pulse">
                    {LOADING_MESSAGES[msgIdx]}
                </p>
                <p className="text-sm text-muted-foreground">
                    This may take 15–30 seconds for large repos
                </p>
            </div>

            {/* Skeleton preview — mirrors 3-zone dashboard layout */}
            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-[220px_1fr_300px] gap-4 opacity-30 pointer-events-none">
                {/* Zone A skeleton */}
                <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-5/6" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-4/5" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                </div>
                {/* Zone B skeleton */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Skeleton className="h-7 w-40" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                    <Skeleton className="h-28 w-full rounded-xl" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/5" />
                </div>
                {/* Zone C skeleton */}
                <div className="space-y-4">
                    <Skeleton className="h-52 w-full rounded-xl" />
                    <Skeleton className="h-36 w-full rounded-xl" />
                </div>
            </div>
        </div>
    );
}
