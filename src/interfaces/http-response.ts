export interface HttpResponse<T> {
    status: 'success' | 'error';
    success: boolean;
    message?: string;
    data?: T;
}
