const { login, signup, verify, forgotPassword, updatePassword, bmiCalculate  } = require('../controllers/auth.controller')
const validateRequest = require('../core/middlewares/validateRequest')
const authCheck = require('../core/middlewares/auth')
const {loginJoiSchema, signupJoiSchema, ForgotPasswordJoiSchema, bmiCalculateJoiSchema} = require('../core/validations/auth.validations')
const { listingSection, listingQuestion, addSectionResult, lisingSectionResult } = require('../controllers/section-question.controller')
const { faqListing } = require('../controllers/faq.controller')
const { organizationListing } = require('../controllers/organization.controller')
const { fetchDefaultView } = require('../controllers/user-default-view.controller')
const { fetchGoals } = require('../controllers/goals.controller')

// Routes =============================================================
module.exports = router => {
   
    // POST route to mock a login  endpoint
    router.post("/api/auth/login",[validateRequest(loginJoiSchema)], login) 
    router.post("/api/auth/signup",[validateRequest(signupJoiSchema)], signup)
    router.post("/api/auth/bmiCalculation",[validateRequest(bmiCalculateJoiSchema)], bmiCalculate)
    router.get("/api/auth/verify/:userid/:otp", verify)
    router.post("/api/auth/forgotPassword",[validateRequest(ForgotPasswordJoiSchema)], forgotPassword)
    router.post("/api/auth/resetPassword/:userid/:otp", updatePassword)  
    
    // for frontend user question answers
    router.post("/api/user/fetchSection",authCheck, listingSection)
    router.post("/api/user/fetchQuestion",authCheck, listingQuestion)
    router.post("/api/user/addSectionResult",authCheck, addSectionResult)
    router.post("/api/user/fetchSectionResult",authCheck, lisingSectionResult)


    // for frontend user faq
    router.post('/api/user/fetchFaq',authCheck, faqListing)

    // for frontend user organization
    router.get('/api/user/fetchOrganization', organizationListing)

    // for frontend user default view pages
    router.post('/api/user/fetchDefaultView',authCheck, fetchDefaultView)

    // for frontend user goals/categories
    router.get('/api/user/fetchGoals', fetchGoals)
    
}