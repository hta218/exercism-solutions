var express = require('express');
var authRouter = require('./auth');
var { authFilter } = require('../middleware/auth-filter');
var router = express.Router();

// Sub-routers
var dummyRouter = require('./dummy');
var hotelRouter = require('./hotel');

router.use('/auth', authRouter);
router.use('/dummy', dummyRouter);

router.use(authFilter);

router.use('/hotels', hotelRouter);

module.exports = router;