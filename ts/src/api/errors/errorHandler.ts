export class ErrorHandler extends Error {
  constructor(public code: number, public message: string, public errors: object | string | undefined = undefined) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.code = code;
    this.message = message || 'Something went wrong. Please try again.';
    this.errors = errors;
  }
}
