const _ = require('lodash'); 
const { Category } = require('../../models/admin/category');
const { apiResponse} = require("../../core/response/response")
const { SUCCESS, REDIRECTION, CLIENT_ERROR, SERVER_ERROR } = require("../../core/response/statusCode")
const {ERROR_MSG, SUCCESS_MSG} = require("../../core/response/messages")
const mongoose = require("mongoose");

exports.add = async (req, res) => {

    // If no validation errors, get the req.body objects that were validated and are needed
    const { id, name } = req.body
    if (_.has(req.body, ['id']) && (req.body.id)!=null){ 

        let condition = {}
        condition['_id'] = mongoose.Types.ObjectId(id);

        //checking record exist
        let record = await Category.findOne(condition, { _id: 1 } );      
        if (!record) return apiResponse(res, true, [], ERROR_MSG['NO-RECORD-FOUND'], CLIENT_ERROR.badRequest, 0, []);
        //update Category 
        Category.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.body.id) }, { $set: req.body }, { new: true }, function (err, category) {
            
            if (err) return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
                
            return apiResponse(res, false, [], '', SUCCESS.OK, 0, [category])  
            
        });
    }else{

        //checking unique Category
        let existingCategory = await uniqueCategory(name)
        
        if (existingCategory) return apiResponse(res, true, [], ERROR_MSG['CATEGORY-EXIST'], CLIENT_ERROR.badRequest, 0, []);

        //save Category 
        newCategory = new Category(_.pick(req.body, ['name','is_active','createdAt','updatedAt']));
        
        newCategory.save(async function (err, category) {
            
            if (err) return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
                
            return apiResponse(res, false, [], '', SUCCESS.OK, 0, [category])         
            
        });
    }    
}

exports.listing = async (req, res) => {
    try {
        const { name, created, updated } = req.body
        var filteredQuery, page, limit = ''
        let name_regex = new RegExp(name,'i');
        if(req.query.search){
            page = req.query.page  ? parseInt(req.query.page) - 1 : 0;
            limit = 10;
            const filter_name = (name && name != 'undefined')  ? { name: name_regex } : {};
            const filter_createdAt = (created && created != 'undefined') ? { createdAt: { $gte: new Date(created), $lt: new Date(created).setHours(23, 59, 59, 59) }} : {};
            const filter_updatedAt = (updated && updated != 'undefined') ? { updatedAt: { $gte: new Date(updated), $lt: new Date(updated).setHours(23, 59, 59, 59) } } : {};
            filteredQuery = { ...filter_name, ...filter_createdAt, ...filter_updatedAt, is_deleted:false}
        }
        else{
            page = req.query.page  ? parseInt(req.query.page) - 1 : 0;
            limit = 10;
            filteredQuery = {
                is_deleted:false
            }
        }
        const [data, count] = await Promise.all([
            Category.find(filteredQuery).sort({createdAt: -1}).skip(page * limit).limit(limit),
            //Category.find({is_deleted:false}).sort({createdAt: -1}).skip(page * limit).limit(limit),
            Category.countDocuments(filteredQuery)
        ]);
        return apiResponse(res, false, [], '', SUCCESS.OK, count, data)  

    } catch (error) {
        console.log('err',error)
         return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
    }
    
}

//total count categories
exports.totalCategories = async (req, res) => {
    try {
       const totalCount = await Category.countDocuments({is_deleted:false});
       return apiResponse(res, false, [], '', SUCCESS.OK, totalCount, [])  
    } catch (error) {
        console.log('err',error)
        return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
    }
}

// delete category
exports.deleteCategory = async (req, res) => {
    try{
        const id = req.body.id;
        await Category.findOneAndUpdate({_id: mongoose.Types.ObjectId(id)}, { $set: { is_deleted: true, updatedAt:new Date() } }, {upsert: true, new: true}).then(cres => {
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

// delete selected category
exports.deleteSelectedCategory = async (req, res) => {
    try{
        await Category.updateMany({_id:{$in: req.body.id}}, { $set: { is_deleted: true, updatedAt:new Date() } }, {multi: true, upsert: true, new: true}).then(cres => {
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

exports.changeStatus = async (req, res) => {
    const {id, status} = req.body
    let condition = {}
    condition['_id'] = mongoose.Types.ObjectId(id);

    let record = await Category.findOne(condition, { _id: 1 } );
    
    if (record) {
        await Category.findOneAndUpdate(condition, { $set: { is_active: status } }, { new: true })

        return apiResponse(res, false, [], '', SUCCESS.OK, 0,[record]) 
    }

    return  apiResponse(res, true, [], ERROR_MSG['NO-RECORD-FOUND'], CLIENT_ERROR.badRequest, 0,[]);  
   
}

async function uniqueCategory(name){
    //checking unique Category
    return await Category.findOne(
        {name:name},
        { _id: 1 }
    );
}



