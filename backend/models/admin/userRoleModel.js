const mongoose = require("mongoose");
let Joi = require('joi');
//Model for user details.
const userRoleSchema = new mongoose.Schema(
	{
		user_role: {
			type: String
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
const userRoleJoiSchema = Joi.object().keys({
    user_role: Joi.string().min(1).max(15).required(),
  })
//Exporting file and set collection name user.
const Role = mongoose.model("userrole", userRoleSchema);
module.exports = {Role, userRoleJoiSchema}
