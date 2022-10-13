const _ = require('lodash'); 
const { Section } = require('../models/admin/section');
const { Question } = require('../models/admin/question');
const { Usersectionresult } = require('../models/user-section-result');
const { apiResponse} = require("../core/response/response")
const { SUCCESS, REDIRECTION, CLIENT_ERROR, SERVER_ERROR } = require("../core/response/statusCode")
const {ERROR_MSG, SUCCESS_MSG} = require("../core/response/messages")
const mongoose = require("mongoose");
/* ******************************************
Section Functions
********************************************** */

exports.listingSection = async (req, res) => {

    try {
        var page = parseInt(req.query.page) - 1 || 0;
        var limit = 10;
        const [data, count] = await Promise.all([
            Section.find({is_active:true, is_deleted:false}).sort({createdAt: -1}).skip(page * limit).limit(limit),
            Section.countDocuments({is_active:true, is_deleted:false})
        ]);
        return apiResponse(res, false, [], '', SUCCESS.OK, count, data)  

    } catch (error) {
        console.log('err',error)
         return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
    }
    
}

/* ******************************************
Question Functions
********************************************** */

exports.listingQuestion = async (req, res) => {
    const { sectionId } = req.body;
    try {
        var page = parseInt(req.query.page) - 1 || 0;
        var limit = 10;
        const [data, count] = await Promise.all([
            Question.find({section_id: sectionId, is_active:true, is_deleted:false }).sort({createdAt: -1}).skip(page * limit).limit(limit),
            Question.countDocuments({is_active:true, is_deleted:false})
        ]);
        return apiResponse(res, false, [], '', SUCCESS.OK, count, data)  

    } catch (error) {
        console.log('err',error)
         return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
    }
    
}

/* ******************************************
Section Question Result Functions
********************************************** */
exports.addSectionResult = async (req, res) => {
    // If no validation errors, get the req.body objects that were validated and are needed
    const { id, questionAnswer, section_id, user_id } = req.body
    if (_.has(req.body, ['id']) && (req.body.id)!=null){ 
       
        let condition = {}
        condition['_id'] = mongoose.Types.ObjectId(id);

        //checking record exist
        let record = await Usersectionresult.findOne(condition, { _id: 1 } );      
        if (!record) return apiResponse(res, true, [], ERROR_MSG['NO-RECORD-FOUND'], CLIENT_ERROR.badRequest, 0, []);  

        //update Question 
        Usersectionresult.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.body.id) }, { $set: req.body }, { new: true }, function (err, data) {
            
            if (err) return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
                
            return apiResponse(res, false, [], '', SUCCESS.OK, 0, [data])  
            
        });
    }else{
        //checking unique Section
        let existingRecord = await uniqueSectionResult(user_id, section_id)
        
        if (existingRecord) return apiResponse(res, true, [], ERROR_MSG['ALREADY-EXIST'], CLIENT_ERROR.badRequest, 0, []);

        //save Section 
        newSectionResult = new Usersectionresult(_.pick(req.body, ['user_id','section_id','question_answer','result','createdAt','updatedAt']));
        
        newSectionResult.save(async function (err, data) {
            
            if (err) return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
                
            return apiResponse(res, false, [], '', SUCCESS.OK, 0, [data])         
            
        });
    }
}

async function uniqueSectionResult(userId, sectionId){
    //checking unique Result for a specific user
    return await Usersectionresult.findOne(
        {user_id:userId, section_id: sectionId},
        { _id: 1 }
    );
}

exports.lisingSectionResult = async (req, res) => {
    const { user_id, sectionId} = req.body;
    try {
        const [data, count] = await Promise.all([
            Usersectionresult.find({user_id:user_id, section_id: sectionId}, {}).sort({createdAt: -1}),
            Usersectionresult.countDocuments()
        ]);
        return apiResponse(res, false, [], '', SUCCESS.OK, count, data)  

    } catch (error) {
        console.log('err',error)
         return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
    }
}
