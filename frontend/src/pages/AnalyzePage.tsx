import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAnalyze } from '@/hooks/useAnalyze';
import { LoadingUI } from '@/components/LoadingUI';
import { ErrorState } from '@/components/ErrorState';
import { DashboardLayout } from '@/layouts/DashboardLayout';

export function AnalyzePage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const repo = searchParams.get('repo');

    // Redirect to home if no repo param
    if (!repo) {
        navigate('/');
        return null;
    }

    return <AnalyzeWithBackend repo={repo} />;
}

function AnalyzeWithBackend({ repo }: { readonly repo: string }) {
    const navigate = useNavigate();
    const state = useAnalyze(repo);

    const handleRetry = () => {
        navigate(0); // Reload current route to restart analysis
    };

    // Idle or starting — show loading
    if (state.phase === 'idle' || state.phase === 'starting') {
        return <LoadingUI />;
    }

    // Error states — map message to error type
    if (state.phase === 'error') {
        const msg = state.message.toLowerCase();
        const type = msg.includes('timed out')
            ? 'timeout'
            : msg.includes('not found') || msg.includes('404') || msg.includes('does not exist')
                ? 'invalid-repo'
                : msg.includes('network') || msg.includes('econnrefused') || msg.includes('fetch')
                    ? 'network'
                    : 'backend-failure';

        return (
            <ErrorState
                type={type}
                message={state.message}
                onRetry={handleRetry}
            />
        );
    }

    // Completed — but data is null (edge case)
    if (!state.result) {
        return (
            <ErrorState
                type="backend-failure"
                message="Analysis completed but no data was returned."
                onRetry={handleRetry}
            />
        );
    }

    // Dashboard
    return <DashboardLayout result={state.result} />;
}
