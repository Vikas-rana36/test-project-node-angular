const {ERROR, SUCCESS} = require("../core/utilities/messages")
const statusCode = require("../core/utilities/statusCode")
const {QuestionAnswer} = require("../models/admin/questionAnswerModel");
const {errorResponse, successResponse} = require("../core/utilities/response")
const config = require('config')
const dataEmpty = config.get('dataEmpty'); 
const emptyValidationsErrors = config.get('emptyValidationsErrors'); 

        const getQuestionAnswer = async (req, res) => {
            try {
                const questionAnswer = await QuestionAnswer.find();
                if (!questionAnswer) {
                     errorResponse(ERROR.errorBoolean, emptyValidationsErrors, ERROR.noQuestion, statusCode.CODES.CLIENT_ERROR.notFound, dataEmpty, res)
                exit()}
                const data = questionAnswer     
                    successResponse(SUCCESS.errorBoolean, SUCCESS.QusetionsFetched, statusCode.CODES.SUCCESS.created, data, res)
                    } catch (err) {
                    errorResponse(ERROR.errorBoolean, emptyValidationsErrors, err.message, statusCode.CODES.SERVER_ERROR.internalServerError, dataEmpty, res);
                }
            }
    

module.exports = {getQuestionAnswer};
