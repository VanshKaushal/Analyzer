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
