const mongoose = require("mongoose");
//Model for user details.
const faqSchema = new mongoose.Schema(
	{
		question: {
			type: String 
		},

        answer: {
			type: String 
		},
		is_active: {
			type: Boolean,
             default: true
		},

		is_deleted: {
			type: Boolean,
			default: false
		}

	},
	{
		timestamps: true,
	},
);
module.exports.FAQ =  mongoose.model('FAQ', faqSchema);