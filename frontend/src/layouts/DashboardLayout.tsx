import { Github, ExternalLink, Menu, X, GripVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useRef, useCallback, useEffect } from 'react';
import { FileTree } from '@/components/FileTree';
import { InsightsPanel } from '@/components/InsightsPanel';
import { MetricsPanel } from '@/components/MetricsPanel';
import { cn } from '@/utils';
import type { AnalysisResult } from '@/types';

interface DashboardLayoutProps {
    result: AnalysisResult;
}

// ── Resize constraints (px) ───────────────────────────────────────────────────
const SIDEBAR_MIN = 160;
const SIDEBAR_MAX = 480;
const METRICS_MIN = 220;
const METRICS_MAX = 520;

// ── Resize handle between two panels ─────────────────────────────────────────
interface ResizeHandleProps {
    onMouseDown: (e: React.MouseEvent) => void;
    'aria-label': string;
}

function ResizeHandle({ onMouseDown, 'aria-label': ariaLabel }: ResizeHandleProps) {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            role="separator"
            aria-label={ariaLabel}
            aria-orientation="vertical"
            tabIndex={0}
            onMouseDown={onMouseDown}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={cn(
                'hidden lg:flex items-center justify-center w-1.5 shrink-0 cursor-col-resize',
                'bg-border/40 hover:bg-primary/60 active:bg-primary transition-colors duration-150',
                'group relative z-10 select-none',
            )}
            style={{ touchAction: 'none' }}
        >
            {/* Wider invisible hit-area */}
            <div className="absolute inset-y-0 -left-1.5 -right-1.5" />
            {/* Grip dots */}
            <GripVertical
                className={cn(
                    'w-3 h-3 pointer-events-none transition-opacity duration-150',
                    hovered ? 'opacity-80 text-primary' : 'opacity-20 text-muted-foreground',
                )}
            />
        </div>
    );
}

// ── Main layout ───────────────────────────────────────────────────────────────
export function DashboardLayout({ result }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Controlled widths (desktop only — mobile falls back to flex stacking)
    const [sidebarWidth, setSidebarWidth] = useState(256);   // Zone A default: 256px
    const [metricsWidth, setMetricsWidth] = useState(320);   // Zone C default: 320px

    // Track which handle is being dragged and the drag origin
    const dragRef = useRef<{
        handle: 'left' | 'right';
        startX: number;
        startWidth: number;
    } | null>(null);

    const onMouseMoveGlobal = useCallback((e: MouseEvent) => {
        if (!dragRef.current) return;
        const { handle, startX, startWidth } = dragRef.current;
        const delta = e.clientX - startX;

        if (handle === 'left') {
            // Dragging the handle between Zone A and Zone B
            const next = Math.min(SIDEBAR_MAX, Math.max(SIDEBAR_MIN, startWidth + delta));
            setSidebarWidth(next);
        } else {
            // Dragging the handle between Zone B and Zone C
            // Moving right makes metrics narrower → subtract delta
            const next = Math.min(METRICS_MAX, Math.max(METRICS_MIN, startWidth - delta));
            setMetricsWidth(next);
        }
    }, []);

    const onMouseUpGlobal = useCallback(() => {
        dragRef.current = null;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
    }, []);

    useEffect(() => {
        document.addEventListener('mousemove', onMouseMoveGlobal);
        document.addEventListener('mouseup', onMouseUpGlobal);
        return () => {
            document.removeEventListener('mousemove', onMouseMoveGlobal);
            document.removeEventListener('mouseup', onMouseUpGlobal);
        };
    }, [onMouseMoveGlobal, onMouseUpGlobal]);

    const startDrag = useCallback(
        (handle: 'left' | 'right') => (e: React.MouseEvent) => {
            e.preventDefault();
            dragRef.current = {
                handle,
                startX: e.clientX,
                startWidth: handle === 'left' ? sidebarWidth : metricsWidth,
            };
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
        },
        [sidebarWidth, metricsWidth],
    );

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background">

            {/* ── Top Bar ────────────────────────────────────────────────── */}
            <header className="flex items-center justify-between px-4 py-3 border-b border-border/60 glass shrink-0 z-10">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setSidebarOpen((o) => !o)}
                        className="p-1.5 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                        aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
                    >
                        {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                    </button>
                    <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <Github className="w-5 h-5 text-primary" />
                        <span className="font-bold text-sm gradient-text hidden sm:block">
                            GitHub Repo Analyzer
                        </span>
                    </Link>
                </div>
                <a
                    href={`https://github.com/${result.projectOwner}/${result.projectName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                    <span>{result.projectOwner}/{result.projectName}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                </a>
            </header>

            {/* ── Three-Zone Layout ───────────────────────────────────────── */}
            <div className="flex flex-1 min-h-0 flex-col lg:flex-row overflow-hidden">

                {/* ─── Zone A — Sidebar File Tree (desktop) ─────────────── */}
                <aside
                    className="hidden lg:block shrink-0 border-r-0 overflow-hidden transition-all duration-200"
                    style={{
                        width: sidebarOpen ? sidebarWidth : 0,
                        minWidth: sidebarOpen ? SIDEBAR_MIN : 0,
                    }}
                >
                    <div className="h-full flex flex-col" style={{ width: sidebarWidth }}>
                        <div className="px-4 py-3 border-b border-border/40">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                File Structure
                            </p>
                        </div>
                        <div className="flex-1 overflow-y-auto py-2">
                            <FileTree nodes={result.fileTree} />
                        </div>
                    </div>
                </aside>

                {/* ─── Resize handle: A ↔ B ─────────────────────────────── */}
                {sidebarOpen && (
                    <ResizeHandle
                        onMouseDown={startDrag('left')}
                        aria-label="Resize file tree panel"
                    />
                )}

                {/* ─── Mobile sidebar (drawer-style) ────────────────────── */}
                {sidebarOpen && (
                    <aside className="lg:hidden shrink-0 border-b border-border/60 max-h-48 overflow-y-auto">
                        <div className="px-4 py-2 border-b border-border/40">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                File Structure
                            </p>
                        </div>
                        <div className="py-1">
                            <FileTree nodes={result.fileTree} />
                        </div>
                    </aside>
                )}

                {/* ─── Zone B — Main Insights ────────────────────────────── */}
                <main className="flex-1 min-w-0 overflow-y-auto">
                    <InsightsPanel result={result} />
                </main>

                {/* ─── Resize handle: B ↔ C ─────────────────────────────── */}
                <ResizeHandle
                    onMouseDown={startDrag('right')}
                    aria-label="Resize metrics panel"
                />

                {/* ─── Zone C — Metrics Panel ────────────────────────────── */}
                <aside
                    className="w-full border-t border-border/60 lg:border-t-0 overflow-y-auto shrink-0"
                    style={{ width: metricsWidth }}
                >
                    <MetricsPanel result={result} />
                </aside>

            </div>
        </div>
    );
}
