const mongoose = require("mongoose");
let Joi = require('joi')
//Model for user details.
const subscriptionPaymentSchema = new mongoose.Schema(
	{
		userId: {
			type: String
		},
		transationId: {
			type: String
		},
		subscriptionId: {
			type: String
		},
		amountPaid: {
			type: String
		},
		paymentStatus: {
			type: String
		},
		expiryDate: {
			type: Date
		},
		
	},
	{
		timestamps: true,
	},
);

const subscriptionPaymentJoiSchema = Joi.object().keys({
	planId : Joi.string().required(),
    userId: Joi.string().required(),
  })
//Exporting file and set collection name user.
const Payment = mongoose.model("subscription_payment", subscriptionPaymentSchema);
module.exports = {Payment, subscriptionPaymentJoiSchema}


