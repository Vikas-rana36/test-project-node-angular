const errorResponse =  (status, validations, message, code, data, response) => {
    return response.json({ is_error: status, message: message, errors: validations, responseCode: code, data});
};

const successResponse =  (status, message, code, data, response) => {
    return response.json({ is_error: status, message: message, errors: "", responseCode: code, data });
 };

module.exports=  {errorResponse, successResponse};