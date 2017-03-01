var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost/portfoliosapp');

var db = mongoose.connection;

//username Schema
var UserSchema = mongoose.Schema({
    username: {
        type:String, 
        index: true
    },
    password: {
        type:String
    },
    email: {
        type: String
    },
    name: {
        type: String
    }
});

var user = module.exports = mongoose.model('user', UserSchema);

module.exports.createUser = function(newUser, callback){
    bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}
