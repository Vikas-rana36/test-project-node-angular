'use strict';
var mongoose = require('mongoose');
var settingSchema = new mongoose.Schema(
    {
        is_activate_subscriptions: { 
            type: Boolean, 
            default:false
        },
        terms_and_conditions: { 
            type: String, 
        },
        introduction_content: { 
            type: String
        },
        FAS_results_explanation: {
            type: String
        },
        introduction_for_discovery: {
            type: String
        },
        introduction_to_plan: {
            type: String
        }
    },
    {
        timestamps: true,
    },
);

let Setting = mongoose.model('Setting', settingSchema)
//module.exports.User =  mongoose.model('User', userSchema);
module.exports = {Setting, settingSchema}