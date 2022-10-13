'use strict';
var mongoose = require('mongoose');
var sha1 = require('sha1');
var md5 = require('md5');
var adminUserSchema = new mongoose.Schema(
    {
        first_name: { 
            type: String, 
            trim:true 
        },
        last_name: { 
            type: String, 
            trim:true 
        },        
        email: { 
            type: String, 
            trim:true 
        },
        password: { 
            type: String 
        },       
        salt_key: { 
            type: String 
        },
        profile_pic: {
            type: String
        },        
        is_active:{
            type: Boolean,        
            default: true
        },                     
        auth_token:{ 
            type: String 
        },
        reset_password_token:{ 
            type: String 
        }        
    },
    {
        timestamps: true,
    },
);

//pre save hook on mongodb
adminUserSchema.pre('save', async function save(next) {
    if (!this.isModified('password')) return next();
    try {  
        const salt = await sha1(`${this.email}${this.created_at}`) 
        const password = await md5(`${this.password}`) 
        this.password = await md5(`${password}${salt}`) 
        this.salt_key = salt;
        return next();
    } catch (err) {
        return next(err);
    }
});

adminUserSchema.methods.passwordCompare = async function (saltKey, savedPassword, requestedPassword) {

  
    const password = await md5(`${requestedPassword}`)
    const encryptedPassword = await md5(`${password}${saltKey}`)   
    return (encryptedPassword == savedPassword)?true:false    
}

adminUserSchema.methods.generateToken = async function (saltKey) {

  
    return md5(saltKey);  
}

adminUserSchema.methods.generateResetPasswordToken = async function (saltKey) {

  
    return md5(`${saltKey}-${new Date()}`);  
}

adminUserSchema.methods.encryptPassword = async function (userData, password) {
    const MD5Password = await md5(`${password}`) 
    const encryptedPassword = await md5(`${MD5Password}${userData.salt_key}`)    
    return encryptedPassword;  
}
let Admin = mongoose.model('Admin', adminUserSchema)
module.exports = {Admin, adminUserSchema}