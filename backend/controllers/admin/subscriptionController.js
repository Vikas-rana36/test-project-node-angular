const {Subscription} = require("../../models/admin/subscription")
const {ERROR, SUCCESS} = require("../../core/utilities/messages")
const statusCode = require("../../core/utilities/statusCode")
const config = require('config')
const dataEmpty = config.get('dataEmpty'); 
const emptyValidationsErrors = config.get('emptyValidationsErrors'); 
const {errorResponse, successResponse} = require("../../core/utilities/response")


	const createSubscription = async (req, res) => {
		try {
			const { title, month, price} = req.body;

			const Subs = await Subscription.findOne({ title: title });
			if (Subs) {
				errorResponse(ERROR.errorBoolean, emptyValidationsErrors, ERROR.subscriptionAlreadyExist, statusCode.CODES.CLIENT_ERROR.valueAlreadyExist, dataEmpty, res)
			exit()}
			//Saving user.
			const new_subs = await Subscription.create({
				title,
				month,
				price,
			});

			await new_subs.save();
			successResponse(SUCCESS.errorBoolean, SUCCESS.subscriptionCreated, statusCode.CODES.SUCCESS.created, data, res)  
		} catch (err) {
			errorResponse(ERROR.errorBoolean, emptyValidationsErrors, err.message, statusCode.CODES.SERVER_ERROR.internalServerError, dataEmpty, res);
		}
	}

module.exports = {createSubscription};
