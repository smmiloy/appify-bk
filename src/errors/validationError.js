const handleValidationError = (res, errors) => {
  // console.log('Validation errors:', errors);
  res.status(400).send({
    success: false,
    message: 'Invalid input data.',
    data: errors,
  });
};

export default handleValidationError;
