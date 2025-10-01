const express = require('express');
const router = new express.Router();
const UserController = require('../controllers/user-controller');

// User routes
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
router.get('/profile', UserController.profile);

// Image analyze routes
router.use(require('./analyzeRoutes'));

// Pixel PDF routes
router.use(require('./pdfRoutes'));

module.exports = router;
