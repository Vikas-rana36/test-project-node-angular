const mongoose = require("mongoose");

//Model for organization details.
const organizationSchema = new mongoose.Schema(
	{
		name: {
			type: String 
		},
        address1: {
			type: String 
		},
        address2: {
			type: String 
		},
        org_owner: {
            type: String
        },
        org_email: {
            type: String
        },
        org_phone: {
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
module.exports.Organization =  mongoose.model('Organization', organizationSchema);