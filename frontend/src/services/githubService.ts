import apiClient from './apiClient';
import type { AnalysisObject, AnalyzeRequest, ApiResponse } from '@/types';

export const githubService = {
    /**
     * POST /analyze
     * Initiates analysis of a GitHub repository and waits for completion.
     * Returns the full API response envelope.
     */
    async analyze(repo: string): Promise<ApiResponse<AnalysisObject | null>> {
        const body: AnalyzeRequest = { repo };
        const res = await apiClient.post<ApiResponse<AnalysisObject | null>>('/analyze', body);
        return res.data;
    },
};
