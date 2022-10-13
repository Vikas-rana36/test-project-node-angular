const {Role} = require("../../models/admin/userRoleModel")
const {ERROR, SUCCESS} = require("../../core/utilities/messages")
const statusCode = require("../../core/utilities/statusCode")
const config = require('config')
const dataEmpty = config.get('dataEmpty'); 
const emptyValidationsErrors = config.get('emptyValidationsErrors'); 
const {errorResponse, successResponse} = require("../../core/utilities/response")


	const createRole = async (req, res) => {
		try {
			const { user_role} = req.body;

			const role = await Role.findOne({ user_role: user_role });
			if (role) {
				errorResponse(ERROR.errorBoolean, emptyValidationsErrors, "Role Already Exists", statusCode.CODES.CLIENT_ERROR.valueAlreadyExist, dataEmpty, res)
			exit()
        }
			//Saving user.
			const new_role = await Role.create({
				user_role,
			});

			await new_role.save();
			successResponse(SUCCESS.errorBoolean, "Role has been Created", statusCode.CODES.SUCCESS.created, dataEmpty, res)  
		} catch (err) {
			errorResponse(ERROR.errorBoolean, emptyValidationsErrors, err.message, statusCode.CODES.SERVER_ERROR.internalServerError, dataEmpty, res);
		}
	}

module.exports = {createRole};
