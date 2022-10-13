const _ = require('lodash'); 
const { Setting } = require('../models/admin/setting');
const { apiResponse} = require("../core/response/response")
const { SUCCESS, REDIRECTION, CLIENT_ERROR, SERVER_ERROR } = require("../core/response/statusCode")
const {ERROR_MSG, SUCCESS_MSG} = require("../core/response/messages")
const mongoose = require("mongoose");

// fetch user default pages view
exports.fetchDefaultView = async (req, res) => {
    try {
        const [data, count] = await Promise.all([
            Setting.find({}),
            Setting.countDocuments()
        ]);
        return apiResponse(res, false, [], '', SUCCESS.OK, count, data)  

    } catch (error) {
        console.log('err',error)
         return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
    }
}