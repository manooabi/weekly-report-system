const express = require('express');
const errorHandler = require('./middleware/error.middleware');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const categoryRoutes = require('./routes/category.routes');
const projectRoutes = require('./routes/project.routes');
const projectMemberRoutes = require('./routes/project-member.routes');
const reportRoutes = require('./routes/report.routes');
// const reportRoutes = require('./routes/report.routes');







const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/projects', projectMemberRoutes);
app.use('/api/reports', reportRoutes);
// app.use('/api/reports', reportRoutes);

app.get('/', (req, res) => {
    res.json({
        message: 'Weekly Report System API is running'
    });
});
// Centralized error handler
app.use(errorHandler);
module.exports = app;