const Subcription = require("../../models/admin/subscription")
const {ERROR, SUCCESS} = require("../../core/utilities/messages")
const statusCode = require("../../core/utilities/statusCode")
const {Category} = require("../../models/admin/categoryModel");
const {errorResponse, successResponse} = require("../../core/utilities/response")
const config = require('config')
const dataEmpty = config.get('dataEmpty'); 
const emptyValidationsErrors = config.get('emptyValidationsErrors'); 

	const createCategory = async (req, res) => {
		try {
			const {name} = req.body;
			const if_category_exist = await Category.findOne({name: name});
			if (if_category_exist) {
				 errorResponse(ERROR.errorBoolean, emptyValidationsErrors, ERROR.categoryExist, statusCode.CODES.CLIENT_ERROR.valueAlreadyExist, dataEmpty, res)
			}
			const newCategory = new Category({
				name
			});
				await newCategory.save();
				successResponse(SUCCESS.errorBoolean, SUCCESS.categoryAdded, statusCode.CODES.SUCCESS.created, dataEmpty, res)
				} catch (err) {
				errorResponse(ERROR.errorBoolean, emptyValidationsErrors, err.message, statusCode.CODES.SERVER_ERROR.internalServerError, dataEmpty, res);
			}
		}

        const getCategory = async (req, res) => {
            try {
                const category = await Category.find({is_active: true, is_deleted: false});
                if (!category) {
                     errorResponse(ERROR.errorBoolean, emptyValidationsErrors, ERROR.noCategory, statusCode.CODES.CLIENT_ERROR.notFound, dataEmpty, res)
                exit()}
                const data = category    
                    successResponse(SUCCESS.errorBoolean, SUCCESS.categoryFetched, statusCode.CODES.SUCCESS.created, data, res)
                    } catch (err) {
                    errorResponse(ERROR.errorBoolean, emptyValidationsErrors, err.message, statusCode.CODES.SERVER_ERROR.internalServerError, dataEmpty, res);
                }
            }
    
			const deleteCategory = async (req, res) => {
				try {
					const id = req.params.id
					const status = req.body.deleteStatus
					console.log(id, status, "dddddddd")
                    const categoryUpdated = await Category.findOneAndUpdate({_id: id}, {is_deleted: status});
					if (!categoryUpdated) {
					errorResponse(ERROR.errorBoolean, emptyValidationsErrors, ERROR.noCategory, statusCode.CODES.CLIENT_ERROR.notFound, dataEmpty, res)
		        	exit()} else{
			        successResponse(SUCCESS.errorBoolean, SUCCESS.categoryUpdated, statusCode.CODES.SUCCESS.created, dataEmpty, res);
			   	    }	
			        } catch (err) {
						errorResponse(ERROR.errorBoolean, emptyValidationsErrors, err.message, statusCode.CODES.SERVER_ERROR.internalServerError, dataEmpty, res);
					   }
				    }
		
				const updateCategory = async (req, res) => {
					try {
					    const id = req.params.id
					    const status = req.body.activeStatus
						const categoryUpdated = await Category.findOneAndUpdate({_id: id}, {is_active: status});
						if (!categoryUpdated) {
							errorResponse(ERROR.errorBoolean, emptyValidationsErrors, ERROR.noCategory, statusCode.CODES.CLIENT_ERROR.notFound, dataEmpty, res)
							exit()} else{
							successResponse(SUCCESS.errorBoolean, SUCCESS.categoryUpdated, statusCode.CODES.SUCCESS.created, dataEmpty, res);
							   }	
							} catch (err) {
							errorResponse(ERROR.errorBoolean, emptyValidationsErrors, err.message, statusCode.CODES.SERVER_ERROR.internalServerError, dataEmpty, res);
						}
					}
			

module.exports = {createCategory, getCategory, deleteCategory, updateCategory};
