var mongoose = require('mongoose');

//Portfolio Schema
var PortfolioSchema = mongoose.Schema({
    name: {
        type:String, 
        index: true
    },
    picture: {
        type:String
    },
    screenshot: {
        type: Array
    },
    url: {
        type: Array
    }, 
    description: {
        type:String
    }
});

var portfolio = module.exports = mongoose.model('portfolio', PortfolioSchema);

