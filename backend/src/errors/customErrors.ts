import { Response } from 'express';

class CustomError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

class BadRequestError extends CustomError {
  constructor(message: string = 'Некорректный запрос') {
    super(message, 400);
  }
}

class UserAlreadyExistsError extends CustomError {
  constructor(message: string = 'Пользователь уже существует') {
    super(message, 409);
  }
}

class UnauthorizedError extends CustomError {
  constructor(message: string = 'Неавторизованный доступ') {
    super(message, 403);
  }
}

class NotFoundError extends CustomError {
  constructor(message: string = 'Ресурс не найден') {
    super(message, 404);
  }
}

class InternalServerError extends CustomError {
  constructor(message: string = 'Внутренняя ошибка сервера') {
    super(message, 500);
  }
}

const handleError = (
  res: Response,
  error: CustomError,
  defaultMessage?: string,
): void => {
  console.log(defaultMessage || error);
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({ error: error.message || defaultMessage });
};

export {
  CustomError,
  BadRequestError,
  UserAlreadyExistsError,
  UnauthorizedError,
  NotFoundError,
  InternalServerError,
  handleError,
};
