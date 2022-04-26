const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
    let error = { ...err}
    error.message = err.message;

    // Log to console
    console.log(err);

    // Mongoose bad ObjectId
    if(err.name === 'CastError'){
        const message = `Bootcamp is not found with id of ${err.value}`;
        error = new ErrorResponse(message, 404);
    }
    
    // Mongooscodee Duplicate Key
    if(err.code === 11000) {
        const message = 'Duplicate field value entred!'
        error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({
        sucess: false,
        error: error.message || 'Server Error'
    });
}

module.exports = errorHandler;