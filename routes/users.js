var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var userController = require('../controllers/userController');
var multer = require('multer');
var upload = multer({ dest: './public/uploads/', rename: function(fieldname, filename){
  return filename.replace(/\W+/g, '-').toLowerCase() + Date.now()
}});


//Register
router.get('/register', function(req, res){
    res.render('register', {errors:[]});
});

router.get('/login', function(req, res){
    res.render('login');
});

//Register User
router.post('/register', userController.registerUser);


passport.use(new LocalStrategy(function(username, password, done) 
{
    userController.getUserByUsername (username, function(err, user)
    {
        if(err)throw err;
        if(!user)
        {
            return done(null, false, {message: 'Username entered is incorrect. Please make sure of it and try again or register if you do not have an account'});
        }

        userController.comparePassword(password, user.password, function(err, isMatch)
        {
                if(err)throw err;
                if(isMatch){
                    return done(null, user);
                }else {
                    return done(null, false, {message: "Incorrect password entered"});
                }
        });
    }); 
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  userController.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/portfolios/myportfolio');
  });

router.get('/logout', function(req, res){
    req.logout();
    req.flash('success_msg','You logged out');

    res.redirect('/users/login');
});


//router.post('/add_link', studentController.add_link);
//router.post('/add_screenshot', upload.single('photo'), studentController.add_screenshot);




module.exports = router;