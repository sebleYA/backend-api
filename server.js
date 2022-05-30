const path = require('path');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimt = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const errorHandler = require('./middlerware/error');
const connectDB = require('./config/db');

// Load the enviroment variables
require('dotenv').config();

// connect to database
connectDB();

// Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

const app = express();
// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// dev logging middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// File uploading
app.use(fileupload());

// Sanitize data
app.use(mongoSanitize());

// Set security header
app.use(helmet());

// prevent Xss attacks
app.use(xss());

// Rate limiting
const limiter = rateLimt({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100
});

app.use(limiter);

// Prevent http param ppllution
app.use(hpp());

// Enable CORS
app.use(cors());

// Set statidc folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

// error handling
app.use(errorHandler);

const PORT = process.env.PORT || 8080;

const server = app.listen(
  PORT,
  console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
);

// Handle unhandled promise Rejection
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`.red.bold);
  // close server & exit process
  server.close(() => process.exit(1)); // exit the process with failer and crash the server
});
