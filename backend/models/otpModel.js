const mongoose = require("mongoose");
let Joi = require('joi')
//Model for user details.
const otpSchema = new mongoose.Schema(
	{
		email: {
			type: String
		},
		code: {
			type: String
		},
		expireIn: {
			type: String
		},
	},
	{
		timestamps: true,
	},
);

const otpJoiSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    otpCode: Joi.string().required(),

  })
//Exporting file and set collection name user.
const Otp = mongoose.model("otp", otpSchema);

module.exports = {Otp, otpJoiSchema}

