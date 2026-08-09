const express = require('express');
const { getAllJobs } = require('../controllers/jobController');
const jobRouter = express.Router();
jobRouter.get('/', getAllJobs);
module.exports = jobRouter;