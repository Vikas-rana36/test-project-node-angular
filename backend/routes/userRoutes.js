const router = require("express").Router();
const adminAuth = require('../core/middleware/auth')
const deviceAuth = require('../core/middleware/deviceAuth')
const validateRequest = require('../core/middleware/validateRequest')
const {userJoiSchema, userLoginJoiSchema, userLogoutJoiSchema, userForgotPasswordJoiSchema, resetPasswordJoiSchema} = require('../models/userModel')
const {otpJoiSchema} = require('../models/otpModel')
const {signUp, login, logout, forgotPassword, approveAccount, verifyOTP, resetPassword, getUser, createCategory, createRole} = require("../controllers/authController");
router.post("/signup", validateRequest(userJoiSchema), signUp);
router.post("/login", validateRequest(userLoginJoiSchema), login);
router.post("/logout", validateRequest(userLogoutJoiSchema), logout);
router.post("/forgotpassword", validateRequest(userForgotPasswordJoiSchema), forgotPassword);
router.post("/verifyotp", validateRequest(otpJoiSchema), verifyOTP);
router.post("/changepassword", validateRequest(resetPasswordJoiSchema), resetPassword);
router.get("/getapprove/:id", approveAccount);
router.get("/info", adminAuth, getUser);


module.exports = router;