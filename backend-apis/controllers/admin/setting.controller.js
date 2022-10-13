const _ = require('lodash'); 
const { Setting } = require('../../models/admin/setting');
const { apiResponse} = require("../../core/response/response")
const { SUCCESS, REDIRECTION, CLIENT_ERROR, SERVER_ERROR } = require("../../core/response/statusCode")
const {ERROR_MSG, SUCCESS_MSG} = require("../../core/response/messages")
const mongoose = require("mongoose");

exports.saveSetting = async (req, res) => {
    const {id, is_activate_subscriptions, terms_and_conditions, introduction_content} = req.body;
    if (_.has(req.body, ['id']) && (req.body.id)!=null){ 
        Setting.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.body.id) }, { $set: req.body }, { new: true }, function (err, setting) {
            
            if (err) return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
                
            return apiResponse(res, false, [], '', SUCCESS.OK, 0, [setting])  
            
        });
    }
}

exports.fetchSetting = async (req, res) => {
    try {
        const [data, count] = await Promise.all([
            Setting.find({}).sort({createdAt: -1}),
            Setting.countDocuments()
        ]);
        return apiResponse(res, false, [], '', SUCCESS.OK, count, data)  

    } catch (error) {
        console.log('err',error)
         return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
    }
}


