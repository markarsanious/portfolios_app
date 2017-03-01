let Portfolio = require('../models/portfolio');

let portfolioController = {
    
    getAllPortfolios:function(req, res){
        
        Portfolio.find(function(err, portfolios){
            
            if(err)
            {
               res.send(err.message);
               // res.render('portfolios',{portfolios:[]});
            }
            else
                res.render('portfolios', {portfolios:portfolios});
        })
    },
   
    createPortfolio: function(req, res){
        
        var name= req.body.name;
        var picture= req.body.picture;
	    var screenshot = req.body.screenshot;
	    var url = req.body.url;
        var description = req.body.description;

	    // Validation
	    req.checkBody('name', 'Name is required').notEmpty();
        console.log(req.user.name);
        req.checkBody('name', 'Your portfolio name must be as your account name').equals(req.user.name);
        
        var errors = req.validationErrors();
        if(req.files){
        req.files.forEach(function(file)
        {
            if(file.fieldname === 'picture')
            {
                req.body.picture = '/uploads/' + file.filename;
            }
            else
            {
                req.body.screenshot ='/uploads/' + file.filename;
            }

        });

    }
    
        if(errors)
        {
             res.render('createportfolio',{
                 errors:errors
            });
        }
        else if(!req.body.screenshot && !req.body.url)
        {
            
            console.log('stop');

            req.flash('error_msg','You must at least add one work to create your profile!');
            res.redirect('/portfolios/create');
        }
        else
        {    
            let portfolio = new Portfolio(req.body);
            

            portfolio.save(function(err, portfolio)
            {
                if(err)
                {
                    res.send(err.message)
                    console.log(err);
                }   
                else
                {
                    console.log(portfolio);
                    req.flash('success_msg','You portfolio was successfully created! ');
                    res.redirect('/');
                }
            })
              
        }
       
    },

    checkAuthentication:function(req, res, next)
    {
        if(req.isAuthenticated())
        {
            return next();
        }
        else
        {
             //   req.flash('error_msg','You are not logged in');
            res.redirect('/users/login');
        }

    },

    add_url: function(req, res)
    {
        var query = {name: req.user.name};
        var portfolio_id ;
        Portfolio.findOne(query, function(err,portfolio){
            if(err)throw err;
            portfolio_id = portfolio.id;
            console.log(portfolio_id);
            Portfolio.findByIdAndUpdate(portfolio_id, {
            $push: {"url": req.body.url}
        }, {safe: true, upsert:true, new: true}, function(err, portfolio){
            console.log(portfolio);
        });

        });
        
        
    },

        add_screenshot: function(filename, req, res)
    {
        var query = {name: req.user.name};
        var portfolio_id ;
        Portfolio.findOne(query, function(err,portfolio){
            if(err)throw err;
            portfolio_id = portfolio.id;

            var path_to_image ='/uploads/' + filename;
            console.log(portfolio_id, req.body);
            Portfolio.findByIdAndUpdate(portfolio_id, {
            $push: {"screenshot": path_to_image}
        }, {safe: true, upsert:true, new: true}, function(err, portfolio){
            if (err) 
            {
                console.log(err.msg);
            }
            console.log(portfolio);

            });

        });
        
    },
    
    addWork: function(req, res) 
    {
        console.log(req.body);
        if(!req.file && !req.body.url)
        {
            req.flash('error_msg', 'no work was chosen to be added! Please add a link or a screenshot!');
            res.redirect('/portfolios/addWork');
        }
        else 
        {

            if(req.file)
            {
                var filename= req.file.filename;

                portfolioController.add_screenshot(filename, req, res);
                req.flash('success_msg', 'the screenshot has been added to your portfolio')

            }
            if(req.body.url)
            {
                portfolioController.add_url(req,res);
                req.flash('success_msg', 'the link has been added to your portfolio')
            }

            res.redirect('/');
        }
    },
    viewmyportfolio: function(req, res)
    {
        var query = {name: req.user.name};
        Portfolio.findOne(query, function(err,portfolio){
            if(err)throw err;
            res.render('myportfolio', {portfolio:portfolio});
            
        });
        
    },
    searchportfolios: function(req, res)
    {
        if(req.body.searchname)
        {
            var query= {name : { $regex: req.body.searchname, $options: "i"}};
            Portfolio.find(query, function(err,portfolios){
                if(err)throw err;
                res.render('portfolios', {portfolios:portfolios});
            });
        }
        else if(req.body.searchdescription)
        {
             var query= {description : { $regex: req.body.searchdescription, $options: "i"}};
            Portfolio.find(query, function(err,portfolios){
                if(err)throw err;
                res.render('portfolios', {portfolios:portfolios});
            });
        }
    }
}



module.exports = portfolioController;