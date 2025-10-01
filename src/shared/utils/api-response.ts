export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export function createSuccessResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
  };
}

export function createErrorResponse<T = any>(error: string, message?: string): ApiResponse<T> {
  return {
    success: false,
    error,
    message,
  };
}