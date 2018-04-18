var jwt = require('jsonwebtoken');
var settings = require('../../settings');

var accessTokenCheck = (req, res, next) => {
    if (!req.body.accessToken) {
        res.status(400).json({
            success: 0,
            message: "You must provide accessToken"
        });
    } else {
        next();
    }
};

var generateAndSendToken = (req, res, next) => {
    var user = req.user;
    var token = jwt.sign({
       _id: user._id,
       firstName: user.firstName,
       lastName: user.lastName,
       role: user.role
    }, settings.superSecret, { expiresIn: settings.userTokenExpireTimeInSecs });

    res.json({
        success: 1,
        message: "Logged in successfully",
        accessToken: token
    });
};

module.exports = { generateAndSendToken, accessTokenCheck };