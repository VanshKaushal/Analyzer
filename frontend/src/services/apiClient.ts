import axios from 'axios';
import type { ApiResponse } from '@/types';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api/v1',
    timeout: 30_000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor — surface structured API errors cleanly
apiClient.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
        if (axios.isAxiosError(error)) {
            const data = error.response?.data as ApiResponse<unknown> | undefined;
            const msg = data?.error ?? error.message ?? 'Unknown API error';
            return Promise.reject(new Error(msg));
        }
        return Promise.reject(error);
    },
);

export default apiClient;
