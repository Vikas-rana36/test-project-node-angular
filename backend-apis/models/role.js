const mongoose = require("mongoose");
const roleSchema = new mongoose.Schema(
	{
		name: {
			type: String
		},
		type: {
			type: Number,
			default:2
		},
		is_active: {
			type: String,
			default: true
		},
		is_deleted: {
			type: String,
			default: false
		}
	},
	{
		timestamps: true,
	},
);
module.exports.Role =  mongoose.model('Role', roleSchema);
