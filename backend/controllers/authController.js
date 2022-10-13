"use strict";
const moment = require('moment'); // require
const Token = require("../models/tokenModel");
const {sendEmail} = require('../core/utilities/emailService');
const {Otp} = require("../models/otpModel");
const {User} = require("../models/userModel");
const {Email} = require("../models/emailsModel");
const config = require('config')
const {errorResponse, successResponse} = require("../core/utilities/response")
//const validateForm = require("../core/middleware/validateForm")
const Subcription = require("../models/admin/subscription")
const Payment = require("../models/subscriptionPayment")
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const {ERROR, SUCCESS} = require("../core/utilities/messages")
const statusCode = require("../core/utilities/statusCode");
//const { use } = require('../routes/userRoutes');
//const userController = {
	//Function to register the user.
	const dataEmpty = config.get('dataEmpty'); 
	const emptyValidationsErrors = config.get('emptyValidationsErrors'); 
	//const fromMail = config.get('fromMail');
	const signUpLinkSubject = config.get('linkSubject'); 
	const approveAccountUrl = config.get('approveAccountUrl'); 

	const signUp = async (req, res) => {
		try {
		    const { first_name, last_name, gender, dob, bmi, category_id, role_id, email, password } = req.body;
			const user = await User.findOne({email: email});
			if (user) {
			errorResponse(ERROR.errorBoolean, emptyValidationsErrors, ERROR.emailExist, statusCode.CODES.CLIENT_ERROR.valueAlreadyExist, dataEmpty, res);
		   exit() 
		}
			const currentData = moment()
            const birthDate = moment(dob, 'YYYY/MM/DD');
		    var age = currentData.format('YYYY') - birthDate.format('YYYY')
			const m = currentData.format('MM') - birthDate.format('MM');
			if (m < 0 || (m === 0 && today.format('DD') < birthDate.format('DD'))){
				age--
			}
		    age;
			const hash = await bcrypt.hash(password, saltRounds);
 			//Saving user.
			const newUser = new User({
				first_name, last_name, gender, age, dob, bmi, category_id, role_id, email, password: hash
			});
            await newUser.save();


	    	const mailOptions = {
			to: email,
			subject: signUpLinkSubject,
			html: `<p>Click <a href="${approveAccountUrl}/${newUser._id}">here</a> to approve your account</p>`
	       };
		   sendEmail(mailOptions, res)
		   } catch (err) {
		    errorResponse(ERROR.errorBoolean, emptyValidationsErrors, err.message, statusCode.CODES.SERVER_ERROR.internalServerError, dataEmpty, res);
			}
		}

	const approveAccount = async (req, res) => {
		try {
			const id_= req.params.id
			if(!id_){
				errorResponse(ERROR.errorBoolean, emptyValidationsErrors, ERROR.idRequired, statusCode.CODES.CLIENT_ERROR.badRequest, dataEmpty, res);
			}
			const updatestatus = await User.findOneAndUpdate({_id: id_}, {
				is_verified: true
			})
				successResponse(SUCCESS.errorBoolean, SUCCESS.accountApprove, statusCode.CODES.SUCCESS.created, dataEmpty, res);
			} catch (err) {
			errorResponse(ERROR.errorBoolean, emptyValidationsErrors, err.message, statusCode.CODES.SERVER_ERROR.internalServerError, dataEmpty, res);
			}
		}
	
	//Function to login user.
	const login = async (req, res) => {
		try {
			const { email, password, device_token } = req.body;
			console.log(device_token)
            //Finding user's email.
			const user = await User.findOne({ email });
			if (!user) {
				return errorResponse(ERROR.errorBoolean, emptyValidationsErrors, ERROR.noUser, statusCode.CODES.CLIENT_ERROR.notFound, dataEmpty, res);
			}
			if(user.is_verified === false){
			    return errorResponse(ERROR.errorBoolean, emptyValidationsErrors, ERROR.accountNotApprove, statusCode.CODES.CLIENT_ERROR.unauthorized, dataEmpty, res);
			}
			const pass = await bcrypt.compare(password, user.password)
			if (!pass) {
				return errorResponse(ERROR.errorBoolean, emptyValidationsErrors, ERROR.incorrectPass, statusCode.CODES.CLIENT_ERROR.unauthorized, dataEmpty, res);
            }
			//Creating access token.
			const accesstoken = createAccessToken({ id: user._id });
            if(accesstoken){
          	const saveToken = new Token({
	                   userId: user._id,
	                   device_token: device_token,
	                   access_token: accesstoken
                     })
					 await saveToken.save();
              } 
			   successResponse(SUCCESS.errorBoolean, SUCCESS.loginSuccess, statusCode.CODES.SUCCESS.accepted, dataEmpty, res);
		  } catch (err) {
			  errorResponse(ERROR.errorBoolean, emptyValidationsErrors, err.message, statusCode.CODES.SERVER_ERROR.internalServerError, dataEmpty, res);
		  }
		}

	//Function to logout user.
	const logout = async (req, res) => {
		try {
			const token_ = req.body.device_token
			const deletetoken = await Token.findOneAndRemove({device_token: token_})
			if(!deletetoken){
				errorResponse(ERROR.errorBoolean, emptyValidationsErrors, ERROR.noUser, statusCode.CODES.CLIENT_ERROR.notFound, dataEmpty, res);
			}
		        successResponse(SUCCESS.errorBoolean, SUCCESS.loggedOutSuccessful, statusCode.CODES.SUCCESS.OK, dataEmpty, res);
			
			} catch (err) {
				errorResponse(ERROR.errorBoolean, emptyValidationsErrors, err.message, statusCode.CODES.SERVER_ERROR.internalServerError, dataEmpty, res);
			}
		}

	const forgotPassword = async (req, res) => {
		try {
			const email = req.body.email
			const user = await User.findOne({email: email})
			if(!user){
				errorResponse(ERROR.errorBoolean, emptyValidationsErrors, ERROR.noUser, statusCode.CODES.CLIENT_ERROR.notFound, dataEmpty, res);
			exit()}
			if(user.is_verified === false){
				errorResponse(ERROR.errorBoolean, emptyValidationsErrors, ERROR.accountNotApprove, statusCode.CODES.CLIENT_ERROR.unauthorized, dataEmpty, res);
			   exit()}
			    const otpCode = Math.floor(100000 + Math.random() * 900000);
				let date = new Date().getTime()+300*1000
				
				const otpData = new Otp({
					email:email,
					code:otpCode,
					expireIn: date
				});
			           await otpData.save();
			
				/**************E-mail OTP *********/
				const mailOptions = {
					to: email,
					subject: 'OTP',
					html: 'Your one time verification code is: '+otpCode
				  };
			    await sendEmail(mailOptions, res)
		    } catch (err) {
			 errorResponse(ERROR.errorBoolean, emptyValidationsErrors, err.message, statusCode.CODES.SERVER_ERROR.internalServerError, dataEmpty, res);
			}
	   }

    const verifyOTP = async (req, res) => {
		try {
			const otp = req.body.otpCode
			const doc = await Otp.findOne({email: req.body.email, code: otp})
			if(!doc){
				errorResponse(ERROR.errorBoolean, emptyValidationsErrors, ERROR.otpInvalid, statusCode.CODES.CLIENT_ERROR.unauthorized, dataEmpty, res);
			  exit()}
				let currentTime = new Date().getTime();
				let diff = doc.expireIn - currentTime;
				if(diff < 0){
             	errorResponse(ERROR.errorBoolean, emptyValidationsErrors, ERROR.otpExpired, statusCode.CODES.CLIENT_ERROR.unauthorized, dataEmpty, res);
				exit()
			}	
				successResponse(SUCCESS.errorBoolean, SUCCESS.otpVerified, statusCode.CODES.SUCCESS.OK, dataEmpty, res);
			} catch (err) {
				errorResponse(ERROR.errorBoolean, emptyValidationsErrors, err.message, statusCode.CODES.SERVER_ERROR.internalServerError, dataEmpty, res);
			}
		}
	const resetPassword = async (req, res) => {
		try {
			const password = req.body.password
			const pass = await bcrypt.hash(password, 10);	
			let update = await User.findOneAndUpdate({email:req.body.email},{password: pass});
			if(!update){	
				errorResponse(ERROR.errorBoolean, emptyValidationsErrors, err.message, statusCode.CODES.SERVER_ERROR.internalServerError, dataEmpty, res);
			exit()}
        		successResponse(SUCCESS.errorBoolean, SUCCESS.passUpdated, statusCode.CODES.SUCCESS.OK, dataEmpty, res);
			} catch (err) {
				errorResponse(ERROR.errorBoolean, emptyValidationsErrors, err.message, statusCode.CODES.SERVER_ERROR.internalServerError, dataEmpty, res);
			}
		}


    //Function to get the user
	const getUser = async (req, res) => {
		try {
			const user = await User.findById(req.user.id);
			if (!user) {
				errorResponse(ERROR.errorBoolean, emptyValidationsErrors, ERROR.noUser, statusCode.CODES.CLIENT_ERROR.notFound, dataEmpty, res);
			}
			const userDetails = await User.findOne({_id: req.user.id})
				.populate({ path: "category_id",  select:
				'category'}).populate({path: "role_id", select: 'user_role'});

            const  data = [
			{	...userDetails._doc,
				password: "",
			}
			]
				successResponse(SUCCESS.errorBoolean, SUCCESS.getUser, statusCode.CODES.SUCCESS.OK, data, res);

			} catch (err) {
				errorResponse(ERROR.errorBoolean, emptyValidationsErrors, err.message, statusCode.CODES.SERVER_ERROR.internalServerError, dataEmpty, res);
			}
		}

    // subscriptionPayment: async (req,res) =>{
	// 	    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
	// 	    try {
	//         let planData = await Subcription.findOne({_id:req.body.planId});  
	// 	    let checkPayment = await Payment.findOne({userId: req.body.userId, paymentStatus:'SUCCESS'}).sort({_id:-1});
	// 	    let currentDate = new Date();
	// 	    let expiryDate = "";
	// 	    if(checkPayment){  
	// 		expiryDateOld = checkPayment.expiryDate;
	// 		if(currentDate.getTime() > expiryDateOld.getTime()){
	// 		   expiryDate = new Date(currentDate.setMonth(currentDate.getMonth()+planData.month));
	// 		}else{
	// 		   expiryDate = new Date(expiryDateOld.setMonth(expiryDateOld.getMonth()+planData.month));
	// 		}
	// 	    }else{  
	// 		  expiryDate = new Date(currentDate.setMonth(currentDate.getMonth()+planData.month));
	// 	    }
		  
	// 		stripe.customers
	// 		  .create({
	// 			name: req.body.name,
	// 			source: req.body.token
	// 		  })
	// 		  .then(customer =>
	// 			stripe.charges.create({
	// 			  amount: req.body.price,
	// 			  currency: "usd",
	// 			  customer: customer.id
	// 			})
	// 		  )          
	// 		  .then((response) => {     
	
	// 			var payment = new Payment();
	// 			payment.userId = req._id;
	// 			payment.transationId = response.id;
	// 			payment.cardHolderName = response.name;
	// 			payment.subscriptionId = req.body.planId;
	// 			payment.amountPaid = req.body.price;
	// 			payment.paymentStatus = req.body.paymentStatus || "SUCCESS";
	// 			payment.expiryDate = expiryDate;
	// 			payment.save((err,doc)=>{
	// 			  if(!err){                 
	// 				  res.status(200).json({statusText : "success",message:"Payment Successfull"})
	// 			  }else{
	// 				  err.errorname = "Something went worng. Please try again later!";
	// 				  return res.status(200).send(err.errorname);
	// 			  }
	// 			})            
	// 		  })
	// 		  .catch(err => res.status(200).json({statusText : "err",message:"Error making payment"}))
	// 	  } catch (err) {
	// 		return res.json(responseFunction(responseMessage.MESSAGE.ERROR.errorBoolean, err.message, responseCode.SERVER_ERROR.internalServerError));

	// 		//res.send(res.status(200).json({statusText : "err", message:"Error outside try"}));
	// 	}
	// },

	// checkSubscription: async (req, res) => {
	// 	console.log("00000000000000")
	// 	try {
	// 		const checkPayment = await Payment.findOne({ userId: req.user.id });
	// 		if(checkPayment){ 
	// 			return res.json({message: jsonError[0].noPayment, error: jsonError[0].errorBoolean, responseCode: jsonError[0].unauthorized});        
	// 		}
	// 		let currentDate = new Date();
	// 		expiryDateOld = checkPayment.expiryDate;
	// 		if(currentDate.getTime() > expiryDateOld.getTime()){
	// 			return res.json({message: jsonError[0].packExpired, error: jsonError[0].errorBoolean, responseCode: jsonError[0].unauthorized}); 
	// 		} 
	// 		res.json({
	// 			message: "Success",
	// 			error: jsonSuccess[0].errorBoolean, 
	// 			responseCode: jsonSuccess[0].SuccessResponseCode

	// 		})

	// 	} catch (err) {
	// 		return res.status(500).json({ msg: err.message });
	// 	}
	// }
	
//}

//Function to to create access token.
const createAccessToken = (user) => {
	return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
};

module.exports = {signUp, login, logout, approveAccount, forgotPassword, verifyOTP, resetPassword, getUser};

