const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            status: 'error',
            message: err.message,
            errors: err.errors
        });
    }

    res.status(500).json({
        status: 'error',
        message: 'Internal Server Error'
    });
};

const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        status: 'error',
        message: 'Resource not found'
    });
};

module.exports = { errorHandler, notFoundHandler };