const express = require('express');
const { register, login, logout } = require('../controllers/userController');
const { authValidation } = require('../middlewares/authValidation');
const { loginValidation } = require('../middlewares/loginValidation');
const authRouter = express.Router();

authRouter.post('/register', authValidation, register);
authRouter.post('/login', loginValidation, login);
authRouter.post('/logout', logout);

module.exports = { authRouter };