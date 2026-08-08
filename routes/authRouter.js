const express = require('express');
const { register, login, getProfile, logout } = require('../controllers/authControllers');
const authRouter = express.Router();
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.get('/getProfile', getProfile);
authRouter.post('/logout', logout);
module.exports = authRouter;