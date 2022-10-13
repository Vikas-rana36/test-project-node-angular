const _ = require('lodash'); 
const { Section } = require('../../models/admin/section');
const { Question } = require('../../models/admin/question');
const { apiResponse} = require("../../core/response/response")
const { SUCCESS, REDIRECTION, CLIENT_ERROR, SERVER_ERROR } = require("../../core/response/statusCode")
const {ERROR_MSG, SUCCESS_MSG} = require("../../core/response/messages")
const mongoose = require("mongoose");
/* ******************************************
Section Functions
********************************************** */
exports.addSection = async (req, res) => {

    // If no validation errors, get the req.body objects that were validated and are needed
    const { id, name } = req.body
    if (_.has(req.body, ['id']) && (req.body.id)!=null){ 
       
       
        let condition = {}
        condition['_id'] = mongoose.Types.ObjectId(id);

        //checking record exist
        let record = await Section.findOne(condition, { _id: 1 } );      
        if (!record) return apiResponse(res, true, [], ERROR_MSG['NO-RECORD-FOUND'], CLIENT_ERROR.badRequest, 0, []);  

        //update Category 
        Section.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.body.id) }, { $set: req.body }, { new: true }, function (err, data) {
            
            if (err) return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
                
            return apiResponse(res, false, [], '', SUCCESS.OK, 0, [data])  
            
        });
    }else{

        
        //checking unique Section
        let existingRecord = await uniqueName(name)
        
        if (existingRecord) return apiResponse(res, true, [], ERROR_MSG['ALREADY-EXIST'], CLIENT_ERROR.badRequest, 0, []);

        //save Section  
        newSection = new Section(_.pick(req.body, ['name','description', 'file', 'is_active','createdAt','updatedAt']));
        
        newSection.save(async function (err, data) {
            if (err) return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
                
            return apiResponse(res, false, [], '', SUCCESS.OK, 0, [data])         
            
        });
    }    
}

exports.listingSection = async (req, res) => {
    try {
        const { name, description, created, updated } = req.body
        var filteredQuery, page, limit = ''
        let name_regex = new RegExp(name,'i');
        let descr_regex = new RegExp(description,'i');
        if(req.query.search){
            page = req.query.page  ? parseInt(req.query.page) - 1 : 0;
            limit = 10;
            const filter_name = (name && name != 'undefined')  ? { name: name_regex } : {};
            const filter_descr = (description && description != 'undefined')  ? { description: descr_regex } : {};
            const filter_createdAt = (created && created != 'undefined') ? { createdAt: { $gte: new Date(created), $lt: new Date(created).setHours(23, 59, 59, 59) }} : {};
            const filter_updatedAt = (updated && updated != 'undefined') ? { updatedAt: { $gte: new Date(updated), $lt: new Date(updated).setHours(23, 59, 59, 59) } } : {};
            filteredQuery = { ...filter_name, ...filter_descr, ...filter_createdAt, ...filter_updatedAt, is_deleted:false}
        }
        else{
            page = req.query.page  ? parseInt(req.query.page) - 1 : 0;
            limit = 10;
            filteredQuery = {
                is_deleted:false
            }
        }
        const [data, count] = await Promise.all([
            Section.find(filteredQuery).sort({createdAt: -1}).skip(page * limit).limit(limit),
            Section.countDocuments(filteredQuery)
        ]);
        return apiResponse(res, false, [], '', SUCCESS.OK, count, data)  

    } catch (error) {
        console.log('err',error)
         return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
    }
    
}

// total count section
exports.totalSection = async (req, res) => {
    try {
       const totalCount = await Section.countDocuments({is_deleted:false});
       return apiResponse(res, false, [], '', SUCCESS.OK, totalCount, [])  
    } catch (error) {
        console.log('err',error)
        return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
    }
}

// delete section and its related questions from question table
exports.deleteSection = async (req, res) => {
    try{
        const id = req.body.id;
        const filter = { _id: mongoose.Types.ObjectId(id) };
        const question_filter = { section_id: mongoose.Types.ObjectId(id) };
        let deleted_section = await Section.findOneAndUpdate(filter, { $set: { is_deleted: true, updatedAt:new Date() } }, {upsert: true, new: true});
        if(deleted_section){
            await Question.updateMany(question_filter, { $set: { is_deleted: true, updatedAt:new Date() } }, { multi: true, upsert: true, new: true }).then(qres => {
                if(qres){
                    return apiResponse(res, false, [], '', SUCCESS.OK, 0, [{deleted:'deleted successfully'}]);
                }else{
                    return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
                }
            });
        }else{
            return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
        }
    }catch(err){
        return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
    }
}

// delete selected sections and its related questions from question table
exports.deleteSelectedSection = async (req, res) => {
    try{
        let deleted_selected_record =  await Section.updateMany({_id:{$in: req.body.id}}, {$set: { is_deleted: true, updatedAt:new Date() } }, { multi: true, upsert: true, new: true }); 
        if(deleted_selected_record){
            await Question.updateMany({section_id:{$in: req.body.id}}, { $set: { is_deleted: true, updatedAt:new Date() } }, { multi: true, upsert: true, new: true }).then(qres => {
                if(qres){
                    if(qres){
                        return apiResponse(res, false, [], '', SUCCESS.OK, 0, [{deleted:'deleted successfully'}]);
                    }else{
                        return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
                    }
                }
            })
        }else{
            return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0,[])
        }
    }catch(err){
        return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
    }
}

exports.changeSectionStatus = async (req, res) => {
    const {id, status} = req.body
    let condition = {}
    condition['_id'] = mongoose.Types.ObjectId(id);
    const question_filter = { section_id: mongoose.Types.ObjectId(id)}

    let record = await Section.findOne(condition, { _id: 1 } );
    
    if (record) {
        let changeStaus = await Section.findOneAndUpdate(condition, { $set: { is_active: status } }, { new: true })
        if(changeStaus){
            await Question.updateMany(question_filter, { $set: { is_active: status, updatedAt:new Date() } }, { multi: true, upsert: true, new: true }).then(qres => {
                if(qres){
                    if(qres){
                        return apiResponse(res, false, [], '', SUCCESS.OK, 0, [record]) 
                    }else{
                        return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
                    }
                }
            })
        }else{
            return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
        }
    }

    return  apiResponse(res, true, [], ERROR_MSG['NO-RECORD-FOUND'], CLIENT_ERROR.badRequest, 0,[]);  
   
}

async function uniqueName(name){
    //checking unique Name
    return await Section.findOne(
        {name:name},
        { _id: 1 }
    );
}


/* ******************************************
Question Functions
********************************************** */

exports.addQuestion = async (req, res) => {

    // If no validation errors, get the req.body objects that were validated and are needed
    const { id, question, section_id, options } = req.body
    if (_.has(req.body, ['id']) && (req.body.id)!=null){ 
       
        let condition = {}
        condition['_id'] = mongoose.Types.ObjectId(id);

        //checking record exist
        let record = await Question.findOne(condition, { _id: 1 } );      
        if (!record) return apiResponse(res, true, [], ERROR_MSG['NO-RECORD-FOUND'], CLIENT_ERROR.badRequest, 0, []);  

        //update Question 
        Question.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.body.id) }, { $set: req.body }, { new: true }, function (err, data) {
            
            if (err) return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
                
            return apiResponse(res, false, [], '', SUCCESS.OK, 0, [data])  
            
        });
    }else{

        //checking unique Section
        let existingRecord = await uniqueQuestion(question, section_id)
        
        if (existingRecord) return apiResponse(res, true, [], ERROR_MSG['ALREADY-EXIST'], CLIENT_ERROR.badRequest, 0, []);

        //save Section 
        newSection = new Question(_.pick(req.body, ['question','section_id','options','is_active','createdAt','updatedAt']));
        
        newSection.save(async function (err, data) {
            
            if (err) return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
                
            return apiResponse(res, false, [], '', SUCCESS.OK, 0, [data])         
            
        });
    }    
}

exports.listingQuestion = async (req, res) => {
    try {
        const { section, question, options, created, updated } = req.body
        var filteredQuery, page, limit = ''
        let ques_regex = new RegExp(question,'i');
        if(req.query.search){
            page = req.query.page  ? parseInt(req.query.page) - 1 : 0;
            limit = 10;
            let sec_condition = {}
            sec_condition['section_id'] = mongoose.Types.ObjectId(section);
            const filter_section = (section && section != 'undefined')  ?  sec_condition : {};
            const filter_ques = (question && question != 'undefined')  ? { question: ques_regex } : {};
            const filter_opt = (options && options != 'undefined')  ? { options: { $size : parseInt(options) } } : {};
            const filter_createdAt = (created && created != 'undefined') ? { createdAt: { $gte: new Date(created), $lt: new Date(created).setHours(23, 59, 59, 59) }} : {};
            const filter_updatedAt = (updated && updated != 'undefined') ? { updatedAt: { $gte: new Date(updated), $lt: new Date(updated).setHours(23, 59, 59, 59) } } : {};
            filteredQuery = { ...filter_section, ...filter_ques, ...filter_opt, ...filter_createdAt, ...filter_updatedAt, is_deleted:false}
        }
        else{
            page = req.query.page  ? parseInt(req.query.page) - 1 : 0;
            limit = 10;
            filteredQuery = {
                is_deleted:false
            }
        }
        // console.log("limnit>>>>>>>>>",limit)
        // console.log("filteredQuery>>>>>>>>>>>>",filteredQuery)
        const [data, count] = await Promise.all([
            //Question.find({}).sort({createdAt: -1}),
            Question.aggregate([
                { $match : filteredQuery },
                {
                    $lookup: {
                      from: "sections",
                      as: "section",
                      let: { section_id: "$section_id" },
                      pipeline: [
                          { 
                            $match: { 
                              $expr: { $eq: ["$$section_id", "$_id"] },
                            } 
                          },
                          { $project: { name:1 } }
                      ],
                    },
                  },
                  {$sort: {createdAt: -1}},
                  {$skip: page * limit},
                  {$limit: limit}
              ]),
            // Question.aggregate([
            //     { $match : { is_deleted : false } },
            //     {
            //         $lookup: {
            //         from: "sections",
            //         as: "section",
            //         localField: "section_id",
            //         foreignField: "_id",
            //         pipeline: [
            //             {
            //                 $project: { name: 1}
            //             }
            //         ]
            //         }
            //     },
            //     {$sort: {createdAt: -1}},
            //     {$skip: page * limit},
            //     {$limit: limit}
            // ]),    
            Question.countDocuments(filteredQuery)
        ]);
        return apiResponse(res, false, [], '', SUCCESS.OK, count, data)  

    } catch (error) {
        console.log('err',error)
         return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
    }
    
}

// total count Question
exports.totalQuestion = async (req, res) => {
    try {
       const totalCount = await Question.countDocuments({is_deleted:false});
       return apiResponse(res, false, [], '', SUCCESS.OK, totalCount, [])  
    } catch (error) {
        console.log('err',error)
        return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
    }
}

// delete question
exports.deleteQuestion = async (req, res) => {
    try{
        const id = req.body.id;
        await Question.findOneAndUpdate({_id: mongoose.Types.ObjectId(id)}, { $set: { is_deleted: true, updatedAt:new Date() } }, {upsert: true, new: true}).then(qres => {
            if(qres){
                return apiResponse(res, false, [], '', SUCCESS.OK, 0, [{deleted:'deleted successfully'}]);
            }else{
                return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, []) 
            }
        });
    }catch(err){
        return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, []) 
    }
}

// delete selected Question
exports.deleteSelectedQuestion = async (req, res) => {
    try{
        await Question.updateMany({_id:{$in: req.body.id}}, { $set: { is_deleted: true, updatedAt:new Date() } }, {multi: true, upsert: true, new: true}).then(qres => {
            if(qres){
                return apiResponse(res, false, [], '', SUCCESS.OK, 0, [{deleted:'deleted successfully'}]);
            }else{
                return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, []) 
            }
        });
    }catch(err){
        return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, []) 
    }
}

exports.changeQuestionStatus = async (req, res) => {
    const {id, status} = req.body
    let condition = {}
    condition['_id'] = mongoose.Types.ObjectId(id);

    let record = await Question.findOne(condition, { _id: 1 } );
    
    if (record) {
        await Question.findOneAndUpdate(condition, { $set: { is_active: status } }, { new: true })

        return apiResponse(res, false, [], '', SUCCESS.OK, 0,[record]) 
    }

    return  apiResponse(res, true, [], ERROR_MSG['NO-RECORD-FOUND'], CLIENT_ERROR.badRequest, 0,[]);  
   
}

async function uniqueQuestion(question,section){
    //checking unique Name
    return await Question.findOne(
        {question:question,section_id:section},
        { _id: 1 }
    );
}
