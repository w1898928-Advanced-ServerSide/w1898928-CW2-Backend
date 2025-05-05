class CustomError extends Error {
    constructor(clientMessage, statusCode = 500, internalError = null) {
      super(clientMessage);
      this.clientMessage = clientMessage;
      this.statusCode = statusCode;
      this.internalError = internalError || clientMessage;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  module.exports = CustomError;
  