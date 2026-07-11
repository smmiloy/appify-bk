import {
  handleAtlasErrorB,
  handleCastErrorDB,
  handleDuplicateFieldsDB,
  handleValidationErrorDB,
} from './databaseErrors.js';

import urlNotFound from './urlNotFound.js';
import sendErrorDev from './sendDevError.js';
import sendErrorProd from './sendErrorProd.js';
import joiErrorHandler from './joiErrorHandler.js';
import handleValidationError from './validationError.js';
import { NODE_ENV } from '../utils/env.js';
import { handleJWTError, handleJWTExpiredError } from './jwtErrors.js';

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else {
    let error = { ...err };
    error.message = err.message;
    error.name = err.name;
    error.code = err.code;
    error.keyValue = err.keyValue;
    error.errmsg = err.errmsg;
    error.codeName = err.codeName;

    // Fix: CastError uses 'name' property, not 'codeName'
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.codeName === 'AtlasError') error = handleAtlasErrorB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.codeName === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};

export {
  urlNotFound,
  joiErrorHandler,
  globalErrorHandler,
  handleValidationErrorDB,
  handleValidationError,
};
