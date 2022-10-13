const {Role} = require("../models/admin/userRoleModel")
const {ERROR, SUCCESS} = require("../core/utilities/messages")
const statusCode = require("../core/utilities/statusCode");
const config = require('config')
const dataEmpty = config.get('dataEmpty'); 
const emptyValidationsErrors = config.get('emptyValidationsErrors'); 
const {errorResponse, successResponse} = require("../core/utilities/response")


	const getRole = async (req, res) => {
		try {
			const role = await Role.find();
			if (!role) {
				errorResponse(ERROR.errorBoolean, emptyValidationsErrors, "No Roles available", statusCode.CODES.CLIENT_ERROR.valueAlreadyExist, dataEmpty, res)
			}
			//Saving user.
		   
            data =  role
            
            
			successResponse(SUCCESS.errorBoolean, "Roles are fetched", statusCode.CODES.SUCCESS.OK, data, res)  
		} catch (err) {
			errorResponse(ERROR.errorBoolean, emptyValidationsErrors, err.message, statusCode.CODES.SERVER_ERROR.internalServerError, dataEmpty, res);
		}
	}

module.exports = {getRole};
