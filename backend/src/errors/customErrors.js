class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

class BadRequestError extends CustomError {
    constructor(message = 'Некорректный запрос') {
        super(message, 400);
    }
}

class UnauthorizedError extends CustomError {
    constructor(message = 'Неавторизованный доступ') {
        super(message, 401);
    }
}

class NotFoundError extends CustomError {
    constructor(message = 'Ресурс не найден') {
        super(message, 404);
    }
}

class InternalServerError extends CustomError {
    constructor(message = 'Внутренняя ошибка сервера') {
        super(message, 500);
    }
}

const handleError = (res, error, defaultMessage) => {
    console.log(defaultMessage || error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message || defaultMessage });
};

export { CustomError, BadRequestError, UnauthorizedError, NotFoundError, InternalServerError, handleError };