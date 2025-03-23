import morgan from 'morgan';
import {
  Request,
  Response,
  NextFunction,
  RequestHandler,
  ErrorRequestHandler,
} from 'express';

interface ExpressError extends SyntaxError {
  status?: number;
  body?: unknown;
}

const apiKeyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (req.path.startsWith('/uploads/')) {
    return next();
  }

  const apiKey = req.headers['api_key'];
  if (apiKey && apiKey === process.env.API_KEY) {
    next();
  } else {
    res.status(403).json({ error: 'Неверный API_KEY' });
  }
};

const validateIdMiddleware: RequestHandler = (req, res, next) => {
  const { id } = req.params;
  if (isNaN(Number(id)) || Number(id) <= 0) {
    res.status(400).json({ error: 'ID должен быть положительным числом' });
    return;
  }
  next();
};

const validateJsonMiddleware: ErrorRequestHandler = (
  err: ExpressError,
  req,
  res,
  next,
) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    res.status(400).json({ error: 'Некорректный JSON' });
    return;
  }
  next(err);
};

const checkOtherErrorMiddleware: ErrorRequestHandler = (
  err,
  req,
  res,
  next,
) => {
  console.error(err);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  next();
};

const loggerMiddleware = morgan(
  '[HTTP] :method :url :status - :response-time ms - :date[iso]',
);

const handleAuthErrorMiddleware: ErrorRequestHandler = (
  err,
  req,
  res,
  next,
) => {
  if (err) {
    res.status(401).json({ error: 'Неверный или отсутствующий токен' });
    return;
  }
  next();
};

export {
  apiKeyMiddleware,
  loggerMiddleware,
  validateIdMiddleware,
  validateJsonMiddleware,
  checkOtherErrorMiddleware,
  handleAuthErrorMiddleware,
};
