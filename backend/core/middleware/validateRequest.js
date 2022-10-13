//let createValidator = require('../validations/createValidator')
const {errorResponse} = require('../utilities/response')
const statusCode = require("../../core/utilities/statusCode")
const {ERROR} = require("../utilities/messages")

let validateRequest = (schema) =>
  async (req, res, next) => {
    try{
      let payload = req.body
      const requestValidated = await schema.validate(payload, {abortEarly: false});
      if(requestValidated.error){
        const array = (requestValidated.error.details || [])
        const validationMessages = array.map(er => er.message)
       return errorResponse(ERROR.errorBoolean,  validationMessages, "", statusCode.CODES.CLIENT_ERROR.badRequest, [], res)
      } else {
        next()
      }
    } catch (err){
    return errorResponse(ERROR.errorBoolean, err.message, "", statusCode.CODES.SERVER_ERROR.internalServerError, [], res);

    } 
  }

module.exports = validateRequest