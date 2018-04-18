// Reference: https://codeburst.io/node-js-rest-api-facebook-login-121114ee04d8
//            https://github.com/GenFirst/angular2-node-fb-login

// Graph Explorer: https://developers.facebook.com/tools/explorer/
// Facebook apps: https://developers.facebook.com/apps

var express = require('express');
var passport = require('passport');

var FacebookTokenStrategy = require('passport-facebook-token');

var common = require('./common');
var User = require("../../models/user");

var router = express.Router();

passport.use(new FacebookTokenStrategy({
        clientID: "759754417562611",
        clientSecret: "dbf29d470e750d5131ec6169ece05924",
        accessTokenField: "accessToken"
    },
    (accessToken, refreshToken, profile, done) => {
        // Note: This function is called only when Facebook Oauth is successful
        var lastName = profile._json.last_name;
        var firstName = profile._json.first_name;
        var facebookID = profile.id;

        var query = {
            "facebookProvider.id": facebookID
        };
        
        var dataToSave = {
            lastName,
            firstName,
            role: "CUSTOMER", // TODO: Differentiate 
            facebookProvider: {
                id: facebookID,
                accessToken
            }
        };

        User.findOrSave(query, dataToSave, done);
}));

var authenticate = (req, res, next) => {
    passport.authenticate('facebook-token', (err, user) => {
        if (err) {
            var code = 401;
            if (err.oauthError) {
                // If facebook has error code, use it instead
                code = err.oauthError.statusCode;
            }
            res.status(code).json({
                success: 0,
                message: "Authentication problem",
                error: err 
            });
        } else {
            req.user = user;
            next();
        }
    })(req, res, next);
};

/**
 * 
 * @api {post} /api/auth/facebook Login with Facebook
 * @apiGroup Authentication
 * @apiVersion  1.1.0
 * 
 * @apiParam  {String="https://developers.facebook.com/tools/explorer/"} accessToken Access token provided by facebook app
 * @apiParamExample {json} Request body
 *  {
        "accessToken" : "EAAKyZChws4ZCMBAM93wRNZBBGZCKD3drDU6DK4GH9VepZCkFqi7D0PQf0yx3tAVOwLcT2vmeMDdLnmDDGFloTfwMcCoZCdJC60hoEQTYFAcbJn2AUFECiC75AeiSaEz01fRgrt5yi89ZAbSQu6L9ZAZBNZB8W0XsWAOvYy6tpsZB2o4aSQlc8uLoAvT"
 *  }
 * 
 * @apiSuccess {Number} success Success-state
 * @apiSuccess {String} message Api-message
 * @apiSuccess {String} accessToken Token signed by user-infor + fb-token + access-token
 * 
 * @apiSuccessExample {json} Success
 *  HTTP 200 OK
 *  {
        "success": 1,
        "message": "Logged in successfully",
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YWM1ZjU5NWMxN2YxMTE1ZmM0MmI3MGQiLCJmaXJzdE5hbWUiOiJUdeG6pW4gQW5oIiwibGFzdE5hbWUiOiJIdeG7s25oIiwicm9sZSI6IkNVU1RPTUVSIiwiaWF0IjoxNTIzMDA1NDA4LCJleHAiOjE1MjM2MTAyMDh9.UCvbrD710Rr-yBEnr4P21nXVC1vvvsnqsIZuN8Kun5U"
 *  } 
 * 
 * @apiErrorExample {json} AccessToken not provided
 *  HTTP 400 Bad Request "You must provide accessToken"
 *
 * @apiErrorExample {json} Access token invalid
 *  HTTP 400 Bad Request "Authentication problem"
 *
 */
router.post('/', common.accessTokenCheck, authenticate, common.generateAndSendToken);

module.exports = router;