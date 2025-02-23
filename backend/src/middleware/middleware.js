import morgan from "morgan";

const apiKeyMiddleware = (req, res, next) => {
    const apiKey = req.headers['api_key'];
    if (apiKey && apiKey === process.env.API_KEY) {
        next();
    } else {
        res.status(403).json({ error: 'Неверный API_KEY' });
    }
};

const loggerMiddleware = morgan("[HTTP] :method :url :status - :response-time ms");

export { apiKeyMiddleware, loggerMiddleware }