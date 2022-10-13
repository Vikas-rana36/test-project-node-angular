const jwt = require("jsonwebtoken");
const {ERROR} = require("../utilities/messages")
const {errorResponse} = require("../utilities/response")
const responseCode = require("../utilities/statusCode")
 const auth = (req, res, next) => {
	try {
		const token = req.headers['authorization'];
		if (!token) {
			errorResponse(ERROR.errorBoolean, ERROR.invalidAuth, "", responseCode.CODES.CLIENT_ERROR.unauthorized, [], res)
		}
		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
			if (err) {
				errorResponse(ERROR.errorBoolean, ERROR.invalidAuth, "", responseCode.CODES.CLIENT_ERROR.unauthorized, [], res)
			}
		    req.user = user;
			next();
		});
	} catch (err) {
		errorResponse(ERROR.errorBoolean, err.message, "", responseCode.CODES.SERVER_ERROR.internalServerError, [], res);
	}
};

module.exports = auth;

