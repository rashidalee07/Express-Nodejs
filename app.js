/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const express = require('express');
const morgan = require('morgan');

// eslint-disable-next-line import/no-extraneous-dependencies
const rateLimit = require('express-rate-limit');

const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
//const { stringify } = require('querystring');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoute');

const userRouter = require('./routes/userRoute');
const reviewRouter = require('./routes/reviewRoute');

const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//Serving static files
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
app.use(helmet());

//(1) GLOBAL MIDDLEWARES
// Development logging
//console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  // console.log('development');
}

// Rate limiting from same api
const limiter = rateLimit({
  max: 10,
  windowMs: 60 * 60 * 1000,
  message:
    'Too many requests from this IP, please try again in an hour!',
});

app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ rateLimit: '10kb' }));
app.use(
  express.urlencoded({ extended: true, limit: '10kb' })
);
app.use(cookieParser());

// Data sanitization against NoSQL Injection
app.use(mongoSanitize());

// Data sanitizaition against XSS
app.use(xss());
// Prevent parameter pollution

app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// Test Middleware
app.use((req, res, next) => {
  // console.log('Hello from the middleware 👋');
  console.log(req.cookies);
  next();
});

app.use((req, res, next) => {
  req.resquetTime = new Date().toISOString();
  next();
});

// ROUTES
//MOUNTING ROUTER ON A ROUTE
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(
    new AppError(
      `Can't find ${req.originalUrl} on this server!!!`,
      404
    )
  );
});

app.use(globalErrorHandler);
module.exports = app;
