const {ERROR, SUCCESS} = require("../../core/utilities/messages")
const statusCode = require("../../core/utilities/statusCode")
const {User} = require("../../models/userModel");
const {errorResponse, successResponse} = require("../../core/utilities/response")
const config = require('config')
const dataEmpty = config.get('dataEmpty'); 
const emptyValidationsErrors = config.get('emptyValidationsErrors'); 

const getAllUser = async (req, res) => {
            try {
                const users = await User.find();
                console.log(users, "uuuuuuuuuuuuuuuuu")
                if (!users) {
                     errorResponse(ERROR.errorBoolean, emptyValidationsErrors, ERROR.noUser, statusCode.CODES.CLIENT_ERROR.notFound, dataEmpty, res)
                }
                const data = users
                        
                    successResponse(SUCCESS.errorBoolean, SUCCESS.getAllUser, statusCode.CODES.SUCCESS.created, data, res)
                    } catch (err) {
                    errorResponse(ERROR.errorBoolean, emptyValidationsErrors, err.message, statusCode.CODES.SERVER_ERROR.internalServerError, dataEmpty, res);
                }
            }
    

module.exports = {getAllUser};
