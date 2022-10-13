const _ = require('lodash'); 
require('dotenv').config()
const mongoose = require("mongoose");
const { Admin } = require('../../models/admin/admin');
const {sendEmail} = require('../../core/utilities/emailService');
const { apiResponse} = require("../../core/response/response")
const { SUCCESS, REDIRECTION, CLIENT_ERROR, SERVER_ERROR } = require("../../core/response/statusCode")
const {ERROR_MSG, SUCCESS_MSG}= require("../../core/response/messages")
const {forgotPasswordTemplateAdmin} = require('../../core/utilities/emailTemplates');
const adminUserObject = new Admin();

exports.login = async (req, res) => {

    // If no validation errors, get the req.body objects that were validated and are needed
    const { email, password } = req.body

    let adminInformation = await Admin.findOne({ "email": email  },{ first_name: 1, last_name: 1, email: 1,salt_key:1, created_at: 1, password:1, is_active:1})

    if (!adminInformation) return  apiResponse(res, true, [], ERROR_MSG['ACCOUNT-NOT-EXIST'], CLIENT_ERROR.badRequest,0, []);
    

    //checking password match
    const isValidPassword = await adminUserObject.passwordCompare(adminInformation.salt_key, adminInformation.password, req.body.password);

    if (!isValidPassword) return apiResponse(res, true, [], ERROR_MSG['PASSWORD-MISMATCH'], CLIENT_ERROR.badRequest, 0,[]); 

    if (!adminInformation['is_active']) return apiResponse(res, true, [], ERROR_MSG['USER-NOT-ACTIVE'], CLIENT_ERROR.badRequest,0, []);  
    

   
    const token = await adminUserObject.generateToken(adminInformation.salt_key);//generate token
    //console.log('token',token);

    await Admin.findOneAndUpdate({ _id: adminInformation._id }, { $set: { auth_token: token } }, { new: true })

    
    let userData = _.pick(adminInformation, ['_id','first_name','last_name','email','is_active'])
    res.setHeader('x-sh-auth-token', token);
    res.header('Access-Control-Expose-Headers', 'x-sh-auth-token')   
    
    return apiResponse(res, false, [], '', SUCCESS.OK, 0, userData);   
    
}

exports.forgotPassword = async (req, res) => {

    // If no validation errors, get the req.body objects that were validated and are needed
    const { email } = req.body

   //checking unique email
   let adminInformation = await Admin.findOne(
        {email:email},
        { email:1, first_name:1, last_name:1 }
    );

    if (!adminInformation) return apiResponse(res, true, [], ERROR_MSG['ACCOUNT-NOT-REGISTERD'], CLIENT_ERROR.badRequest, 0, []) 

    const resetPasswordToken = await adminUserObject.generateResetPasswordToken(adminInformation.salt_key);//generate reset password token 

    await Admin.findOneAndUpdate({ email: adminInformation.email }, { $set: { reset_password_token: resetPasswordToken, updatedAt:new Date() } }, { new: true })

    const link = `${process.env.WEB_ENDPOINT_ADMIN}/reset-password/${resetPasswordToken}`
    let fullName = `${adminInformation.first_name} ${adminInformation.last_name}`
    let templateData = forgotPasswordTemplateAdmin({fullName, link})
    const mailOptions = {
        to: adminInformation.email,  
        subject: templateData.subject,     
        html: templateData.html     
    };
    sendEmail(mailOptions, res);

    return apiResponse(res, false, [], '', SUCCESS.OK, 0, [adminInformation]) 
}

exports.updatePassword = async (req, res) => {

    //console.log('req',req.body);
    // If no validation errors, get the req.body objects that were validated and are needed
    const { token, password } = req.body

    //checking unique email
    let existingUser = await Admin.findOne(
        {reset_password_token:token},
        { _id: 1, email:1, password:1, salt_key:1, createdAt:1 }
    );
    
    if (!existingUser) return apiResponse(res, true, [], ERROR_MSG['ACCOUNT-NOT-REGISTERD'], CLIENT_ERROR.badRequest, [])     
   
    const encryptedPassword = await adminUserObject.encryptPassword(existingUser, password);//encrypted password

    if(encryptedPassword == existingUser.password){
        return apiResponse(res, true, [], ERROR_MSG['USE-ANOTHER-PASSWORD'], CLIENT_ERROR.badRequest,0, []) 
    }
    
    await Admin.findOneAndUpdate({ email: existingUser.email }, { $set: { password: encryptedPassword, updatedAt:new Date(), reset_password_token:'' } }, { new: true })

    return apiResponse(res, false, [], '', SUCCESS.OK, 0,[existingUser]) 
}


exports.adminInfo = async (req, res) => {
    const { userID } = req.body
    
    let condition = {}
    condition['_id'] = mongoose.Types.ObjectId(userID);
    
    //checking unique email
    let adminInformation = await Admin.findOne(
        condition
    );    
   
    if (!adminInformation) return  apiResponse(res, true, [], ERROR_MSG['ACCOUNT-NOT-EXIST'], CLIENT_ERROR.badRequest, 0, []);
        
    return apiResponse(res, false, [], '', SUCCESS.OK, 0, adminInformation);   
}

exports.updateAdmin = async (req, res) => {
    // If no validation errors, get the req.body objects that were validated and are needed
    const { id, name } = req.body
    if (_.has(req.body, ['id']) && (req.body.id)!=null){ 

        let condition = {}
        condition['_id'] = mongoose.Types.ObjectId(id);

        //checking record exist
        let record = await Admin.findOne(condition, { _id: 1 } );      
        if (!record) return apiResponse(res, true, [], ERROR_MSG['NO-RECORD-FOUND'], CLIENT_ERROR.badRequest, 0, []);
        //update Admin info 
        Admin.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.body.id) }, { $set: req.body }, { new: true }, function (err, admin) {
            
            if (err) return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
                
            return apiResponse(res, false, [], '', SUCCESS.OK, 0, [admin])  
            
        });
    }    
}

exports.changePassword = async (req, res) => {
    // console.log('req body',req.body);
    //  If no validation errors, get the req.body objects that were validated and are needed
    const { id, oldPassword, Password } = req.body
    //checking unique email
    let existingUser = await Admin.findOne(
        {_id:mongoose.Types.ObjectId(id)},
        { _id: 1, email:1, password:1, salt_key:1, createdAt:1 }
    );

    if (!existingUser) return apiResponse(res, true, [], ERROR_MSG['ACCOUNT-NOT-REGISTERD'], CLIENT_ERROR.badRequest, [])     
   
    const encryptedOldPassword = await adminUserObject.encryptPassword(existingUser, oldPassword);//encrypted password
    if(encryptedOldPassword != existingUser.password){
        return apiResponse(res, true, [], ERROR_MSG['OLD-PASSWORD-NOT-MATCHED'], CLIENT_ERROR.badRequest,0, []); 
    } 

    const encryptedPassword = await adminUserObject.encryptPassword(existingUser, Password);//encrypted password

    if(encryptedPassword == existingUser.password){
        return apiResponse(res, true, [], ERROR_MSG['USE-ANOTHER-PASSWORD'], CLIENT_ERROR.badRequest,0, []) 
    }
    
    await Admin.findOneAndUpdate({ email: existingUser.email }, { $set: { password: encryptedPassword, updatedAt:new Date() } }, { new: true })

    return apiResponse(res, false, [], '', SUCCESS.OK, 0,[existingUser])
}