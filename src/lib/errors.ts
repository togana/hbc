export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 422);
    this.name = 'ValidationError';
  }
}

export class ApiError extends AppError {
  constructor(message: string, statusCode: number = 500) {
    super(message, 'API_ERROR', statusCode);
    this.name = 'ApiError';
  }
}

export const isAppError = (error: unknown): error is AppError => {
  return error instanceof AppError;
};

export const toError = (error: unknown): Error => {
  if (error instanceof Error) {
    return error;
  }
  return new Error(String(error));
};
