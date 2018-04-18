var jwt = require('jsonwebtoken');
var { superSecret } = require('../settings');

const authFilter = (req, res, next) => {
    var token = req.body.accessToken || req.query.accessToken || req.headers['x-access-token'];
    if (token) {
        
        jwt.verify(token, superSecret, (err, decoded) => {
            // 401: unauthorialized
            if (err) {
                res.status(401).json(
                    {success: 0, message: "Token authenticate failed"}
                );
            } else {
                req.user = decoded._doc;
                next();
            }
        });
    } else {
        res.status(401).json({
            success: 0,
            message: "No token provided"
        });
    }
}

module.exports = { authFilter };