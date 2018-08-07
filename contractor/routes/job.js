const express = require('express');
const router = express.Router();
const Jobs = require("../models/job.model");
const {jwt_middleware} = require('../middleware/jwt.middleware');
const {jobController} = require('../controllers/job.controller')

// create the details
router.post('/job',jwt_middleware,jobController)

module.exports = router;
