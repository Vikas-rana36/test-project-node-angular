const mongoose = require("mongoose");
//let Joi = require('joi');
//Model for user details.
const emailSchema = new mongoose.Schema(
	{
		from:{
			type: String
		},
		to: {
			type: String
		},
		subject: {
			type: String
		},
		type:{
         type: String
		},
        status:{
			 type: String,
			 default: "PENDING"
		 }
		// cron_email_created_on: {
		// 	type: String
		// },
		// cron_email_type: {
		// 	type: String
		// },
		// cron_email_status:{

		// },
		// cron_email_deleted:{

		// }
	},
	{
		timestamps: true,
	},
);
//Exporting file and set collection name user.
const Email = mongoose.model("email", emailSchema);
module.exports = {Email}
