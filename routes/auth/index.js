const express = require('express');
const router = express.Router();
const { validateRegister } = require('../../validators/registerValidator');
const { validateLogin } = require('../../validators/loginValidator');

const authController = require('../../controllers/auth/authController');

// GET category home page
router.post('/register', validateRegister, authController.register_user);
router.post('/login', validateLogin, authController.login_user);

module.exports = router; 
