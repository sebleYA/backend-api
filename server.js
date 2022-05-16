const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const errorHandler = require('./middlerware/error');
const connectDB = require('./config/db');

// load env vars
dotenv.config({ path: './config/config.env' });

// connect to database
connectDB();

// Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');

const app = express();
// Body parser
app.use(express.json())

// dev logging middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);

// erro handling
app.use(errorHandler);


const PORT = process.env.PORT || 6000;

const server = app.listen(PORT, console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));
 
// Handle unhandled promise Rejection
process.on('unhandledRejection', (err, Promise) =>{
    console.log(`Error: ${err.message}`.red.bold);
    // close server & exit process
    server.close(() => process.exit(1)) // exit the process with failer and crash the server
})