import { useState, useEffect, useCallback, useRef } from 'react';
import { githubService } from '@/services/githubService';
import { complexityScoreToLabel, getLanguageColor } from '@/utils';
import type { AnalysisObject, AnalysisResult } from '@/types';
import { MOCK_ANALYSIS_RESULT } from '@/data/mockAnalysis';

/** Errors that indicate the backend is simply not running */
const isNetworkError = (msg: string) =>
    msg.includes('network') ||
    msg.includes('econnrefused') ||
    msg.includes('failed to fetch') ||
    msg.includes('net::err') ||
    msg.includes('networkerror') ||
    msg.includes('load failed');

export type UseAnalyzeState =
    | { phase: 'idle' }
    | { phase: 'starting' }
    | { phase: 'completed'; result: AnalysisResult }
    | { phase: 'error'; message: string };

/** Maps raw API AnalysisObject → internal AnalysisResult used by components */
function mapToResult(data: AnalysisObject): AnalysisResult {
    const label = complexityScoreToLabel(data.project.complexity_score);
    return {
        projectName: data.project.name,
        projectOwner: data.project.owner,
        projectType: data.project.project_type,
        techStack: data.project.tech_stack,
        complexityScore: data.project.complexity_score,
        complexityLabel: label,
        summary: data.summary,
        keyFeatures: data.key_features,
        fileTree: data.file_tree,
        languages: data.languages.map((l, i) => ({
            ...l,
            color: getLanguageColor(l.name, i),
        })),
        commits: data.commits,
        architectureDiagram: data.architecture_diagram,
        preview: data.preview,
    };
}

export function useAnalyze(repo: string | null): UseAnalyzeState {
    const [state, setState] = useState<UseAnalyzeState>({ phase: 'idle' });
    const startedRef = useRef(false);

    const startAnalysis = useCallback(async () => {
        if (!repo || startedRef.current) return;
        startedRef.current = true;
        setState({ phase: 'starting' });

        try {
            const response = await githubService.analyze(repo);

            if (response.status === 'complete' && response.data) {
                setState({ phase: 'completed', result: mapToResult(response.data) });
            } else if (response.status === 'failed') {
                setState({
                    phase: 'error',
                    message: response.error ?? 'Repository analysis failed.',
                });
            } else {
                setState({ phase: 'error', message: 'Analysis complete but no data returned.' });
            }
        } catch (err) {
            const msg = (err instanceof Error ? err.message : String(err)).toLowerCase();

            // ── Demo mode: backend not reachable ──────────────────────────────
            if (isNetworkError(msg)) {
                // Simulate a brief loading delay so the loading UI is visible
                await new Promise((r) => setTimeout(r, 1800));
                setState({ phase: 'completed', result: MOCK_ANALYSIS_RESULT });
                return;
            }

            setState({ phase: 'error', message: err instanceof Error ? err.message : 'Failed to start analysis' });
        }
    }, [repo]);

    useEffect(() => {
        if (repo) {
            void startAnalysis();
        }
    }, [repo, startAnalysis]);

    return state;
}

