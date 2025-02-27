import morgan from "morgan";

const apiKeyMiddleware = (req, res, next) => {
    const apiKey = req.headers['api_key'];
    if (apiKey && apiKey === process.env.API_KEY) {
        next();
    } else {
        res.status(403).json({ error: 'Неверный API_KEY' });
    }
};

const validateIdMiddleware = (req, res, next) => {
    const { id } = req.params;
    if (isNaN(id) || Number(id) <= 0) {
        return res.status(400).json({ error: 'ID должен быть положительным числом' });
    }
    next();
};

const validateJsonMiddleware = (err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ error: 'Некорректный JSON' });
    }
    next(err);
};

const checkOtherErrorMiddleware = (err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
};

const loggerMiddleware = morgan("[HTTP] :method :url :status - :response-time ms");

export { apiKeyMiddleware, loggerMiddleware, validateIdMiddleware, validateJsonMiddleware, checkOtherErrorMiddleware };