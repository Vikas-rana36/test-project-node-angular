const Token = require("../../models/tokenModel")
const {ERROR} = require("../utilities/messages")
const responseCode = require("../utilities/statusCode")
const {errorResponse} = require("../utilities/response")
const deviceAuth = async (req, res, next) => {
	try {
		const user = await Token.findOne({ userId: req.user.id });
		if (user.device_token != req.body.device_token) {
			errorResponse(ERROR.errorBoolean, ERROR.accessDenied, "", responseCode.CODES.CLIENT_ERROR.unauthorized, [], res)
		}
		next();
	} catch (err) {
		errorResponse(ERROR.errorBoolean, err.message, "",  responseCode.CODES.SERVER_ERROR.internalServerError, [], res);	
	}
};

module.exports = deviceAuth;
