"use strict";
const config = require('config')
const {errorResponse, successResponse} = require("../core/utilities/response")
const {Subscription} = require("../models/admin/subscription")
const {Payment} = require("../models/subscriptionPayment")
const {ERROR, SUCCESS} = require("../core/utilities/messages")
const statusCode = require("../core/utilities/statusCode");
const dataEmpty = config.get('dataEmpty'); 
const emptyValidationsErrors = config.get('emptyValidationsErrors'); 


    const getSubscriptionList = async (req, res) => {
        try {
            const subscription = await Subscription.find();
            if (!subscription) {
                 errorResponse(ERROR.errorBoolean, emptyValidationsErrors, ERROR.nosubscription, statusCode.CODES.CLIENT_ERROR.notFound, dataEmpty, res)
            }
            const data = [
                subscription
                ]      
                successResponse(SUCCESS.errorBoolean, SUCCESS.subscriptionFetched, statusCode.CODES.SUCCESS.OK, data, res)
                } catch (err) {
                errorResponse(ERROR.errorBoolean, emptyValidationsErrors, err.message, statusCode.CODES.SERVER_ERROR.internalServerError, dataEmpty, res);
            }
        }

        const getSubscriptionInfo = async (req, res) => {
            try {
                const subscription = await Subscription.find({_id: id});
                if (!subscription) {
                     errorResponse(ERROR.errorBoolean, emptyValidationsErrors, ERROR.nosubscription, statusCode.CODES.CLIENT_ERROR.notFound, dataEmpty, res)
                }
                const data = [
                    subscription
                    ]      
                    successResponse(SUCCESS.errorBoolean, SUCCESS.subscriptionFetched, statusCode.CODES.SUCCESS.OK, data, res)
                    } catch (err) {
                    errorResponse(ERROR.errorBoolean, emptyValidationsErrors, err.message, statusCode.CODES.SERVER_ERROR.internalServerError, dataEmpty, res);
                }
            }

        const verifySubscription  = async (req, res) => {
                try {
                    const checkPayment = await Payment.findOne({ userId: req.user.id });
                    if(checkPayment){ 
                     errorResponse(ERROR.errorBoolean, emptyValidationsErrors, ERROR.noPayment, statusCode.CODES.CLIENT_ERROR.unauthorized, dataEmpty, res) 
                    }
                    let currentDate = new Date();
                    expiryDateOld = checkPayment.expiryDate;
                    if(currentDate.getTime() > expiryDateOld.getTime()){
                     errorResponse(ERROR.errorBoolean, emptyValidationsErrors, ERROR.packExpired, statusCode.CODES.CLIENT_ERROR.unauthorized, dataEmpty, res) 
                    } 
                    successResponse(SUCCESS.errorBoolean, SUCCESS.success, statusCode.CODES.SUCCESS.OK, data, res)
            
                } catch (err) {
                    return res.status(500).json({ msg: err.message });
                }
            }

        module.exports = {getSubscriptionList, getSubscriptionInfo, verifySubscription};
