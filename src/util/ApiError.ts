export abstract class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "Not Found") {
    super(404, message);
  }
}

export class BadRequestError extends ApiError {
  constructor(message = "Bad Request") {
    super(400, message);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized") {
    super(401, message);
  }
}

export class ServerError extends ApiError {
  constructor(message = "ServerError") {
    super(500, message);
  }
}
