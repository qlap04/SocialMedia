export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T | null;
    status: number;
}

const validateMessage = (message: string): void => {
    if (!message || typeof message !== 'string') throw new Error('Message must be a non-empty string');
};

export const successResponse = <T>(message: string, data: T | null, status: number): ApiResponse<T> => {
    validateMessage(message);
    return { success: true, message, data, status };
};

export const errorResponse = <T>(message: string, data: T | null, status: number): ApiResponse<T> => {
    validateMessage(message);
    return { success: false, message, data, status };
};