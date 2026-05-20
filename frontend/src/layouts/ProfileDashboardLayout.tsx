import { Link, useNavigate } from 'react-router-dom';
import { 
    Github, 
    ExternalLink, 
    Sparkles, 
    Users, 
    BookOpen, 
    Star, 
    GitFork, 
    MapPin, 
    Briefcase,
    Shield,
    TrendingUp,
    FolderGit2,
    Award
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as ChartTooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import type { ProfileAnalysisResult } from '@/types';
import { Button } from '@/components/ui/button';


interface ProfileDashboardLayoutProps {
    readonly result: ProfileAnalysisResult;
    readonly isScanningDeep: boolean;
    readonly deepScanError: string | null;
    readonly onDeepScan: () => Promise<void>;
}

export function ProfileDashboardLayout({ 
    result, 
    isScanningDeep, 
    deepScanError, 
    onDeepScan 
}: ProfileDashboardLayoutProps) {
    const navigate = useNavigate();
    const { profile, languages, commits, repositories, persona } = result;

    const handleAnalyzeRepo = (fullName: string) => {
        navigate(`/analyze?repo=${encodeURIComponent(fullName)}`);
    };

    return (
        <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col selection:bg-primary/30">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

            {/* ── Header ── */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-border/20 glass shrink-0 z-10 sticky top-0 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <Link to="/" className="flex items-center gap-2.5 hover:opacity-85 transition-opacity">
                        <div className="bg-primary/10 p-1.5 rounded-lg border border-primary/20">
                            <Github className="w-5 h-5 text-primary" />
                        </div>
                        <span className="font-extrabold text-base tracking-tight gradient-text">
                            GitHub Profile Analyzer
                        </span>
                    </Link>
                </div>
                <a
                    href={profile.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors border border-border/20 px-3 py-1.5 rounded-lg bg-secondary/30"
                >
                    <span>github.com/{profile.username}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                </a>
            </header>

            {/* ── Main Container ── */}
            <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 space-y-8 relative z-10">
                
                {/* ── Zone 1: Profile card + AI Persona deep scan summary ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: General Profile Card */}
                    <div className="lg:col-span-1 glass-card border border-border/20 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-xl pointer-events-none" />
                        
                        <div className="space-y-6">
                            {/* Avatar & Basic Info */}
                            <div className="flex items-center gap-4">
                                <img 
                                    src={profile.avatar_url} 
                                    alt={profile.name ?? profile.username}
                                    className="w-16 h-16 rounded-2xl border-2 border-primary/30 object-cover shadow-lg"
                                />
                                <div>
                                    <h2 className="text-xl font-bold tracking-tight">{profile.name ?? profile.username}</h2>
                                    <p className="text-sm text-primary font-medium">@{profile.username}</p>
                                </div>
                            </div>

                            {/* Bio */}
                            {profile.bio && (
                                <p className="text-sm text-muted-foreground leading-relaxed italic">
                                    "{profile.bio}"
                                </p>
                            )}

                            {/* Meta items */}
                            <div className="space-y-3 pt-2">
                                {profile.company && (
                                    <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                                        <Briefcase className="w-4 h-4 text-primary/60 shrink-0" />
                                        <span className="truncate">{profile.company}</span>
                                    </div>
                                )}
                                {profile.location && (
                                    <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                                        <MapPin className="w-4 h-4 text-primary/60 shrink-0" />
                                        <span>{profile.location}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Social stats */}
                        <div className="grid grid-cols-3 gap-2 border-t border-border/10 pt-6 mt-6 text-center">
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Followers</p>
                                <p className="text-lg font-bold flex items-center justify-center gap-1">
                                    <Users className="w-3.5 h-3.5 text-primary/75" />
                                    {profile.followers}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Following</p>
                                <p className="text-lg font-bold">{profile.following}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Repos</p>
                                <p className="text-lg font-bold flex items-center justify-center gap-1">
                                    <BookOpen className="w-3.5 h-3.5 text-primary/75" />
                                    {profile.public_repos}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right: AI Developer Persona Scan Card */}
                    <div className="lg:col-span-2 glass-card border border-border/20 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
                        {/* Glow indicator */}
                        <div className="absolute -top-10 -right-10 w-44 h-44 bg-violet-600/10 rounded-full blur-2xl pointer-events-none" />

                        {persona ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                                {/* Left part: Vibe rating / Archetype */}
                                <div className="md:col-span-1 flex flex-col items-center justify-center text-center p-4 bg-[#11121d]/40 rounded-xl border border-border/10">
                                    <div className="relative flex items-center justify-center mb-3">
                                        {/* Radial Dial */}
                                        <svg className="w-24 h-24 transform -rotate-90">
                                            <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.03)" strokeWidth="6" fill="transparent" />
                                            <circle 
                                                cx="48" 
                                                cy="48" 
                                                r="40" 
                                                stroke="#3b82f6" 
                                                strokeWidth="6" 
                                                fill="transparent" 
                                                strokeDasharray={2 * Math.PI * 40}
                                                strokeDashoffset={2 * Math.PI * 40 * (1 - persona.vibe_score / 100)}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <span className="absolute text-2xl font-black">{persona.vibe_score}</span>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="inline-flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider">
                                            <Award className="w-3 h-3" /> Profile Vibe
                                        </div>
                                        <h3 className="text-base font-extrabold text-slate-100 tracking-tight leading-tight mt-1">{persona.archetype}</h3>
                                        <p className="text-xs text-muted-foreground">Style: {persona.contribution_style}</p>
                                    </div>
                                </div>

                                {/* Right part: Insights */}
                                <div className="md:col-span-2 flex flex-col justify-between space-y-4">
                                    <div>
                                        <div className="flex items-center gap-1.5 mb-2">
                                            <Sparkles className="w-4 h-4 text-primary shrink-0" />
                                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">AI Persona Summary</span>
                                        </div>
                                        <p className="text-sm text-slate-300 leading-relaxed font-medium">
                                            {persona.vibe_check}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border/10">
                                        <div className="space-y-1.5">
                                            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                                                ✓ Core Strengths
                                            </h4>
                                            <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-1">
                                                {persona.strengths.slice(0, 2).map((s, idx) => (
                                                    <li key={idx}>{s}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="space-y-1.5">
                                            <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1">
                                                ⚡ Growth Areas
                                            </h4>
                                            <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-1">
                                                {persona.growth_areas.slice(0, 2).map((g_item, idx) => (
                                                    <li key={idx}>{g_item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center space-y-4 py-8 h-full">
                                <div className="p-3 bg-violet-600/10 rounded-full border border-violet-500/20 text-violet-400">
                                    <Sparkles className="w-8 h-8" />
                                </div>
                                <div className="space-y-1 max-w-sm">
                                    <h3 className="text-lg font-bold">Unlocking AI Developer Persona</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Analyze all of {profile.name ?? profile.username}'s public footprint to identify their developer archetype, strengths, and presentation score.
                                    </p>
                                </div>
                                <Button 
                                    onClick={onDeepScan} 
                                    disabled={isScanningDeep} 
                                    className="gap-2 px-6"
                                    id="deep-scan-btn"
                                >
                                    {isScanningDeep ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-slate-100 border-t-transparent rounded-full animate-spin" />
                                            Analyzing Footprint...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4" />
                                            Trigger AI Review
                                        </>
                                    )}
                                </Button>
                                {deepScanError && (
                                    <p className="text-xs text-destructive mt-2" role="alert">⚠️ {deepScanError}</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Zone 2: Language chart + Commit Activity chart ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left: Language Distribution */}
                    <div className="glass-card border border-border/20 rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Shield className="w-5 h-5 text-primary" />
                            <h3 className="font-extrabold text-base">Global Technology Stack Breakdown</h3>
                        </div>
                        {languages.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                                {/* Pie Chart */}
                                <div className="h-44 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={languages}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={45}
                                                outerRadius={65}
                                                paddingAngle={3}
                                                dataKey="percentage"
                                            >
                                                {languages.map((entry) => (
                                                    <Cell key={`cell-${entry.name}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <ChartTooltip 
                                                contentStyle={{ backgroundColor: '#11121d', borderColor: 'rgba(255,255,255,0.1)' }}
                                                itemStyle={{ color: '#f1f5f9' }}
                                                formatter={(value) => [`${value}%`, 'Usage']}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                
                                {/* Legend List */}
                                <div className="space-y-2">
                                    {languages.map((lang) => (
                                        <div key={lang.name} className="flex items-center justify-between text-xs p-1 hover:bg-[#11121d]/40 rounded transition-colors">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: lang.color }} />
                                                <span className="font-semibold text-slate-200">{lang.name}</span>
                                            </div>
                                            <span className="text-muted-foreground font-mono">{lang.percentage}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="py-12 text-center text-xs text-muted-foreground">
                                No language data available for this profile.
                            </div>
                        )}
                    </div>

                    {/* Right: Commit Activity */}
                    <div className="glass-card border border-border/20 rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            <h3 className="font-extrabold text-base">Monthly Public Activity (6 Months)</h3>
                        </div>
                        {commits.length > 0 ? (
                            <div className="h-44 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={commits} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                        <XAxis 
                                            dataKey="month" 
                                            stroke="#64748b" 
                                            fontSize={10} 
                                            tickLine={false} 
                                            axisLine={false} 
                                        />
                                        <YAxis 
                                            stroke="#64748b" 
                                            fontSize={10} 
                                            tickLine={false} 
                                            axisLine={false} 
                                        />
                                        <ChartTooltip
                                            contentStyle={{ backgroundColor: '#11121d', borderColor: 'rgba(255,255,255,0.1)' }}
                                            itemStyle={{ color: '#f1f5f9' }}
                                            labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
                                            formatter={(value) => [value, 'Commits']}
                                        />
                                        <Bar dataKey="count" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
                                        <defs>
                                            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                            </linearGradient>
                                        </defs>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="py-12 text-center text-xs text-muted-foreground">
                                No activity records detected in the last 6 months.
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Zone 3: Portfolio Repository Explorer ── */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <FolderGit2 className="w-5 h-5 text-primary" />
                        <h3 className="font-extrabold text-base">Repository Portfolio Explorer</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {repositories.map((repo) => (
                            <div 
                                key={repo.name}
                                className="glass-card border border-border/20 rounded-xl p-5 hover:border-primary/30 transition-all duration-200 flex flex-col justify-between group h-full relative"
                            >
                                <div className="space-y-4">
                                    {/* Header Name & rating */}
                                    <div className="flex items-start justify-between gap-2">
                                        <h4 className="font-bold text-sm text-slate-200 group-hover:text-primary transition-colors truncate">
                                            {repo.name}
                                        </h4>
                                        <div className="flex items-center gap-1 bg-[#10192e] text-primary border border-primary/20 px-2 py-0.5 rounded text-[10px] font-bold shrink-0">
                                            <Award className="w-3 h-3" /> {repo.vibe_score}% vibe
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 h-8">
                                        {repo.description ?? "No description provided."}
                                    </p>

                                    {/* Language */}
                                    {repo.language && (
                                        <div className="inline-flex items-center gap-1.5 bg-[#161724] border border-[#2b2d3d] px-2 py-1 rounded text-[10px] font-semibold text-slate-300">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                            {repo.language}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4 mt-6">
                                    {/* Stars / forks stats */}
                                    <div className="flex items-center gap-4 border-t border-border/10 pt-4 text-xs text-muted-foreground font-mono">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-3.5 h-3.5 text-yellow-500/80" />
                                            <span>{repo.stars}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <GitFork className="w-3.5 h-3.5 text-primary/70" />
                                            <span>{repo.forks}</span>
                                        </div>
                                        <div className="ml-auto text-[10px]">
                                            {(repo.size / 1024).toFixed(1)} MB
                                        </div>
                                    </div>

                                    {/* Dynamic scan buttons */}
                                    <div className="grid grid-cols-2 gap-2 pt-1">
                                        <a
                                            href={repo.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground hover:text-slate-100 transition-colors border border-border/10 py-1.5 rounded-lg bg-secondary/10 font-semibold"
                                        >
                                            GitHub <ExternalLink className="w-2.5 h-2.5" />
                                        </a>
                                        <button
                                            type="button"
                                            onClick={() => handleAnalyzeRepo(`${profile.username}/${repo.name}`)}
                                            className="flex items-center justify-center gap-1 text-[10px] text-primary-foreground bg-primary hover:bg-primary/90 transition-colors py-1.5 rounded-lg font-bold"
                                        >
                                            Deep Scan <Sparkles className="w-2.5 h-2.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
