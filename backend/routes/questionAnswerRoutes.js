const router = require("express").Router();
const {getQuestionAnswer} = require("../controllers/questionAnswer");
router.get("/listing", getQuestionAnswer);

module.exports = router;
