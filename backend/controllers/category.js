"use strict";
const config = require('config')
const {errorResponse, successResponse} = require("../core/utilities/response")
const {Category} = require("../models/admin/categoryModel")
const {ERROR, SUCCESS} = require("../core/utilities/messages")
const statusCode = require("../core/utilities/statusCode");
const dataEmpty = config.get('dataEmpty'); 
const emptyValidationsErrors = config.get('emptyValidationsErrors'); 

const getCategory = async (req, res) => {
    try {
        const category = await Category.find({is_active: true, is_deleted: false});
        if (!category) {
             errorResponse(ERROR.errorBoolean, emptyValidationsErrors, ERROR.noCategory, statusCode.CODES.CLIENT_ERROR.notFound, dataEmpty, res)
        }
        const data = category
             
            successResponse(SUCCESS.errorBoolean, SUCCESS.categoryFetched, statusCode.CODES.SUCCESS.created, data, res)
            } catch (err) {
            errorResponse(ERROR.errorBoolean, emptyValidationsErrors, err.message, statusCode.CODES.SERVER_ERROR.internalServerError, dataEmpty, res);
        }
    }

    // const deleteCategory = async (req, res) => {
    //     try {
    //         const id = req.params.id
    //         const status = req.body.deleteStatus
    //         console.log(id, status, "dddddddd")
    //         const categoryUpdated = await Category.findOneAndUpdate({_id: id}, {is_deleted: status});
    //         if (!categoryUpdated) {
    //         errorResponse(ERROR.errorBoolean, emptyValidationsErrors, ERROR.noCategory, statusCode.CODES.CLIENT_ERROR.notFound, dataEmpty, res)
    //         exit()} else{
    //         successResponse(SUCCESS.errorBoolean, SUCCESS.categoryUpdated, statusCode.CODES.SUCCESS.created, dataEmpty, res);
    //            }	
    //         } catch (err) {
    //             errorResponse(ERROR.errorBoolean, emptyValidationsErrors, err.message, statusCode.CODES.SERVER_ERROR.internalServerError, dataEmpty, res);
    //            }
    //         }

    //     const updateCategory = async (req, res) => {
    //         try {
    //             const id = req.params.id
    //             const status = req.body.activeStatus
    //             const categoryUpdated = await Category.findOneAndUpdate({_id: id}, {is_active: status});
    //             if (!categoryUpdated) {
    //                 errorResponse(ERROR.errorBoolean, emptyValidationsErrors, ERROR.noCategory, statusCode.CODES.CLIENT_ERROR.notFound, dataEmpty, res)
    //                 exit()} else{
    //                 successResponse(SUCCESS.errorBoolean, SUCCESS.categoryUpdated, statusCode.CODES.SUCCESS.created, dataEmpty, res);
    //                    }	
    //                 } catch (err) {
    //                 errorResponse(ERROR.errorBoolean, emptyValidationsErrors, err.message, statusCode.CODES.SERVER_ERROR.internalServerError, dataEmpty, res);
    //             }
    //         }
    



module.exports = {getCategory};
