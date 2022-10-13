const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
var cors = require('cors')
require('dotenv').config()
var error = require('./core/middlewares/error');
/*require('./utilities/errorLogsHandling')(); */
require('./database/connect')();

var app = express();

app.use(bodyParser.json({limit: '50mb'}));
  
app.use(bodyParser.urlencoded({
    limit: '50mb',
    parameterLimit: 100000,
    extended: true 
}));

app.use(cors())
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// Root URL
app.get('/',function(req,res){
    res.send('All Set');
}) 
// Routes
// =============================================================
require("./routes/front.routes")(app)
require("./routes/admin.routes")(app)

app.use(error);//Error Handler

module.exports = app;
