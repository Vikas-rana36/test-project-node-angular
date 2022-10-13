const _ = require('lodash'); 
const mongoose = require("mongoose");
const { FAQ } = require('../../models/admin/faq');
const { apiResponse} = require("../../core/response/response")
const { SUCCESS, REDIRECTION, CLIENT_ERROR, SERVER_ERROR } = require("../../core/response/statusCode")
const {ERROR_MSG, SUCCESS_MSG} = require("../../core/response/messages")

exports.faqAdd = async (req, res) => {

    // If no validation errors, get the req.body objects that were validated and are needed
    const { id, question,answer } = req.body
    if (_.has(req.body, ['id']) && (req.body.id)!=null){ 

        let condition = {}
        condition['_id'] = mongoose.Types.ObjectId(id);

        //checking record exist
        let record = await FAQ.findOne(condition, { _id: 1 } );      
        if (!record) return apiResponse(res, true, [], ERROR_MSG['NO-RECORD-FOUND'], CLIENT_ERROR.badRequest, 0, []);

        //update FAQ 
        FAQ.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.body.id) }, { $set: req.body }, { new: true }, function (err, record) {
            
            if (err) return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
                
            return apiResponse(res, false, [], '', SUCCESS.OK, [record])  
            
        });
    }else{
        //save FAQ 
        newFAQ = new FAQ(_.pick(req.body, ['question','answer','is_active','createdAt','updatedAt']));
        
        newFAQ.save(async function (err, record) {
            
            if (err) return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError,0,  [])
                
            return apiResponse(res, false, [], '', SUCCESS.OK, 0, [record])         
            
        });
    }    
}

exports.faqListing = async (req, res) => {

    try {
        const { question, answer, created, updated } = req.body
        var filteredQuery, page, limit = ''
        let ques_regex = new RegExp(question,'i');
        let ans_regex = new RegExp(answer,'i');
        if(req.query.search){
            page = req.query.page  ? parseInt(req.query.page) - 1 : 0;
            limit = 10;
            const filter_ques = (question && question != 'undefined')  ? { question: ques_regex } : {};
            const filter_ans = (answer && answer != 'undefined')  ? { answer: ans_regex } : {};
            const filter_createdAt = (created && created != 'undefined') ? { createdAt: { $gte: new Date(created), $lt: new Date(created).setHours(23, 59, 59, 59) }} : {};
            const filter_updatedAt = (updated && updated != 'undefined') ? { updatedAt: { $gte: new Date(updated), $lt: new Date(updated).setHours(23, 59, 59, 59) } } : {};
            filteredQuery = { ...filter_ques, ...filter_ans, ...filter_createdAt, ...filter_updatedAt, is_deleted:false}
        }
        else{
            page = req.query.page  ? parseInt(req.query.page) - 1 : 0;
            limit = 10;
            filteredQuery = {
                is_deleted:false
            }
        }
        const [data, count] = await Promise.all([
            FAQ.find(filteredQuery).sort({createdAt: -1}).skip(page * limit).limit(limit),
            FAQ.countDocuments(filteredQuery)
        ]);
        return apiResponse(res, false, [], '', SUCCESS.OK, count, data)  

    } catch (error) {
        console.log('err',error)
         return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
    } 
}

// total faq count
exports.totalFAQ = async (req, res) => {
    try {
       const totalCount = await FAQ.countDocuments({is_deleted:false});
       return apiResponse(res, false, [], '', SUCCESS.OK, totalCount, [])  
    } catch (error) {
        console.log('err',error)
        return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
    }
}

// delete faq
exports.deleteFAQ = async (req, res) => {

    try{
        const id = req.body.id;
        await FAQ.findOneAndUpdate({_id: mongoose.Types.ObjectId(id)}, { $set: { is_deleted: true, updatedAt:new Date() } }, {upsert: true, new: true}).then(cres => {
            if(cres){
                return apiResponse(res, false, [], '', SUCCESS.OK, 0, [{deleted:'deleted successfully'}]);
            }else{
                return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, []) 
            }
        });
    }catch(err){
        return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, []) 
    } 
}

// delete selected FAQ
exports.deleteSelectedFAQ = async (req, res) => {
    try{
        await FAQ.updateMany({_id:{$in: req.body.id}}, { $set: { is_deleted: true, updatedAt:new Date() } }, {multi: true, upsert: true, new: true}).then(cres => {
            if(cres){
                return apiResponse(res, false, [], '', SUCCESS.OK, 0, [{deleted:'deleted successfully'}]);
            }else{
                return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, []) 
            }
        });
    }catch(err){
        return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, []) 
    }
}

exports.changeFAQStatus = async (req, res) => {
    const {id, status} = req.body
    let condition = {}
    condition['_id'] = mongoose.Types.ObjectId(id);

    let record = await FAQ.findOne(condition, { _id: 1 } );
    
    if (record) {
        await FAQ.findOneAndUpdate(condition, { $set: { is_active: status } }, { new: true })

        return apiResponse(res, false, [], '', SUCCESS.OK, [record]) 
    }

    return  apiResponse(res, true, [], ERROR_MSG['NO-RECORD-FOUND'], CLIENT_ERROR.badRequest, 0, []); 
   
}