const { logToFile } = require('../utils/logger');

const loggerMiddleware = (req, res, next) => {
  const { method, originalUrl, ip } = req;
  const start = Date.now();

  res.on('finish', () => {
    const logData = {
      method,
      endpoint: originalUrl,
      statusCode: res.statusCode,
      ip,
      duration: `${Date.now() - start}ms`,
    };
    logToFile(logData);
  });

  next();
};

module.exports = loggerMiddleware;
