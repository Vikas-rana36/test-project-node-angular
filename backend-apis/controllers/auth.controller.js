const _ = require('lodash'); 
require('dotenv').config()
const { User } = require('../models/user');
const { Usertemp } = require('../models/temp-user');
const { apiResponse} = require("../core/response/response")
const { SUCCESS, REDIRECTION, CLIENT_ERROR, SERVER_ERROR } = require("../core/response/statusCode")
const {ERROR_MSG, SUCCESS_MSG} = require("../core/response/messages")
const {sendEmail} = require('../core/utilities/emailService');
const {signUpTemplate, forgotPasswordTemplate} = require('../core/utilities/emailTemplates');
const userObject = new User();
const userTempObject = new Usertemp();

/*
* Here we would probably call the DB to confirm the user exists
* Then validate if they're authorized to login
* Then confirm their password
* Create a JWT or a cookie
* And finally send it back if all's good
*/
exports.login = async (req, res) => {

    // If no validation errors, get the req.body objects that were validated and are needed
    const { email, password, device_token } = req.body
    tempUser = await Usertemp.findOne({ "email": email  },{ _id:1, first_name:1, last_name:1, email: 1, role:1, salt_key:1, created_at: 1, password:1, is_active:1, profile_pic:1, auth_token:1 });
    if(tempUser) return apiResponse(res, true, [], ERROR_MSG['ACCOUNT-NOT-VERIFIED'], CLIENT_ERROR.badRequest,0, []);
    
    user = await User.findOne({ "email": email  },{ _id:1, first_name:1, last_name:1, email: 1, role:1, salt_key:1, created_at: 1, password:1, is_active:1, profile_pic:1, auth_token:1 });
    if (!user) return  apiResponse(res, true, [], ERROR_MSG['ACCOUNT-NOT-EXIST'], CLIENT_ERROR.badRequest,0, []);
    

    //checking password match
    const isValidPassword = await userObject.passwordCompare(user.salt_key, user.password, req.body.password);

    if (!isValidPassword) return apiResponse(res, true, [], ERROR_MSG['PASSWORD-MISMATCH'], CLIENT_ERROR.badRequest, 0,[]); 

    if (!user['is_active']) return apiResponse(res, true, [], ERROR_MSG['USER-NOT-ACTIVE'], CLIENT_ERROR.badRequest,0, []);  
    

   
    const token = await userObject.generateToken(user._id);//generate token
    //console.log('token',token);

    await User.findOneAndUpdate({ _id: user._id }, { $set: { auth_token: token, device_data: device_token, last_login: Date.now() } }, { new: true })

    
    let userData = _.pick(user, ['_id','first_name','last_name','email', 'auth_token', 'device_data'])
    //res.setHeader('x-sh-auth-token', token);
    //res.header('Access-Control-Expose-Headers', 'x-sh-auth-token')       
    return apiResponse(res, false, [], '', SUCCESS.OK, 0,userData);   
    
}

/*
* Here we would probably call the DB to confirm the user exists
* Then validate and save in DB
* Create a JWT or a cookie
* Send an email to that address with the URL to approve account
* And finally let the user know their email is waiting for them at their inbox
*/
exports.signup = async (req, res) => {
    var verifyOtp = Math.floor((Math.random() * 100000) + 54);
    // If no validation errors, get the req.body objects that were validated and are needed
    const { first_name, last_name, gender, dob, country, bmi, category_id, role_id, email, password } = req.body;

    //checking unique email
    let existingUser = await User.findOne(
        {email:email},
        { _id: 1 }
    );
    
    if (existingUser) return apiResponse(res, true, [], ERROR_MSG['EMAIL-ALREADY-EXIST'], CLIENT_ERROR.badRequest, 0, []);    

    //save user 
    newUser = new Usertemp(_.pick(req.body, ['first_name', 'last_name','gender', 'dob', 'country', 'weight', 'height', 'bmi','email', 'password','role_id', 'category_id', 'org_id', 'is_active', 'is_verified','salt_key', 'device_data']));


    
    newUser.save(async function (err, user) {
        
        if (err) return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, []) 

        const token = await userTempObject.generateToken(user.salt_key);//generate token
        //console.log('token',token);

        await Usertemp.findOneAndUpdate({ _id: user._id }, { $set: { auth_token: token, otp: verifyOtp} }, { new: true })
        let link = `${process.env.WEB_ENDPOINT}/verify/${user._id}/${verifyOtp}`   
       
        let templateData = signUpTemplate({link})

        const mailOptions = {
            to: user.email,           
            subject: templateData.subject,
            html: templateData.html  
	    };
		sendEmail(mailOptions, res)

        res.setHeader('x-sh-auth-token', token);
        res.header('Access-Control-Expose-Headers', 'x-sh-auth-token')   
        let userData = _.pick(user, ['_id','first_name', 'last_name','email', 'role_id','category_id', 'auth_token'])
        return apiResponse(res, false, [], '', SUCCESS.OK, 0, userData)    
        
    });



}

/*
    BMI calculation
*/
exports.bmiCalculate = async (req, res) => {
    const { weight, height } = req.body;
    const bmi = (((weight / height) / height) * 10000);
    if(bmi) return apiResponse(res, false, [], '', SUCCESS.OK, 0, [{bmi: bmi}])    
}

/*
* Here we would probably call the DB to confirm the user exists
* Then validate and save in DB
* Create a JWT or a cookie
* Send an email to that address with the URL to approve account
* And finally let the user know their email is waiting for them at their inbox
*/
exports.verify = async (req, res) => { 
    try{
    const userId = req.params.userid; 
    //checking unique email
    let existingUser = await Usertemp.findOne(
        {_id:userId},
        { otp:1 }
    );
    // if exists temp table
    if (!existingUser) return apiResponse(res, true, [], ERROR_MSG['ACCOUNT-NOT-EXIST'], CLIENT_ERROR.badRequest, 0, []);    
    
     //checking unique link
     let userLink = await User.findOne(
        {$and: [{_id:userId}, {otp: ''}]},
        { _id: 1 }
    );
    
    if (userLink) return apiResponse(res, true, [], ERROR_MSG['LINK-ALREADY-USED'], CLIENT_ERROR.badRequest, [])     
    
    // check otp and remove data from temp and insert into user table
    if(req.params.otp == existingUser.otp){
        await Usertemp.findOneAndUpdate({ _id: userId }, { $set: { is_verified: true, otp: '' } }, { new: true })                                                
        let usrtemp = await await Usertemp.find({ _id: userId });
        if(usrtemp){
            let user = await User.insertMany(usrtemp)
            if(user){
                await Usertemp.findByIdAndRemove(userId)
                //console.log("user data>>>>>>>>>>",user)
                return apiResponse(res, false, [], '', SUCCESS.OK, 0, user) 
            }
        }
    }    
}catch(err){
    console.log("catch>>>>>>",err)
    return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
}

}

/*
* Here we would probably call the DB to confirm the user exists
* Then validate and save in DB
* Create a JWT or a cookie
* Send an email to that address with the URL to change password account
* And finally let the user know their email is waiting for them at their inbox
*/
exports.forgotPassword = async (req, res) => {
    //console.log("email>>>>>>>>",req.body)

    // If no validation errors, get the req.body objects that were validated and are needed
    const { email } = req.body

   //checking email exists
   let userInformation = await User.findOne(
        {email:email},
        { _id:1, email:1, first_name:1, last_name:1 }
    );

    if (!userInformation) return apiResponse(res, true, [], ERROR_MSG['ACCOUNT-NOT-REGISTERD'], CLIENT_ERROR.badRequest, 0, []) 

    const resetPasswordToken = await userObject.generateResetPasswordToken(userInformation.salt_key);//generate reset password token 
    var forgotOtp = Math.floor((Math.random() * 100000) + 54);
    await User.findOneAndUpdate({ _id: userInformation._id }, { $set: { reset_password_token: resetPasswordToken,otp: forgotOtp, updatedAt:new Date() } }, { new: true })
    const link = `${process.env.WEB_ENDPOINT}/reset-password/${userInformation._id}`
    let fullName = `${userInformation.first_name} ${userInformation.last_name}`
    let templateData = forgotPasswordTemplate({fullName, link, forgotOtp})
    const mailOptions = {
        to: userInformation.email,  
        subject: templateData.subject,     
        html: templateData.html     
    };
    sendEmail(mailOptions, res);

    return apiResponse(res, false, [], '', SUCCESS.OK, 0, [userInformation]) 
}

/**
 * after forgot password reset password for the user
 * check user by the new token
 * update existing user password  
 * **/
exports.updatePassword = async (req, res) => {

    //console.log('req',req.body);
    // If no validation errors, get the req.body objects that were validated and are needed
    const { password }  = req.body
    const userId = req.params.userid
    const forgotOtp = req.params.otp
    //checking unique email
    let existingUser = await User.findOne(
        {_id:userId},
        { _id: 1, password:1, email:1, otp:1, salt_key:1 }
    );
    
    if (!existingUser) return apiResponse(res, true, [], ERROR_MSG['ACCOUNT-NOT-REGISTERD'], CLIENT_ERROR.badRequest, [])     
    
    //checking unique link
    let userLink = await User.findOne(
        {$and: [{_id:userId}, {otp: ''}]},
        { _id: 1 }
    );
    
    if (userLink) return apiResponse(res, true, [], ERROR_MSG['LINK-ALREADY-USED'], CLIENT_ERROR.badRequest, [])     
    
    const encryptedPassword = await userObject.encryptPassword(existingUser, password);//encrypted password
    if(encryptedPassword == existingUser.password){
        return apiResponse(res, true, [], ERROR_MSG['USE-ANOTHER-PASSWORD'], CLIENT_ERROR.badRequest,0, []) 
    }
    if(existingUser.otp == forgotOtp){
        console.log("encryptedPassword>>>>>>>>>>>>>",encryptedPassword)
        await User.findOneAndUpdate({ email: existingUser.email }, { $set: { password: encryptedPassword, updatedAt:new Date(), otp:'' } }, { new: true })
        return apiResponse(res, true, [], '', SUCCESS.OK, 0,[{"id":existingUser._id, "email": existingUser.email}]) 
    }else{
        return apiResponse(res, true, [], ERROR_MSG['LINK-ALREADY-USED'], CLIENT_ERROR.badRequest,0, []) 
    }
}