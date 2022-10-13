'use strict';
var mongoose = require('mongoose')
, Schema = mongoose.Schema
var sha1 = require('sha1');
var md5 = require('md5');
var userSchema = new mongoose.Schema(
    {
        first_name: { 
            type: String, 
            trim:true 
        },
        last_name: { 
            type: String, 
            trim:true 
        },
        gender: { 
            type: String
        },//set default value
        country: {
            type: String
        },    
        email: { 
            type: String, 
            trim:true 
        },
        password: { 
            type: String 
        },
        dob: {
            type: Date
        },
        weight: {
            type: Number
        },
        height: {
            type: Number
        },
        otp: {
            type: Number
        },
        bmi: {
            type: Number
        }, 
        confirm_password: { 
            type: String 
        }, 
        org_id: { 
            type: Schema.Types.ObjectId, 
            ref: 'Organization' 
        },
        salt_key: { 
            type: String 
        },        
        is_active:{
            type: Boolean,        
            default: true
        },
        is_verified:{
            type: Boolean,     
            default: false
        },
        is_deleted: {
            type: Boolean,
            default: false
        },
        is_approved_by_admin:{
            type: Boolean,
            default: false
        },
        device_data:{
            type: String,
        },
        auth_token:{ 
            type: String 
        },
        reset_password_token:{ 
            type: String 
        }, 
        role_id: {
            type: String,
            ref: "role",
        },  
        category_id:{
            type: Array,
            ref: "category",
		},
    },
    {
        timestamps: true,
    },
);

//pre save hook on mongodb
userSchema.pre('save', async function save(next) {
    if (!this.isModified('password')) return next();
    try {  
        const salt = await sha1(`${this.email}`)
        if(salt){
            this.password = await md5(`${this.password}${salt}`) 
            this.salt_key = salt;
            return next();
        }  
    } catch (err) {
        return next(err);
    }
});

userSchema.methods.passwordCompare = async function (saltKey, savedPassword, requestedPassword) {

    const encryptedPassword = await md5(`${requestedPassword}${saltKey}`)   
    return (encryptedPassword == savedPassword)?true:false    
}

userSchema.methods.generateToken = async function (saltKey) {

  
    return md5(saltKey);  
}

userSchema.methods.generateResetPasswordToken = async function (saltKey) {

  
    return md5(`${saltKey}-${new Date()}`);  
}

userSchema.methods.encryptPassword = async function (userData, password) {

    const salt = await sha1(`${userData.email}${userData.created_at}`) 
    const MD5Password = await md5(`${password}`) 
    const encryptedPassword = await md5(`${MD5Password}${salt}`)    
    return encryptedPassword;  
}
let Usertemp = mongoose.model('Usertemp', userSchema)
//module.exports.User =  mongoose.model('User', userSchema);
module.exports = {Usertemp, userSchema}