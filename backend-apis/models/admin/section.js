const mongoose = require("mongoose");
//Model for questionaries section details.
const sectionSchema = new mongoose.Schema(
	{
		name: {
			type: String 
		},
		description: {
			type: String
		},
		file: {
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
module.exports.Section =  mongoose.model('Section', sectionSchema);
