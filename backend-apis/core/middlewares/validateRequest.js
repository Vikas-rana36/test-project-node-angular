//let createValidator = require('../validations/createValidator')
const {apiResponse} = require('../response/response')
const { SUCCESS, REDIRECTION, CLIENT_ERROR, SERVER_ERROR } = require("../response/statusCode")
const {ERROR_MSG} = require("../response/messages")

let validateRequest = (schema) =>
  async (req, res, next) => {
    try{
      let payload = req.body
      let regex = /"/g;
      //const requestValidated = await schema.validate(payload, {abortEarly: false});
      const requestValidated = await schema.validate(payload);
      if(requestValidated.error){
        const array = (requestValidated.error.details || [])
        console.log('array',array);
        const validationMessages = array.map(er => (er.message).replace(regex, '') )     
        return apiResponse(res, true, [], validationMessages[0], CLIENT_ERROR.badRequest,0, []);
      } else {
        next()
      }
    } catch (err){
      return apiResponse(res, true, [], err.message, SERVER_ERROR.internalServerError, 0, []);
    } 
  }

module.exports = validateRequest