var express = require('express');

var router = express.Router();

var fbRouter = require('./fb');
var ggRouter = require('./gg');

router.use('/facebook', fbRouter);
router.use('/google', ggRouter);

module.exports = router;