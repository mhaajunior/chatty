class CustomError extends Error {
  public statusCode: number;
  public payload: string | undefined;

  constructor(statusCode: number, message: string, payload?: string) {
    super(message);
    this.statusCode = statusCode;
    this.payload = payload;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends CustomError {
  constructor(message: string) {
    super(404, message);
  }
}

class BadRequestError extends CustomError {
  constructor(message: string, payload?: string) {
    super(400, message, payload);
  }
}

class UnauthorizedError extends CustomError {
  constructor(message: string) {
    super(401, message);
  }
}

class ForbiddenError extends CustomError {
  constructor(message: string) {
    super(403, message);
  }
}

export {
  CustomError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
};
