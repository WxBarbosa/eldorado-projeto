const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { errorHandler, notFoundHandler } = require('./middlewares/error.middleware');
const { dbConnection } = require('./config/database');
const cors = require('cors');

// Routers
const categoryRoutes = require('./routes/category.routes');
const deviceRoutes = require('./routes/device.routes');

const app = express();

// Database connection
dbConnection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1);
    }
    console.log('Connected to the MySQL database.');
});

// Middlewares
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/devices', deviceRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
