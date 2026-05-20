// ─── API Envelope ─────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
    success: boolean;
    status: 'processing' | 'complete' | 'failed';
    data: T | null;
    error: string | null;
}

// ─── File Tree ────────────────────────────────────────────────────────────────
export interface FileNode {
    name: string;
    path: string;
    type: 'file' | 'folder';
    children?: FileNode[];
}

export interface PreviewDetails {
    type: 'live' | 'readme' | 'none';
    url: string | null;
    readme_content: string | null;
}

// ─── Analysis Object (from API) ───────────────────────────────────────────────
export interface ProjectInfo {
    name: string;
    owner: string;
    tech_stack: string[];
    project_type: string;
    complexity_score: number;
}

export interface LanguageStat {
    name: string;
    percentage: number;
}

export interface CommitStat {
    month: string;
    count: number;
}

export interface AnalysisObject {
    project: ProjectInfo;
    summary: string;
    key_features: string[];
    languages: LanguageStat[];
    commits: CommitStat[];
    file_tree: FileNode[];
    architecture_diagram: string;
    preview: PreviewDetails;
}

// ─── Request ──────────────────────────────────────────────────────────────────
export interface AnalyzeRequest {
    repo: string; // "owner/repo"
}

// ─── Internal mapped type (used by components) ────────────────────────────────
export type ComplexityLabel = 'Low' | 'Medium' | 'High' | 'Very High';

export interface MappedLanguageStat extends LanguageStat {
    color: string;
}

export interface AnalysisResult {
    projectName: string;
    projectOwner: string;
    projectType: string;
    techStack: string[];
    complexityScore: number;
    complexityLabel: ComplexityLabel;
    summary: string;
    keyFeatures: string[];
    fileTree: FileNode[];
    languages: MappedLanguageStat[];
    commits: CommitStat[];
    architectureDiagram: string;
    preview: PreviewDetails;
}

// ─── Profile Analysis Objects ──────────────────────────────────────────────────
export interface ProfileInfo {
    username: string;
    name: string | null;
    avatar_url: string;
    bio: string | null;
    company: string | null;
    location: string | null;
    followers: number;
    following: number;
    public_repos: number;
    total_stars: number;
    total_forks: number;
    html_url: string;
}

export interface RepoPortfolioItem {
    name: string;
    description: string | null;
    stars: number;
    forks: number;
    language: string | null;
    size: number;
    url: string;
    vibe_score: number;
}

export interface DeveloperPersona {
    vibe_check: string;
    archetype: string;
    strengths: string[];
    growth_areas: string[];
    vibe_score: number;
    contribution_style: string;
}

export interface ProfileAnalysisObject {
    profile: ProfileInfo;
    languages: LanguageStat[];
    commits: CommitStat[];
    repositories: RepoPortfolioItem[];
    persona: DeveloperPersona | null;
}

export interface ProfileAnalysisResult {
    profile: ProfileInfo;
    languages: MappedLanguageStat[];
    commits: CommitStat[];
    repositories: RepoPortfolioItem[];
    persona: DeveloperPersona | null;
}

