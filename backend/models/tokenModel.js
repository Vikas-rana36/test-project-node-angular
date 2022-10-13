const mongoose = require("mongoose");
//Model for user details.
const tokenSchema = new mongoose.Schema(
	{
		userId: {
			type: String
		},
		device_token: {
			type: String
		},
		access_token: {
			type: String
		},
	},
	{
		timestamps: true,
	},
);

//Exporting file and set collection name user.
module.exports = mongoose.model("token", tokenSchema);

