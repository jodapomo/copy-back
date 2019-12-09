import { Response, Request, NextFunction } from 'express';
import { ApiError } from '../../errors/apiError';

import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';

@Middleware({ type: 'after' })
export class ErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: any, req: Request, res: Response, next: any) {
    if (error instanceof ApiError) {
      const { code, message, errors } = error;
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
    } else {
      res.status(error.status || 500).json({
        ok: false,
        code: error.status || 500,
        message: 'Something went wrong.',
        errors: {
          message: error.message,
        },
      });
    }

    next();
  }
}
