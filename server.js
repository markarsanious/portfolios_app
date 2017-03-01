// add dependencies
var express = require('express');
var bodyParser = require('body-parser');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var exphbs = require('express-handlebars');
var ejs = require('ejs');
var expressLayouts = require('express-ejs-layouts');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');


//mongoose.connect('mongodb://localhost/portfoliosapp');

//var db = mongoose.connection;


//routing folders
var routes = require('./routes/index');
var users = require('./routes/users');
var portfolios = require('./routes/portfolios');

//Init App
var app = express();

//View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');
 
app.use(expressLayouts);

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser({uploadDir: path.join(__dirname, '/public')}));
app.use(cookieParser());


// Set static folder to public
app.use('/',express.static(__dirname + "/public"));
//app.use(express.static(__dirname + "/public/student_page.html"));
//app.use(express.static(__dirname + "/public/client_page.html"));
//app.use(express.static(__dirname + "/public/visitor_page.html"));
//app.use(require('./app/routes.js'));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

//Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//Connecting flash
app.use(flash());


// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});


app.use('/', routes);
app.use('/users', users);
app.use('/portfolios',portfolios);


// start server
app.listen(3000, function(){
    console.log("The app is listening on port 3000")
})