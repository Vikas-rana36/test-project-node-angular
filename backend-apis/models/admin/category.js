const mongoose = require("mongoose");
//Model for user details.
const categorySchema = new mongoose.Schema(
	{
		name: {
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
module.exports.Category =  mongoose.model('Category', categorySchema);
