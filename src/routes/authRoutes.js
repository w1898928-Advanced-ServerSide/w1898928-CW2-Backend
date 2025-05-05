const express = require('express');
const router = express.Router();
const bcryptUtils = require('../utils/bcryptUtils');
const UserService = require('../services/authService');
const checkSession = require('../middlewares/sessionAuth');
const CustomError = require('../utils/customError');

const userService = new UserService();

// Register user
router.post('/register', async (req, res, next) => {
    try {
        const { username, password, email } = req.body;
        await userService.registerUser(username, password, email);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        next(new CustomError('Failed to register user', 400, err));
    }
});

// Login user
router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await userService.loginUser(username, password);
        req.session.user = {
            userId: user.id,
            email: user.email
        };
        req.session.isAuthenticated = true;
        res.status(200).json({ message: 'Login successful', user });
    } catch (err) {
        next(new CustomError('Login failed', 401, err));
    }
});

// Get current session user
router.get('/me', (req, res) => {
    if (req.session && req.session.isAuthenticated && req.session.user) {
        res.status(200).json({ user: req.session.user });
    } else {
        res.status(401).json({ error: 'User not authenticated' });
    }
});

// Logout
router.post('/logout', (req, res, next) => {
    req.session.destroy((err) => {
        if (err) return next(new CustomError('Failed to log out', 500, err));
        res.clearCookie('connect.sid');
        res.status(200).json({ message: 'Logged out successfully' });
    });
});

// Create user (admin use)
router.post('/create', async (req, res, next) => {
    try {
        const { username, password, email } = req.body;
        await userService.createUser(username, password, email);
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        next(new CustomError('Failed to create user', 500, err));
    }
});

// Get all users
router.get('/users', checkSession, async (req, res, next) => {
    try {
        const result = await userService.getAllUsers();
        res.status(200).json(result);
    } catch (err) {
        next(new CustomError('Failed to fetch users', 500, err));
    }
});

// Get user by ID
router.get('/users/:id', checkSession, async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await userService.getUserById(id);
        res.status(200).json(result);
    } catch (err) {
        next(new CustomError('Failed to get user', 404, err));
    }
});

// Update user
router.put('/users/:id', checkSession, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { username, password, email } = req.body;
        const hashedPassword = await bcryptUtils.hashPassword(password);
        await userService.updateUser(id, username, hashedPassword, email);
        res.status(200).json({ success: true, message: 'User updated successfully' });
    } catch (err) {
        next(new CustomError('Failed to update user', 400, err));
    }
});

// Delete user
router.delete('/users/:id', checkSession, async (req, res, next) => {
    try {
        const { id } = req.params;
        await userService.deleteUser(id);
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (err) {
        next(new CustomError('Failed to delete user', 400, err));
    }
});

module.exports = router;