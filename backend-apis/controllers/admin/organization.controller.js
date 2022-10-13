const _ = require('lodash'); 
const mongoose = require("mongoose");
const { Organization } = require('../../models/admin/organization');
const { apiResponse} = require("../../core/response/response")
const { SUCCESS, REDIRECTION, CLIENT_ERROR, SERVER_ERROR } = require("../../core/response/statusCode")
const {ERROR_MSG, SUCCESS_MSG} = require("../../core/response/messages")

exports.organizationAdd = async (req, res) => {

    // If no validation errors, get the req.body objects that were validated and are needed
    const { id, name, address1 } = req.body
    if (_.has(req.body, ['id']) && (req.body.id)!=null){ 

        let condition = {}
        condition['_id'] = mongoose.Types.ObjectId(id);

        //checking record exist
        let record = await Organization.findOne(condition, { _id: 1 } );      
        if (!record) return apiResponse(res, true, [], ERROR_MSG['NO-RECORD-FOUND'], CLIENT_ERROR.badRequest, 0, []);

        //update Organization 
        Organization.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.body.id) }, { $set: req.body }, { new: true }, function (err, record) {
            
            if (err) return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
                
            return apiResponse(res, false, [], '', SUCCESS.OK, [record])  
            
        });
    }else{
        //save Organization 
        newOrganization = new Organization(_.pick(req.body, ['name','address1','address2','org_owner','org_email','org_phone','is_active','createdAt','updatedAt']));
        
        newOrganization.save(async function (err, record) {
            
            if (err) return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError,0,  [])
                
            return apiResponse(res, false, [], '', SUCCESS.OK, 0, [record])         
            
        });
    }    
}

exports.organizationListing = async (req, res) => {

    try {
        const { name, address1, address2, org_owner, org_email, org_phone, created, updated } = req.body
        var filteredQuery, page, limit = ''
        let name_regex = new RegExp(name,'i');
        let address1_regex = new RegExp(address1,'i');
        let address2_regex = new RegExp(address2,'i');
        let ogrowner_regex = new RegExp(org_owner,'i');
        let orgemail_regex = new RegExp(org_email,'i');        
        if(req.query.search){
            page = req.query.page  ? parseInt(req.query.page) - 1 : 0;
            limit = 10;
            const filter_name = (name && name != 'undefined')  ? { name: name_regex } : {};
            const filter_address1 = (address1 && address1 != 'undefined')  ? { address1: address1_regex } : {};
            const filter_address2 = (address2 && address2 != 'undefined')  ? { address2: address2_regex } : {};
            const filter_orgOwner = (org_owner && org_owner != 'undefined')  ? { org_owner: ogrowner_regex } : {};
            const filter_orgEmail = (org_email && org_email != 'undefined')  ? { org_email: orgemail_regex } : {};
            const filter_orgPhone = (org_phone && org_phone != 'undefined')  ? { org_phone: org_phone } : {};
            const filter_createdAt = (created && created != 'undefined') ? { createdAt: { $gte: new Date(created), $lt: new Date(created).setHours(23, 59, 59, 59) }} : {};
            const filter_updatedAt = (updated && updated != 'undefined') ? { updatedAt: { $gte: new Date(updated), $lt: new Date(updated).setHours(23, 59, 59, 59) } } : {};
            filteredQuery = { ...filter_name, ...filter_address1, ...filter_address2, ...filter_orgOwner, ...filter_orgEmail, ...filter_orgPhone, ...filter_createdAt, ...filter_updatedAt, is_deleted:false}
        }
        else{
            page = req.query.page  ? parseInt(req.query.page) - 1 : 0;
            limit = 10;
            filteredQuery = {
                is_deleted:false
            }
        }
        console.log("filteredQuery>?>>>>>>>>>>>>>",filteredQuery);
        const [data, count] = await Promise.all([
            Organization.find(filteredQuery).sort({createdAt: -1}).skip(page * limit).limit(limit),
            Organization.countDocuments(filteredQuery)
        ]);
        return apiResponse(res, false, [], '', SUCCESS.OK, count, data)  

    } catch (error) {
        console.log('err',error)
         return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
    } 
}

// total count organization
exports.totalOrganization = async (req, res) => {
    try {
       const totalCount = await Organization.countDocuments({is_deleted:false});
       return apiResponse(res, false, [], '', SUCCESS.OK, totalCount, [])  
    } catch (error) {
        console.log('err',error)
        return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
    }
}

// delete organization
exports.deleteOrganization = async (req, res) => {

    try{
        const id = req.body.id;
        await Organization.findOneAndUpdate({_id: mongoose.Types.ObjectId(id)}, { $set: { is_deleted: true, updatedAt:new Date() } }, {upsert: true, new: true}).then(cres => {
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

// delete selected Organization
exports.deleteSelectedOrganization = async (req, res) => {
    try{
        await Organization.updateMany({_id:{$in: req.body.id}}, { $set: { is_deleted: true, updatedAt:new Date() } }, {multi: true, upsert: true, new: true}).then(cres => {
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

exports.changeOrganizationStatus = async (req, res) => {
    const {id, status} = req.body
    let condition = {}
    condition['_id'] = mongoose.Types.ObjectId(id);

    let record = await Organization.findOne(condition, { _id: 1 } );
    
    if (record) {
        await Organization.findOneAndUpdate(condition, { $set: { is_active: status } }, { new: true })

        return apiResponse(res, false, [], '', SUCCESS.OK, [record]) 
    }

    return  apiResponse(res, true, [], ERROR_MSG['NO-RECORD-FOUND'], CLIENT_ERROR.badRequest, 0, []); 
   
}