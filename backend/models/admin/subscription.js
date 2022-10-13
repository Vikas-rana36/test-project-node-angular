const mongoose = require("mongoose");
let Joi = require('joi')
//Model for user details.
const subscriptionSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		month: {
			type: String,
			required: true,
		},
		price: {
			type: String,
			required: true,
		},
		modifiedate: {
			type: Date,
		}
	},
	{
		timestamps: true,
	},
);

const subscriptionJoiSchema = Joi.object().keys({
    title: Joi.string().required(),
    month: Joi.string().required(),
    price: Joi.string().required()
  })

//Exporting file and set collection name user.
const Subscription = mongoose.model("subscription", subscriptionSchema);
module.exports = {Subscription, subscriptionJoiSchema}