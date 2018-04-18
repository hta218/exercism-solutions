// References:
// Console Google App: https://console.developers.google.com/project/apps
// Oath Client: https://developers.google.com/identity/protocols/OAuth2UserAgent

// Scope: https://developers.google.com/identity/protocols/googlescopes

// https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/plus.me&access_type=offline&redirect_uri=http://techkids.vn&response_type=code&client_id=679313125285-oagj6fuf0dl0bgil9ddjsab256043ruf.apps.googleusercontent.com
// => http://techkids.vn/?code=4%2FAACj1RvzQpESGbZrYEzKit6iEIvYezMC_PkAgZOkKi-QwllQcnnLJlnBjgkWA0l59Ikz-6NZrTF8ATTeJ4JLuQ4


var express = require('express');
var passport = require('passport');
var GoogleTokenStrategy = require('passport-google-plus-token');

var common = require('./common');
var User = require('../../models/user');

var router = express.Router();

passport.use(new GoogleTokenStrategy({
    clientID: "679313125285-3upo68dadbichqerdg41tfr7keel292f.apps.googleusercontent.com",
    clientSecret: "RBmjnZDw6rj8zJwoX-GEtMOB",
    callbackURL: "http://techkids.vn",
    accessTokenField: "accessToken"
},
(accessToken, refreshToken, profile, done) => {
    // Note: This function is called only when Google Oauth is successful
    var firstName = profile.name.givenName;
    var lastName = profile.name.familyName;
    var googleId = profile.id;
    
    var query = { "googleProvider.id": googleId };
    var dataToSave = {
        firstName,
        lastName,
        googleProvider: {
            id: googleId,
            accessToken
        }
    };

    User.findOrSave(query, dataToSave, done);
}));

var authenticate = (req, res, next) => {
    passport.authenticate("google-plus-token", (err, user) => {
        if (err) {
            var code = 401;
            if (err.oauthError) {
                // If Google Oath return error code, use it instead
                code = err.oauthError;
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
 * @api {post} /api/auth/google Login with Google
 * @apiGroup Authentication
 * @apiVersion  1.1.0
 * 
 * @apiParam  {String="https://developers.facebook.com/tools/explorer/"} accessToken Access token provided by google app
 * @apiParamExample {json} Request body
 *  {
        "accessToken" : "EAAKyZChws4ZCMBAM93wRNZBBGZCKD3drDU6DK4GH9VepZCkFqi7D0PQf0yx3tAVOwLcT2vmeMDdLnmDDGFloTfwMcCoZCdJC60hoEQTYFAcbJn2AUFECiC75AeiSaEz01fRgrt5yi89ZAbSQu6L9ZAZBNZB8W0XsWAOvYy6tpsZB2o4aSQlc8uLoAvT"
 *  }
 * 
 * @apiSuccess {Number} success Request status
 * @apiSuccess {String} message Request message
 * @apiSuccess {String} accessToken Token signed by user-infor + gg-token + access-token
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
router.post("/", common.accessTokenCheck, authenticate, common.generateAndSendToken);

module.exports = router;