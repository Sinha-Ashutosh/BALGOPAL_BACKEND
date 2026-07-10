export interface AppErrorOptions {
  statusCode: number;
  explanation?: unknown;
  isOperational?: boolean;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly explanation: unknown;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    {
      statusCode,
      explanation = {},
      isOperational = true,
    }: AppErrorOptions
  ) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.explanation = explanation;
    this.isOperational = isOperational;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(
    message: string,
    explanation?: unknown
  ): AppError {
    return new AppError(message, {
      statusCode: 400,
      explanation,
    });
  }

  static unauthorized(
    message = "Unauthorized"
  ): AppError {
    return new AppError(message, {
      statusCode: 401,
    });
  }

  static forbidden(
    message = "Forbidden"
  ): AppError {
    return new AppError(message, {
      statusCode: 403,
    });
  }

  static notFound(
    message = "Not Found"
  ): AppError {
    return new AppError(message, {
      statusCode: 404,
    });
  }

  static conflict(
    message: string,
    explanation?: unknown
  ): AppError {
    return new AppError(message, {
      statusCode: 409,
      explanation,
    });
  }

  static unprocessableEntity(
    message: string,
    explanation?: unknown
  ): AppError {
    return new AppError(message, {
      statusCode: 422,
      explanation,
    });
  }

  static internal(
    message = "Internal Server Error"
  ): AppError {
    return new AppError(message, {
      statusCode: 500,
      isOperational: false,
    });
  }
}