const _ = require('lodash');
const { apiResponse} = require("../response/response")
const { SUCCESS, REDIRECTION, CLIENT_ERROR, SERVER_ERROR } = require("../response/statusCode")
const {ERROR_MSG, SUCCESS_MSG} = require("../response/messages")
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    
    try {
        const token = (req.headers && req.headers.authorization) ? req.headers.authorization.split(' ')[1] : '';
        if (!token) return  apiResponse(res, true, [], ERROR_MSG['NOT-AUTHORISED'], CLIENT_ERROR.badRequest,0, []);
        const decodedToken = jwt.verify(token, 'RANDOM_JWT_TOKEN_SECRET');
        const userId = decodedToken.userId;
        if (_.has(!req.body && !req.body.user_id && req.body.user_id !== userId && !userId)) {
            return  apiResponse(res, true, [], ERROR_MSG['NOT-AUTHORISED'], CLIENT_ERROR.badRequest,0, []);
        } else {
          next();
        }
      } catch(err) {
        console.log('err',error)
        return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
      }

}