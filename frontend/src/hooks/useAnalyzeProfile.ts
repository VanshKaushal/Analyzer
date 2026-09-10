import { useState, useEffect, useCallback, useRef } from 'react';
import { githubService } from '@/services/githubService';
import { getLanguageColor } from '@/utils';
import type { ProfileAnalysisObject, ProfileAnalysisResult } from '@/types';
import { MOCK_PROFILE_RESULT, MOCK_PROFILE_PERSONA } from '@/data/mockProfileAnalysis';


const isNetworkError = (msg: string) =>
    msg.includes('network') ||
    msg.includes('econnrefused') ||
    msg.includes('failed to fetch') ||
    msg.includes('net::err') ||
    msg.includes('networkerror') ||
    msg.includes('load failed');

export type UseAnalyzeProfileState =
    | { phase: 'idle' }
    | { phase: 'starting' }
    | { phase: 'completed'; result: ProfileAnalysisResult; isScanningDeep: boolean; deepScanError: string | null }
    | { phase: 'error'; message: string };

function mapProfileToResult(data: ProfileAnalysisObject): ProfileAnalysisResult {
    return {
        profile: data.profile,
        languages: data.languages.map((l, i) => ({
            ...l,
            color: getLanguageColor(l.name, i),
        })),
        commits: data.commits,
        repositories: data.repositories,
        persona: data.persona,
    };
}

export function useAnalyzeProfile(username: string | null): UseAnalyzeProfileState & { runDeepScan: () => Promise<void> } {
    const [state, setState] = useState<UseAnalyzeProfileState>({ phase: 'idle' });
    const startedRef = useRef(false);

    const startAnalysis = useCallback(async () => {
        if (!username || startedRef.current) return;
        startedRef.current = true;
        setState({ phase: 'starting' });

        try {
            const response = await githubService.analyzeProfile(username);

            if (response.status === 'complete' && response.data) {
                setState({ 
                    phase: 'completed', 
                    result: mapProfileToResult(response.data),
                    isScanningDeep: false,
                    deepScanError: null
                });
            } else if (response.status === 'failed') {
                setState({
                    phase: 'error',
                    message: response.error ?? 'Profile analysis failed.',
                });
            } else {
                setState({ phase: 'error', message: 'Analysis complete but no profile data returned.' });
            }
        } catch (err) {
            const msg = (err instanceof Error ? err.message : String(err)).toLowerCase();

            // Demo mode fallback
            if (isNetworkError(msg)) {
                await new Promise((r) => setTimeout(r, 1800));
                setState({ 
                    phase: 'completed', 
                    result: {
                        ...MOCK_PROFILE_RESULT,
                        profile: {
                            ...MOCK_PROFILE_RESULT.profile,
                            username: username,
                            name: username.charAt(0).toUpperCase() + username.slice(1)
                        }
                    },
                    isScanningDeep: false,
                    deepScanError: null
                });
                return;
            }

            setState({ phase: 'error', message: err instanceof Error ? err.message : 'Failed to analyze profile' });
        }
    }, [username]);

    const runDeepScan = useCallback(async () => {
        if (state.phase !== 'completed' || !username) return;

        setState(prev => ({
            ...prev,
            isScanningDeep: true,
            deepScanError: null
        }));

        try {
            const response = await githubService.analyzeProfileDeep(username);
            if (response.success && response.data) {
                setState(prev => {
                    if (prev.phase !== 'completed') return prev;
                    return {
                        ...prev,
                        isScanningDeep: false,
                        result: {
                            ...prev.result,
                            persona: response.data
                        }
                    };
                });
            } else {
                setState(prev => {
                    if (prev.phase !== 'completed') return prev;
                    return {
                        ...prev,
                        isScanningDeep: false,
                        deepScanError: response.error ?? 'Failed to generate persona.'
                    };
                });
            }
        } catch (err) {
            const msg = (err instanceof Error ? err.message : String(err)).toLowerCase();
            
            // Fallback for offline demo
            if (isNetworkError(msg)) {
                await new Promise((r) => setTimeout(r, 2000));
                setState(prev => {
                    if (prev.phase !== 'completed') return prev;
                    return {
                        ...prev,
                        isScanningDeep: false,
                        result: {
                            ...prev.result,
                            persona: MOCK_PROFILE_PERSONA
                        }
                    };
                });
                return;
            }

            setState(prev => {
                if (prev.phase !== 'completed') return prev;
                return {
                    ...prev,
                    isScanningDeep: false,
                    deepScanError: err instanceof Error ? err.message : 'Failed during deep scan'
                };
            });
        }
    }, [state.phase, username]);

    useEffect(() => {
        if (username) {
            void startAnalysis();
        }
    }, [username, startAnalysis]);

    return {
        ...state,
        runDeepScan
    };
}
