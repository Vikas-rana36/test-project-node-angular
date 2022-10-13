const mongoose = require('mongoose')
, Schema = mongoose.Schema
//Model for questionaries section details.
const userSectionCalculationSchema = new mongoose.Schema(
	{
        user_id: {
            type: Schema.Types.ObjectId, 
            ref: 'User'
        },
		section_id: { 
            type: Schema.Types.ObjectId, 
            ref: 'Section' 
        },
        question_answer: [],
		result: {
			type: Number,
		},

	},
	{
		timestamps: true,
	},
);
module.exports.Usersectionresult =  mongoose.model('Usersectionresult', userSectionCalculationSchema);
