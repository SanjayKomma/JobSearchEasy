const express = require('express');
const { register, login, getProfile, logout } = require('../controllers/authControllers');
const { isAuthenticated } = require('../middlewares/auth');
const authRouter = express.Router();
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.get('/getProfile', isAuthenticated, getProfile);
authRouter.post('/logout', isAuthenticated, logout);
module.exports = authRouter;