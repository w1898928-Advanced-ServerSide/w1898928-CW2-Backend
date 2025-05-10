const { logToFile } = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const clientMessage = err.clientMessage || 'Internal server error';
  const realError = err.internalError || err;

  logToFile({
    error: {
      message: realError.message || realError.toString(),
      stack: realError.stack || null,
      method: req.method,
      endpoint: req.originalUrl,
      ip: req.ip,
      timestamp: new Date().toISOString()
    }
  });

  res.status(statusCode).json({ error: clientMessage });
};

module.exports = errorHandler;
