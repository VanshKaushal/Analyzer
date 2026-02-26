import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Github, Search, Sparkles, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { parseGitHubRepo } from '@/utils';

const DEMO_REPOS = [
    'facebook/react',
    'microsoft/vscode',
    'vercel/next.js',
    'tailwindlabs/tailwindcss',
];

export function LandingPage() {
    const navigate = useNavigate();
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (value: string = url) => {
        const repo = parseGitHubRepo(value);
        if (!repo) {
            setError(
                'Please enter a valid GitHub URL (e.g., https://github.com/owner/repo or owner/repo)',
            );
            return;
        }
        setError('');
        navigate(`/analyze?repo=${encodeURIComponent(repo)}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSubmit();
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
            {/* Background ambient glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-2/3 left-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 w-full max-w-2xl space-y-10">

                {/* Logo + Title */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-2 glow-blue">
                        <Github className="w-8 h-8 text-primary" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2">
                            <Sparkles className="w-5 h-5 text-yellow-400" />
                            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                AI-Powered Analysis
                            </span>
                            <Sparkles className="w-5 h-5 text-yellow-400" />
                        </div>
                        <h1 className="text-5xl font-extrabold tracking-tight gradient-text">
                            GitHub Repo Analyzer
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
                            Instantly understand any GitHub repository — tech stack, complexity,
                            architecture, and metrics in seconds.
                        </p>
                    </div>
                </div>

                {/* Input card */}
                <div className="glass rounded-2xl p-6 space-y-4 shadow-2xl">
                    <div className="space-y-2">
                        <label htmlFor="repo-input" className="text-sm font-medium text-foreground/80">
                            GitHub Repository URL
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                            <Input
                                id="repo-input"
                                placeholder="Paste GitHub Repository URL..."
                                value={url}
                                onChange={(e) => {
                                    setUrl(e.target.value);
                                    if (error) setError('');
                                }}
                                onKeyDown={handleKeyDown}
                                className="pl-10"
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
                        className="w-full gap-2 h-11"
                        onClick={() => handleSubmit()}
                        disabled={!url.trim()}
                    >
                        Analyze Repository
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </div>

                {/* Demo repos */}
                <div className="space-y-3">
                    <p className="text-center text-xs text-muted-foreground uppercase tracking-wider font-medium">
                        Try an example
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                        {DEMO_REPOS.map((repo) => (
                            <button
                                key={repo}
                                type="button"
                                id={`demo-${repo.replace('/', '-')}`}
                                onClick={() => handleSubmit(repo)}
                                className="flex items-center gap-2.5 glass rounded-xl px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all duration-200 group"
                            >
                                <Github className="w-4 h-4 shrink-0 text-primary/60 group-hover:text-primary transition-colors" />
                                <span className="truncate">{repo}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
