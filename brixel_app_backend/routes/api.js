const express = require('express');
const router = new express.Router();
const UserController = require('../controllers/user-controller');

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
router.get('/profile', UserController.profile);

module.exports = router;