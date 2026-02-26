import { Cpu, BookOpen, ListChecks, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn, complexityColor, TECH_COLORS } from '@/utils';
import { DeepScanPanel } from './DeepScanPanel';
import type { AnalysisResult } from '@/types';

interface InsightsPanelProps {
    result: AnalysisResult;
}

export function InsightsPanel({ result }: InsightsPanelProps) {
    return (
        <div className="h-full overflow-y-auto p-6 space-y-8">

            {/* ── Project Header ─────────────────────────────────── */}
            <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
                            {result.projectOwner}
                        </p>
                        <h1 className="text-3xl font-extrabold gradient-text leading-tight">
                            {result.projectName}
                        </h1>
                        {result.projectType && (
                            <p className="text-sm text-muted-foreground mt-1 capitalize">
                                {result.projectType}
                            </p>
                        )}
                    </div>
                    <Badge
                        className={cn(
                            'shrink-0 gap-1.5 text-xs font-semibold px-2.5 py-1',
                            complexityColor(result.complexityLabel),
                        )}
                    >
                        <Cpu className="w-3 h-3" />
                        {result.complexityLabel}
                    </Badge>
                </div>

                {/* Complexity score meter */}
                <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Complexity Score</span>
                        <span className="font-semibold text-foreground">
                            {result.complexityScore} / 10
                        </span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                                width: `${result.complexityScore * 10}%`,
                                background:
                                    result.complexityScore <= 3
                                        ? 'hsl(160 60% 45%)'
                                        : result.complexityScore <= 6
                                            ? 'hsl(45 90% 55%)'
                                            : result.complexityScore <= 8
                                                ? 'hsl(25 90% 55%)'
                                                : 'hsl(0 72% 51%)',
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* ── AI Deep Scan Panel ─────────────────────────────── */}
            <DeepScanPanel repo={`${result.projectOwner}/${result.projectName}`} />

            {/* ── Tech Stack ─────────────────────────────────────── */}
            <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                    {result.techStack.map((tech) => (
                        <Badge
                            key={tech}
                            className={cn(
                                'text-xs',
                                TECH_COLORS[tech] ?? 'bg-slate-500/20 text-slate-300 border-slate-500/30',
                            )}
                        >
                            {tech}
                        </Badge>
                    ))}
                </div>
            </div>

            {/* ── One-Minute Read / Summary ──────────────────────── */}
            <div className="space-y-2">
                <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <BookOpen className="w-3.5 h-3.5" />
                    One-Minute Read
                </h3>
                <div className="glass rounded-xl p-4">
                    <p className="text-sm text-foreground/85 leading-relaxed">{result.summary}</p>
                </div>
            </div>

            {/* ── Smart Repository Preview ───────────────────────── */}
            <div className="space-y-3">
                <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <BookOpen className="w-3.5 h-3.5" />
                    Preview
                </h3>
                {result.preview.type === 'live' && result.preview.url && (
                    <div className="rounded-xl overflow-hidden border border-border/60 shadow-sm glass">
                        <div className="bg-muted/50 px-3 py-2 text-xs text-muted-foreground border-b border-border/60 flex items-center justify-between">
                            <span className="font-mono">{result.preview.url}</span>
                            <a
                                href={result.preview.url}
                                target="_blank"
                                rel="noreferrer"
                                className="hover:text-foreground transition-colors"
                            >
                                <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                        </div>
                        <iframe
                            src={result.preview.url}
                            title="Live Deployment Preview"
                            className="w-full h-[400px] border-none bg-white"
                        />
                    </div>
                )}
                {result.preview.type === 'readme' && result.preview.readme_content && (
                    <div className="rounded-xl overflow-hidden border border-border/60 shadow-sm glass">
                        <div className="bg-muted/50 px-3 py-2 text-xs text-muted-foreground border-b border-border/60">
                            <span className="font-mono">README.md</span>
                        </div>
                        <div className="p-4 overflow-y-auto max-h-[400px]">
                            <pre className="text-sm text-foreground/80 whitespace-pre-wrap font-sans">
                                {result.preview.readme_content}
                            </pre>
                        </div>
                    </div>
                )}
                {result.preview.type === 'none' && (
                    <div className="glass rounded-xl p-4 text-center">
                        <p className="text-sm text-muted-foreground">
                            No live URL or README found for this repository.
                        </p>
                    </div>
                )}
            </div>

            {/* ── Key Features ───────────────────────────────────── */}
            <div className="space-y-3">
                <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <ListChecks className="w-3.5 h-3.5" />
                    Key Features
                </h3>
                <ul className="space-y-2.5">
                    {result.keyFeatures.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm">
                            <span className="mt-0.5 w-5 h-5 rounded-md bg-primary/20 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                                {i + 1}
                            </span>
                            <span className="text-foreground/80 leading-relaxed">{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
