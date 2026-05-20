import apiClient from './apiClient';
import type { AnalysisObject, AnalyzeRequest, ApiResponse, ProfileAnalysisObject, DeveloperPersona } from '@/types';

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

    /**
     * POST /analyze/profile
     * Initiates aggregate analysis of a GitHub user profile.
     */
    async analyzeProfile(username: string): Promise<ApiResponse<ProfileAnalysisObject | null>> {
        const body = { username };
        const res = await apiClient.post<ApiResponse<ProfileAnalysisObject | null>>('/analyze/profile', body);
        return res.data;
    },

    /**
     * GET /analyze/profile/deep
     * Initiates a deep AI persona scan for a GitHub user profile.
     */
    async analyzeProfileDeep(username: string): Promise<{ success: boolean; data: DeveloperPersona | null; error: string | null }> {
        const res = await apiClient.get<{ success: boolean; data: DeveloperPersona | null; error: string | null }>(
            `/analyze/profile/deep?username=${encodeURIComponent(username)}`
        );
        return res.data;
    },
};

