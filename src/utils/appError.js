export default class AppError extends Error {
  constructor(message, statusCode, fields = {}) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.constructor.name;

    this.statusCode = statusCode;

    // ALWAYS false for errors
    this.success = false;

    this.isOperational = true;
    this.data = fields;

    console.log('AppError created:', {
      message,
      statusCode,
      fields,
    });

    Error.captureStackTrace(this, this.constructor);
  }
}
