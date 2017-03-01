let User = require('../models/user');
var bcrypt = require('bcryptjs');

let userController = {
    
    registerUser:function(req, res)
    {
        var name= req.body.name;
        var email= req.body.email;
	    var username = req.body.username;
	    var password = req.body.password;
	    var password2 = req.body.password2;

	    // Validation
	    req.checkBody('name', 'Name is required').notEmpty();
        req.checkBody('email', 'Email is required').notEmpty();
        req.checkBody('username', 'Username is required').notEmpty();
        req.checkBody('password', 'Password is required').notEmpty();
        req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

        var errors = req.validationErrors();

        if(errors)
        {
            res.render('register',{errors:errors});
        }
        else
        {
            var newUser = new User ({
                name: name,
                email: email,
                username: username,
                password: password
                });

            User.createUser(newUser, function(err, user)
            {
                if (err)throw err;
                console.log(user);
            });

            req.flash('success_msg','You registered successfully! you can easily login to start creating your own portfolio');
            
            res.redirect('/users/login');
            //next();
         }
    },

    getUserByUsername: function(username, callback)
    {
        var query = {username: username};
        User.findOne(query, callback);
    },

    getUserById: function(id, callback)
    {
        User.findById(id, callback);
    },

    comparePassword: function(password, hash, callback)
    {
        bcrypt.compare(password, hash, function(err, isMatch) {
    	    if(err) throw err;
    	    callback(null, isMatch);
	    });
    },

    checkAuthentication:function(req, res, next)
    {
        if(req.isAuthenticated())
        {
            return next();
        }
        else
        {
            res.redirect('/users/login');
        }

    }
}

module.exports = userController;