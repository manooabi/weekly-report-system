const {
    registerUser,
    loginUser
} = require('../services/auth.service');

async function register(req, res, next) {
    try {
        const user = await registerUser(req.body);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: user
        });
    } catch (error) {
        next(error);
    }
}

async function login(req, res, next) {
    try {
        const result = await loginUser(req.body);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: result
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    register,
    login
};