import { Response, Request, NextFunction } from 'express';
import { ErrorHandler } from '../errors/errorHandler';

export const handleError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ErrorHandler) {
    const { code, message, errors } = err;
    let statusCode;
    if (code >= 100 && code < 600) {
      statusCode = code;
    } else {
      statusCode = 500;
    }

    res.status(statusCode).json({
      ok: false,
      code: statusCode,
      message,
      errors,
    });
    return;
  }

  res.status(err.status || 500).json({
    ok: false,
    code: err.status || 500,
    message: 'Something went wrong.',
    errors: {
      message: err.message,
    },
  });
};
