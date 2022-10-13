
const {Subscription} = require("../models/admin/subscription")
const {Payment} = require("../models/subscriptionPayment")
const {ERROR, SUCCESS} = require("../core/utilities/messages")
const statusCode = require("../core/utilities/statusCode");
const {errorResponse, successResponse} = require("../core/utilities/response")
const config = require('config')
const dataEmpty = config.get('dataEmpty'); 
const emptyValidationsErrors = config.get('emptyValidationsErrors'); 


    const subscriptionPayment = async (req,res) =>{
        const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
        try {
        let planData = await Subscription.findOne({_id:req.body.planId});  
        let checkPayment = await Payment.findOne({userId: req.body.userId, paymentStatus:'SUCCESS'}).sort({_id:-1});
        let currentDate = new Date();
        let expiryDate = "";
        if(checkPayment){  
        expiryDateOld = checkPayment.expiryDate;
        if(currentDate.getTime() > expiryDateOld.getTime()){
           expiryDate = new Date(currentDate.setMonth(currentDate.getMonth()+planData.month));
        }else{
           expiryDate = new Date(expiryDateOld.setMonth(expiryDateOld.getMonth()+planData.month));
        }
        }else{  
          expiryDate = new Date(currentDate.setMonth(currentDate.getMonth()+planData.month));
        }
      
        stripe.customers
          .create({
            name: req.body.name,
            source: req.body.token
          })
          .then(customer =>
            stripe.charges.create({
              amount: req.body.price,
              currency: "usd",
              customer: customer.id
            })
          )          
          .then((response) => {     

            var payment = new Payment();
            payment.userId = req._id;
            payment.transationId = response.id;
            payment.cardHolderName = response.name;
            payment.subscriptionId = req.body.planId;
            payment.amountPaid = req.body.price;
            payment.paymentStatus = req.body.paymentStatus || "SUCCESS";
            payment.expiryDate = expiryDate;
            payment.save((err,doc)=>{
              if(!err){                 
                  res.status(200).json({statusText : "success",message:"Payment Successfull"})
              }else{
                  err.errorname = "Something went worng. Please try again later!";
                  return res.status(200).send(err.errorname);
              }
            })            
          })
          .catch(err => res.status(200).json({statusText : "err",message:"Error making payment"}))
      } catch (err) {
        errorResponse(ERROR.errorBoolean, emptyValidationsErrors, err.message, statusCode.CODES.SERVER_ERROR.internalServerError, dataEmpty, res);
    }
   }
   const SubscriptionTrial = async (req,res) =>{
        try {  
        let currentDate = new Date();
         expiryDate = new Date(currentDate.setMonth(currentDate.getMonth()+ 01));
           const payment = new Payment({
            userId: req._id,
            paymentStatus: req.body.paymentStatus || "SUCCESS",
            expiryDate: expiryDate
           });
           await payment.save();
         successResponse(SUCCESS.errorBoolean, SUCCESS.SubscriptionTrial, statusCode.CODES.SUCCESS.created, data, res)
         } catch (err) {
        errorResponse(ERROR.errorBoolean, emptyValidationsErrors, err.message, statusCode.CODES.SERVER_ERROR.internalServerError, dataEmpty, res);
    }
}

module.exports = {subscriptionPayment, SubscriptionTrial};