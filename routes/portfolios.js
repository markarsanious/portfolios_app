var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController');
var multer = require('multer');
var upload = multer({ dest: './public/uploads/', rename: function(fieldname, filename){
    console.log(filename)
  return filename.replace(/\W+/g, '-').toLowerCase() + Date.now()
}});

var portfolioController = require('../controllers/portfolioController');

router.get('/', portfolioController.getAllPortfolios);

router.post('/',portfolioController.searchportfolios);

router.get('/create', portfolioController.checkAuthentication,function(req, res){
    res.render('createportfolio',{errors:[]});
});

//Create Portfolio
router.post('/create', upload.any(), portfolioController.createPortfolio);
   
router.get('/addWork', userController.checkAuthentication, function(req, res){
    res.render('addWork');
});   

router.post('/addWork', upload.single('screenshot'), portfolioController.addWork);

router.get('/myportfolio', portfolioController.viewmyportfolio);


module.exports = router;