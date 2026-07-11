const joiErrorHandler = (data, dataSchema) => {
  const { error, value } = dataSchema.validate(data, {
    abortEarly: false, // Return ALL errors, not just the first one
    allowUnknown: true, // Optional: allow fields not in schema to pass through (or set false to be strict)
    stripUnknown: true, // Optional: remove fields not in schema from 'value'
  });

  if (error) {
    const formattedErrors = {};

    error.details.forEach((item) => {
      const message = item.message.replace(/"/g, '');
      const field = item.path[0];

      formattedErrors[field] = message;
    });

    return { hasError: true, error: formattedErrors };
  }

  return { hasError: false, value };
};

export default joiErrorHandler;
