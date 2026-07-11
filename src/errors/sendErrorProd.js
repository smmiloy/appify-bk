const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      const errorResponse = {
        success: false,
        message: err.message,
      };

      if (err.data) {
        errorResponse.data = err.data;
      }

      return res.status(err.statusCode).json(errorResponse);
    }

    console.error('ERROR 💥', err);
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }

  if (err.isOperational) {
    const errorResponse = {
      status: err.status,
      message: err.message,
    };

    if (err.data) {
      errorResponse.data = err.data;
    }
    console.error('Operational error:', err);
    return res.status(err.statusCode).json(errorResponse);
  }

  console.error('ERROR 💥', err);
  return res.status(500).json({
    success: false,
    title: 'Something went wrong!',
    message: 'Please try again later.',
  });
};

export default sendErrorProd;
