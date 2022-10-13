const multer  = require('multer')
const upload = multer({ dest: 'uploads/' }).single('file')
const { apiResponse} = require("../../core/response/response")
const { SUCCESS, REDIRECTION, CLIENT_ERROR, SERVER_ERROR } = require("../../core/response/statusCode")
const {ERROR_MSG, SUCCESS_MSG} = require("../../core/response/messages")

module.exports = function (req, res, next) {
    
    try {
        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, [])// A Multer error occurred when uploading.
            } else if (err) {
                return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, [])// An unknown error occurred when uploading.
            }
            next();
        })
    }catch(error){
        return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, [])
    }
}