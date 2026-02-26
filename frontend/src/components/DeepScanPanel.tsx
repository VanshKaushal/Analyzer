import { useState } from 'react';
import { Sparkles, ShieldAlert, Activity, CheckCircle2, AlertTriangle, Fingerprint } from 'lucide-react';
import apiClient from '@/services/apiClient';
import { cn } from '@/utils';

interface DeepScanData {
    vibe_check: string;
    technical_debt: string;
    trust_score: number;
    security_severity: string;
    key_strength: string;
    key_weakness: string;
}

interface DeepScanPanelProps {
    repo: string;
}

export function DeepScanPanel({ repo }: DeepScanPanelProps) {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [data, setData] = useState<DeepScanData | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleRunScan = async () => {
        setStatus('loading');
        setError(null);
        try {
            const res = await apiClient.get<{ success: boolean; data: DeepScanData; error: string | null }>(
                '/analyze/deep',
                { params: { repo } }
            );
            if (res.data.success && res.data.data) {
                setData(res.data.data);
                setStatus('success');
            } else {
                throw new Error(res.data.error || 'Deep scan failed');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred during the deep scan.');
            setStatus('error');
        }
    };

    if (status === 'idle') {
        return (
            <div className="glass rounded-xl p-6 text-center space-y-4 border border-indigo-500/30 bg-indigo-500/5">
                <div className="mx-auto w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-foreground">AI Deep Scan Available</h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                        Trigger our Large Language Model to interrogate this repository's architecture and hidden technical debt.
                    </p>
                </div>
                <button
                    onClick={handleRunScan}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors shadow-lg shadow-indigo-600/20"
                >
                    <Sparkles className="w-4 h-4" />
                    Run Deep Scan
                </button>
            </div>
        );
    }

    if (status === 'loading') {
        return (
            <div className="glass rounded-xl p-8 text-center space-y-4 animate-pulse border border-indigo-500/20">
                <Sparkles className="w-8 h-8 text-indigo-400 mx-auto animate-spin-slow" />
                <p className="text-sm font-medium text-indigo-300">Scanning architecture via OpenAI...</p>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="glass rounded-xl p-6 border border-red-500/30 bg-red-500/5 text-center flex flex-col items-center">
                <AlertTriangle className="w-8 h-8 text-red-400 mb-3" />
                <p className="text-sm text-red-300 font-bold mb-2">Deep Scan Failed</p>
                <div className="w-full text-left bg-black/40 rounded-md p-3 max-h-48 overflow-y-auto mb-2 border border-red-500/20">
                    <pre className="text-xs text-red-200/80 font-mono whitespace-pre-wrap">
                        {error}
                    </pre>
                </div>
                <button
                    onClick={handleRunScan}
                    className="mt-4 px-4 py-2 text-xs font-medium bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-md transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (!data) return null;

    // Determine colors based on stats
    const debtColor =
        data.technical_debt.toLowerCase() === 'low' ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10' :
            data.technical_debt.toLowerCase() === 'medium' ? 'text-amber-400 border-amber-400/30 bg-amber-400/10' :
                'text-red-400 border-red-400/30 bg-red-400/10';

    const securityColor =
        data.security_severity.toLowerCase() === 'low' ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10' :
            data.security_severity.toLowerCase() === 'medium' ? 'text-amber-400 border-amber-400/30 bg-amber-400/10' :
                'text-red-400 border-red-400/30 bg-red-400/10';

    const trustColor =
        data.trust_score >= 80 ? 'text-emerald-400' :
            data.trust_score >= 50 ? 'text-amber-400' :
                'text-red-400';

    return (
        <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
                <Sparkles className="w-4 h-4" />
                AI Deep Insights
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Trust Calibration */}
                <div className="glass rounded-xl p-4 border border-border/50 flex flex-col items-center justify-center text-center">
                    <Fingerprint className={cn("w-6 h-6 mb-2", trustColor)} />
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Trust Calibration</span>
                    <span className={cn("text-2xl font-black", trustColor)}>{data.trust_score}<span className="text-sm opacity-60">/100</span></span>
                </div>

                {/* Tech Debt */}
                <div className={cn("rounded-xl p-4 border flex flex-col items-center justify-center text-center", debtColor)}>
                    <Activity className="w-6 h-6 mb-2 opacity-80" />
                    <span className="text-xs font-medium uppercase tracking-wider mb-1 opacity-80">Technical Debt</span>
                    <span className="text-lg font-bold capitalize">{data.technical_debt}</span>
                </div>

                {/* Security */}
                <div className={cn("rounded-xl p-4 border flex flex-col items-center justify-center text-center", securityColor)}>
                    <ShieldAlert className="w-6 h-6 mb-2 opacity-80" />
                    <span className="text-xs font-medium uppercase tracking-wider mb-1 opacity-80">Architecture Risk</span>
                    <span className="text-lg font-bold capitalize">{data.security_severity}</span>
                </div>
            </div>

            {/* Vibe Check */}
            <div className="glass rounded-xl p-5 border border-indigo-500/20 bg-indigo-500/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
                <h4 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                    Codebase Vibe Check
                </h4>
                <p className="text-sm text-foreground/80 leading-relaxed italic">
                    "{data.vibe_check}"
                </p>
            </div>

            {/* Strengths / Weaknesses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div className="glass rounded-xl p-4 border border-emerald-500/20 text-sm">
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
                        <CheckCircle2 className="w-4 h-4" /> Core Strength
                    </div>
                    <p className="text-foreground/80 mt-1">{data.key_strength}</p>
                </div>
                <div className="glass rounded-xl p-4 border border-rose-500/20 text-sm">
                    <div className="flex items-center gap-2 text-rose-400 font-semibold mb-1">
                        <AlertTriangle className="w-4 h-4" /> Core Weakness
                    </div>
                    <p className="text-foreground/80 mt-1">{data.key_weakness}</p>
                </div>
            </div>
        </div>
    );
}
