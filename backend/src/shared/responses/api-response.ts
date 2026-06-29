export type ApiSuccessResponse<TData = undefined> = {
  success: true;
  message: string;
  data?: TData;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  errors: unknown[];
};

export function successResponse(message: string): ApiSuccessResponse;
export function successResponse<TData>(message: string, data: TData): ApiSuccessResponse<TData>;
export function successResponse<TData>(message: string, data?: TData): ApiSuccessResponse<TData> {
  return data === undefined ? { success: true, message } : { success: true, message, data };
}

export function errorResponse(message: string, errors: unknown = []): ApiErrorResponse {
  return {
    success: false,
    message,
    errors: Array.isArray(errors) ? errors : [errors]
  };
}
