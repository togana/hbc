export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 500,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const isApiError = (error: unknown): error is ApiError => {
  return error instanceof ApiError;
};

export const toError = (error: unknown): Error => {
  if (error instanceof Error) {
    return error;
  }
  return new Error(String(error));
};
