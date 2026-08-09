const express = require('express');
const authRouter = require('./routes/authRouter');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use('/api/v1/auth', authRouter);
module.exports = app;