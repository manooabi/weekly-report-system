const express = require('express');
const errorHandler = require('./middleware/error.middleware');
const authRoutes = require('./routes/auth.routes');


const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.json({
        message: 'Weekly Report System API is running'
    });
});
// Centralized error handler
app.use(errorHandler);
module.exports = app;