const winston = require('winston');

module.exports = function (err, req, res, next) {
    
    winston.error(err.message, err);
    res.status(401).send(err.message);    
}