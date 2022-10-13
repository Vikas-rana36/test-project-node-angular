const { number } = require('joi');

const mongoose = require('mongoose')
, Schema = mongoose.Schema
//Model for questionaries section details.
const questionSchema = new mongoose.Schema(
	{
		section_id: { 
            type: Schema.Types.ObjectId, 
            ref: 'Section' 
        },
        question: {
			type: String 
		},
        options:[],

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
module.exports.Question =  mongoose.model('Question', questionSchema);
