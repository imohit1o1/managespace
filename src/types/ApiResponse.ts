export interface ApiResponse {
    success: boolean;
    message: string;
    status: number;
    error?: string;
}