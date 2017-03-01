var express = require('express');
var router = express.Router();
var portfolioController = require('../controllers/portfolioController');
var userController = require('../controllers/userController');
var multer = require('multer');
var upload = multer({ dest: './public/uploads/', rename: function(fieldname, filename){
  return filename.replace(/\W+/g, '-').toLowerCase() + Date.now()
}});


router.get('/', function(req, res){
    res.render('index');
});

module.exports = router;