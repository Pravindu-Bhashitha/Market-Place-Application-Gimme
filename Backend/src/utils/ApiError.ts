export class ApiError extends Error {
  statusCode: number;
  description?: string;

  constructor(statusCode: number, message: string, description?: string) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.description = description;
  }
}