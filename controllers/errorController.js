const AppError = require('../utils/appError');

const handleCastErrorDB = (error) => {
  const message = `Invalid ${error.path}: ${error.value}`;

  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (error) => {
  const value = Object.values(error.keyValue)[0];
  const message = `Duplicate field value: ${value}. Use another value.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (error) => {
  const errors = Object.values(error.errors).map(
    (el) => el.message
  );
  const message = `Invalid input data. ${errors.join(
    '. '
  )}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid Token. Please login again', 401);
const handleTokenExpiredError = () =>
  new AppError('Token Expired. Please login again', 401);

const sendErrDev = (err, req, res) => {
  // if check written in lec 193

  // A) API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  // B) RENDERED WEBSITE
  console.error('Error 💥', err);

  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message,
  });
};

const sendErrProd = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    // Operational, trusted error: send to the client.
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    //  Programming or other unkown error: don't leak error details
    // 1) Log error
    console.error('Error 💥', err);

    // 2) Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
  // B) RENDERED WEBSITE
  // Operational, trusted error: send to the client.
  if (err.isOperational) {
    console.log(err);
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }
  // B) Programming or other unkown error: don't leak error details
  // 1) Log error

  console.error('Error 💥', err);

  // 2) Send generic message

  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later!!!',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    // console.log(err.code, '🙂🙂🙂🙂🙂🙂🙂🙂');

    let error = { ...err };
    error.message = err.message;
    if (err.name === 'CastError')
      error = handleCastErrorDB(error);
    if (err.code === 11000)
      error = handleDuplicateFieldsDB(error);
    if (err.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (err.name === 'JsonWebTokenError')
      error = handleJWTError();
    if (err.name === 'TokenExpiredError')
      error = handleTokenExpiredError();

    console.log(err.message);
    console.log(error.message);

    sendErrProd(error, req, res);
  }
};
