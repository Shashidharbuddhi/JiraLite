const errorHandler =
(err, req, res, next) => {

  console.error(err);

  let statusCode =
    res.statusCode === 200
      ? 500
      : res.statusCode;

  let message =
    err.message;

  // Invalid Mongo ID
  if (err.name === 'CastError') {
    statusCode = 404;
    message =
      'Resource not found';
  }

  res.status(statusCode)
    .json({
      success: false,
      message
    });
};

export default errorHandler;