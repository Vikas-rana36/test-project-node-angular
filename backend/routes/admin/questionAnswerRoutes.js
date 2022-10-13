const router = require("express").Router();
const adminAuth = require('../../core/middleware/auth')
const deviceAuth = require('../../core/middleware/deviceAuth')
const validateRequest = require('../../core/middleware/validateRequest')
const {questionAnswerJoiSchema} = require('../../models/admin/questionAnswerModel')
const {createQuestionAnswer, getQuestionAnswer} = require("../../controllers/admin/questionAnswerController");
router.post("/add", validateRequest(questionAnswerJoiSchema), createQuestionAnswer);
router.post("/listing", getQuestionAnswer);

module.exports = router;
