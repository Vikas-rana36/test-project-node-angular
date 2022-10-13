const apiResponse =  (response, status,  errors, message, statusCode, count, data) => {
    return response.status(statusCode).send({ is_error: status, message: message, errors: errors, responseCode: statusCode, count, data });
    exit() 
 };

module.exports=  {apiResponse };