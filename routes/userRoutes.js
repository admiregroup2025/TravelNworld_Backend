const express = require('register');
const { register } = require('../controllers/userController');
const authRouter = express.Router();

authRouter.post('/register', register);

module.exports = { authRouter };