import AppError from '../utils/appError.js';

export const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

export const handleDuplicateFieldsDB = (err) => {
  const duplicatedFields = {};
  let message = 'Duplicate field value. Please use another value.';

  if (err.keyValue && typeof err.keyValue === 'object') {
    const keys = Object.keys(err.keyValue);
    const values = Object.values(err.keyValue);

    keys.forEach((key, index) => {
      duplicatedFields[key] =
        `${values[index]} is already taken, please use another one.`;
    });

    message = `Duplicate field value: ${values.join(', ')}. Please use another value!`;
  } else if (err.errmsg) {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/);
    if (value) {
      message = `Duplicate field value: ${value[0]}. Please use another value!`;
    }
  }

  return new AppError(message, 400, duplicatedFields);
};

export const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

export const handleAtlasErrorB = (err) => {
  const message = err.message;
  return new AppError(message, 500);
};
