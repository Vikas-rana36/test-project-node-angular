const _ = require('lodash'); 
const { Category } = require('../models/admin/category');
const { apiResponse} = require("../core/response/response")
const { SUCCESS, REDIRECTION, CLIENT_ERROR, SERVER_ERROR } = require("../core/response/statusCode")
const {ERROR_MSG, SUCCESS_MSG} = require("../core/response/messages")
const mongoose = require("mongoose");

// fetch categories/goals for users
exports.fetchGoals = async (req, res) => {

    try {
        var page = parseInt(req.query.page) - 1 || 0;
        var limit = 10;
        const [data, count] = await Promise.all([
            Category.find({is_active:true, is_deleted:false}).sort({createdAt: -1}).skip(page * limit).limit(limit),
            Category.countDocuments({is_active:true, is_deleted:false})
        ]);
        return apiResponse(res, false, [], '', SUCCESS.OK, count, data)  

    } catch (error) {
        console.log('err',error)
         return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
    }
    
}

async function uniqueCategory(name){
    //checking unique Category
    return await Category.findOne(
        {name:name},
        { _id: 1 }
    );
}



