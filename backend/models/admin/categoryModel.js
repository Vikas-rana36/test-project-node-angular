const mongoose = require("mongoose");
let Joi = require('joi');
const { boolean } = require("joi");
const { Schema } = mongoose;
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
const categoryJoiSchema = Joi.object().keys({
    name: Joi.string().min(5).max(70).required(),
  })
//Exporting file and set collection name user.
const Category = mongoose.model("category", categorySchema);
module.exports = {Category, categoryJoiSchema}
