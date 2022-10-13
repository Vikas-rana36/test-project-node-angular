const mongoose = require("mongoose");
let Joi = require('joi');
//Model for user details.
const questionAnswerSchema = new mongoose.Schema(
	{
		question: {
			type: String 
		},
		never:{
			type: Number,
		},
		sometimes:{
			type: Number,
		},
		regularly:{
			type: Number,
		},
		often:{
			type: Number,
		},
		always:{
			type: Number,
		},
	},
	{
		timestamps: true,
	},
);
const questionAnswerJoiSchema = Joi.object().keys({
    question: Joi.string().min(2).max(70).required(),
    never: Joi.number().required(),
    sometimes: Joi.number().required(),
    regularly: Joi.number().required(),
    often: Joi.number().required(),
    always: Joi.number().required(),

  })
//Exporting file and set collection name user.
const QuestionAnswer = mongoose.model("questionanswer", questionAnswerSchema);
module.exports = {QuestionAnswer, questionAnswerJoiSchema}
