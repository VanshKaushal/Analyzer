import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Github, Search, Sparkles, ArrowRight, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { parseGitHubRepo, cn } from '@/utils';


const DEMO_REPOS = [
    'facebook/react',
    'microsoft/vscode',
    'vercel/next.js',
    'tailwindlabs/tailwindcss',
];

const DEMO_USERS = [
    'octocat',
    'gaearon',
    'torvalds',
    'yyx990803',
];

type AnalysisMode = 'repo' | 'profile';

export function LandingPage() {
    const navigate = useNavigate();
    const [mode, setMode] = useState<AnalysisMode>('repo');
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (value: string = url) => {
        const trimmed = value.trim();
        if (!trimmed) return;

        if (mode === 'repo') {
            const repo = parseGitHubRepo(trimmed);
            if (!repo) {
                setError(
                    'Please enter a valid GitHub URL (e.g., https://github.com/owner/repo or owner/repo)',
                );
                return;
            }
            setError('');
            navigate(`/analyze?repo=${encodeURIComponent(repo)}`);
        } else {
            // Simple username check
            if (!/^[a-zA-Z0-9-]{1,39}$/.test(trimmed)) {
                setError('Please enter a valid GitHub username (alphanumeric and hyphens only)');
                return;
            }
            setError('');
            navigate(`/analyze?username=${encodeURIComponent(trimmed)}`);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSubmit();
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden bg-[#090a0f] text-slate-100">
            {/* Background ambient glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-2/3 left-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-violet-500/5 rounded-full blur-[90px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-2xl space-y-10">

                {/* Logo + Title */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-2 glow-blue">
                        <Github className="w-8 h-8 text-primary" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2">
                            <Sparkles className="w-4 h-4 text-yellow-400" />
                            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                AI-Powered Intelligence
                            </span>
                            <Sparkles className="w-4 h-4 text-yellow-400" />
                        </div>
                        <h1 className="text-5xl font-extrabold tracking-tight gradient-text">
                            SmartCode GitHub Analyzer
                        </h1>
                        <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
                            Instantly analyze codebases for complexity and reviews, or evaluate entire developer profiles for global footprint diagnostics.
                        </p>
                    </div>
                </div>

                {/* Unified Tab Switcher & Input Card */}
                <div className="glass rounded-2xl p-6 space-y-5 shadow-2xl border border-border/10 bg-[#11121d]/40">
                    
                    {/* Premium Sliding Selector */}
                    <div className="flex bg-[#0d0e16] p-1 rounded-xl border border-border/10 relative">
                        <button
                            type="button"
                            onClick={() => {
                                setMode('repo');
                                setUrl('');
                                setError('');
                            }}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all duration-200 z-10",
                                mode === 'repo' 
                                    ? "bg-primary text-primary-foreground shadow-md font-extrabold" 
                                    : "text-muted-foreground hover:text-slate-100"
                            )}
                        >
                            <Github className="w-3.5 h-3.5" />
                            Repository Scanner
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setMode('profile');
                                setUrl('');
                                setError('');
                            }}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all duration-200 z-10",
                                mode === 'profile' 
                                    ? "bg-primary text-primary-foreground shadow-md font-extrabold" 
                                    : "text-muted-foreground hover:text-slate-100"
                            )}
                        >
                            <User className="w-3.5 h-3.5" />
                            Developer Footprint
                        </button>
                    </div>

                    {/* Input Field */}
                    <div className="space-y-2">
                        <label htmlFor="repo-input" className="text-xs font-semibold text-slate-300">
                            {mode === 'repo' ? 'GitHub Repository URL or owner/repo' : 'GitHub Username'}
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                            <Input
                                id="repo-input"
                                placeholder={
                                    mode === 'repo' 
                                        ? "Paste GitHub Repository URL (e.g. facebook/react)..." 
                                        : "Enter GitHub Username (e.g. octocat)..."
                                }
                                value={url}
                                onChange={(e) => {
                                    setUrl(e.target.value);
                                    if (error) setError('');
                                }}
                                onKeyDown={handleKeyDown}
                                className="pl-10 bg-[#090a0f] border-border/10 text-slate-100 focus:border-primary/50 text-sm h-11"
                                autoFocus
                            />
                        </div>
                        {error && (
                            <p className="text-xs text-destructive flex items-center gap-1.5" role="alert">
                                <span aria-hidden>⚠</span> {error}
                            </p>
                        )}
                    </div>

                    <Button
                        id="analyze-button"
                        className="w-full gap-2 h-11 text-xs font-bold transition-all"
                        onClick={() => handleSubmit()}
                        disabled={!url.trim()}
                    >
                        {mode === 'repo' ? 'Analyze Repository' : 'Analyze Footprint'}
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                </div>

                {/* Example Options */}
                <div className="space-y-3">
                    <p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest font-extrabold">
                        Try an example {mode === 'repo' ? 'repository' : 'developer'}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                        {(mode === 'repo' ? DEMO_REPOS : DEMO_USERS).map((item) => (
                            <button
                                key={item}
                                type="button"
                                id={`demo-${item.replace('/', '-')}`}
                                onClick={() => handleSubmit(item)}
                                className="flex items-center gap-2.5 glass-card rounded-xl px-4 py-3 text-xs font-medium text-muted-foreground hover:text-slate-100 hover:border-primary/20 transition-all duration-200 group bg-[#11121d]/20 border border-border/5"
                            >
                                {mode === 'repo' ? (
                                    <Github className="w-3.5 h-3.5 shrink-0 text-primary/60 group-hover:text-primary transition-colors" />
                                ) : (
                                    <User className="w-3.5 h-3.5 shrink-0 text-primary/60 group-hover:text-primary transition-colors" />
                                )}
                                <span className="truncate">{item}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

