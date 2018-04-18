var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    lastName: String,
    firstName: String,
    role: {
        type: String,
        enum: [
            "CUSTOMER",
            "HOTEL_OWNER",
            "GAR_MANAGER",
            "GAR_ADMIN"
        ]
    },
    facebookProvider: {
        type: {
            id: String,
            acessToken: String
        },
        select: false
    },
    googleProvider: {
        type: {
            id: String,
            accessToken: String
        },
        select: false
    },
    emailProvider: {
        type: {
            username: String,
            passwordHash: String
        },
        select: false
    }
});


userSchema.statics.findOrSave = function (query, dataToSave, done) {
    var UserModel = this;

    UserModel.findOne(query, (err, foundUser) => {
        if (err || foundUser) {
            done(err, foundUser);
        } else if (!foundUser) {
            var newUser = new UserModel(dataToSave);
            newUser.save((err, savedUser) => {
                done(err, savedUser);
            });
        }
    });
};

module.exports = mongoose.model("user", userSchema);