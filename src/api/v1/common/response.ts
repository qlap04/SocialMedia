export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export function successResponse<T>(message: string, data: T): ApiResponse<T> {
    if (!message || typeof message !== 'string') {
        throw new Error('Message must be a non-empty string');
    }
    return {
        success: true,
        message: message,
        data
    };
}

export function errorResponse<T>(message: string, data: T): ApiResponse<T> {
    if (!message || typeof message !== 'string') {
        throw new Error('Message must be a non-empty string');
    }
    return {
        success: false,
        message: message,
        data
    };
}