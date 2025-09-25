const express = require('express');
const router = new express.Router();
const UserController = require('../controllers/user-controller');

router.post('/register', UserController.register);

module.exports = router;