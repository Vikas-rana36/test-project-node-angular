const mongoose = require('mongoose');
const winston = require('winston'); //logging library

module.exports = function () {
   
    
    const db_name = process.env.DB_NAME  
    const db_user = process.env.DB_USER  
    const db_pass = process.env.DB_PASS  
    
    conn_str = `mongodb://localhost/${db_name}`;

  
    mongoose.connect(conn_str, {  useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { 
        // if all is ok we will be here
        console.log(`Connected to ${conn_str} `); 
        winston.info(`Connected to ${conn_str} `)
    })
    .catch(err => { 
        // we will not be here...
        console.error('App starting error:', err);  
        winston.error(err.message, err);
        process.exit(1);
    });
    
}