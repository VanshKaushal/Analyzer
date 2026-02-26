import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ComplexityLabel } from '@/types';

export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

/**
 * Parses a GitHub URL and extracts "owner/repo".
 * Accepts formats:
 *   https://github.com/owner/repo
 *   https://github.com/owner/repo.git
 *   github.com/owner/repo
 *   owner/repo
 */
export function parseGitHubRepo(input: string): string | null {
    const trimmed = input.trim();
    const urlPattern =
        /^(?:https?:\/\/)?github\.com\/([a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+?)(?:\.git)?(?:\/.*)?$/;
    const urlMatch = urlPattern.exec(trimmed);
    if (urlMatch) return urlMatch[1];
    const barePattern = /^([a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+)$/;
    const bareMatch = barePattern.exec(trimmed);
    if (bareMatch) return bareMatch[1];
    return null;
}

/**
 * Maps a numeric complexity_score (0–10) to a label.
 */
export function complexityScoreToLabel(score: number): ComplexityLabel {
    if (score <= 3) return 'Low';
    if (score <= 6) return 'Medium';
    if (score <= 8) return 'High';
    return 'Very High';
}

/**
 * Returns Tailwind classes for a complexity label badge.
 */
export function complexityColor(label: ComplexityLabel): string {
    switch (label) {
        case 'Low':
            return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
        case 'Medium':
            return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
        case 'High':
            return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
        case 'Very High':
            return 'bg-red-500/20 text-red-400 border-red-500/30';
    }
}

// Curated palette for language colors (API doesn't provide them)
const LANG_COLOR_MAP: Record<string, string> = {
    JavaScript: '#f7df1e',
    TypeScript: '#3178c6',
    Python: '#3572A5',
    Rust: '#dea584',
    Go: '#00ADD8',
    Java: '#b07219',
    'C++': '#f34b7d',
    C: '#555555',
    Ruby: '#701516',
    PHP: '#4F5D95',
    Swift: '#F05138',
    Kotlin: '#A97BFF',
    HTML: '#e34c26',
    CSS: '#264de4',
    SCSS: '#c6538c',
    Shell: '#89e051',
    Markdown: '#083fa1',
    Vue: '#41b883',
    React: '#61dafb',
    Dart: '#00B4AB',
    Scala: '#c22d40',
    Haskell: '#5e5086',
    Elixir: '#6e4a7e',
    Clojure: '#db5855',
    Other: '#8b8d8f',
};

const FALLBACK_COLORS = [
    '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#f97316',
];

export function getLanguageColor(name: string, index: number): string {
    return LANG_COLOR_MAP[name] ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length];
}

// Tech stack badge colour map
export const TECH_COLORS: Record<string, string> = {
    TypeScript: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    JavaScript: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    Python: 'bg-green-500/20 text-green-300 border-green-500/30',
    Rust: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    Go: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    Java: 'bg-red-500/20 text-red-300 border-red-500/30',
    'C++': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    React: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    Vue: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    Docker: 'bg-blue-600/20 text-blue-400 border-blue-600/30',
    Kubernetes: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    GraphQL: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    Swift: 'bg-red-400/20 text-red-300 border-red-400/30',
    Kotlin: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    Ruby: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    PHP: 'bg-indigo-400/20 text-indigo-300 border-indigo-400/30',
    Jest: 'bg-green-600/20 text-green-300 border-green-600/30',
    Rollup: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    Vite: 'bg-purple-400/20 text-purple-300 border-purple-400/30',
    Next: 'bg-slate-400/20 text-slate-300 border-slate-400/30',
    Tailwind: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
};
