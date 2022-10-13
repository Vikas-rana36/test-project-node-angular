const Subcription = require("../../models/admin/subscription")
const {ERROR, SUCCESS} = require("../../core/utilities/messages")
const statusCode = require("../../core/utilities/statusCode")
const {QuestionAnswer} = require("../../models/admin/questionAnswerModel");
const {errorResponse, successResponse} = require("../../core/utilities/response")
const config = require('config')
const dataEmpty = config.get('dataEmpty'); 
const emptyValidationsErrors = config.get('emptyValidationsErrors'); 

	const createQuestionAnswer = async (req, res) => {
		try {
			const {question, never, sometimes, regularly, often, always} = req.body;
			const if_question_exist = await QuestionAnswer.findOne({question: question});
			if (if_question_exist) {
				 errorResponse(ERROR.errorBoolean, emptyValidationsErrors, ERROR.questionExist, statusCode.CODES.CLIENT_ERROR.valueAlreadyExist, dataEmpty, res)
			exit()}
			const newQuestionAnswer = new QuestionAnswer({
				question, never, sometimes, regularly, often, always
			});
				await newQuestionAnswer.save();
				successResponse(SUCCESS.errorBoolean, SUCCESS.questionAdded, statusCode.CODES.SUCCESS.created, dataEmpty, res)
				} catch (err) {
				errorResponse(ERROR.errorBoolean, emptyValidationsErrors, err.message, statusCode.CODES.SERVER_ERROR.internalServerError, dataEmpty, res);
			}
		}

		const getQuestionAnswer = async (req, res) => {
            try {
                const questionAnswer = await QuestionAnswer.find();
                if (!questionAnswer) {
                     errorResponse(ERROR.errorBoolean, emptyValidationsErrors, ERROR.noQuestion, statusCode.CODES.CLIENT_ERROR.notFound, dataEmpty, res)
                }
                const data = questionAnswer
                     
                    successResponse(SUCCESS.errorBoolean, SUCCESS.QusetionsFetched, statusCode.CODES.SUCCESS.created, data, res)
                    } catch (err) {
                    errorResponse(ERROR.errorBoolean, emptyValidationsErrors, err.message, statusCode.CODES.SERVER_ERROR.internalServerError, dataEmpty, res);
                }
            }
    

module.exports = {createQuestionAnswer, getQuestionAnswer};
