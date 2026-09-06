const express = require('express');
const errorHandler = require('./middleware/error.middleware');


const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'Weekly Report System API is running'
    });
});
// Centralized error handler
app.use(errorHandler);
module.exports = app;