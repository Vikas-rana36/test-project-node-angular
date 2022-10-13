const { login, forgotPassword, updatePassword, adminInfo, updateAdmin , changePassword } = require('../controllers/admin/auth.controller')

const { add, listing, deleteCategory, deleteSelectedCategory, changeStatus, totalCategories } = require('../controllers/admin/category.controller')
const { userlisting, changeUserStatus, totalUser } = require('../controllers/admin/user.controller')

const { faqListing, faqAdd, deleteFAQ, deleteSelectedFAQ, changeFAQStatus, totalFAQ } = require('../controllers/admin/faq.controller')

const { organizationListing, organizationAdd, deleteOrganization, deleteSelectedOrganization, changeOrganizationStatus, totalOrganization } = require('../controllers/admin/organization.controller')

const { addSection, listingSection, deleteSection, deleteSelectedSection, changeSectionStatus, totalSection, addQuestion, listingQuestion, deleteQuestion, deleteSelectedQuestion, changeQuestionStatus, totalQuestion } = require('../controllers/admin/section-question.controller')
const { saveSetting, fetchSetting  } = require('../controllers/admin/setting.controller')

const { uploadFile  } = require('../controllers/admin/aws-file-upload.controller')

const fileUpload = require('../core/middlewares/fileUpload')





// Routes =============================================================
module.exports = router => {
    // POST route to mock a login  endpoint
    router.post("/api/admin/auth/login", login)   
    router.post("/api/admin/auth/forgotPassword", forgotPassword) 
    router.post("/api/admin/auth/resetPassword", updatePassword)
    router.post("/api/admin/auth/adminInfo", adminInfo)
    router.post("/api/admin/auth/editAdmin", updateAdmin)
    router.post("/api/admin/auth/passwordChange", changePassword)


    //category routes
    router.post("/api/admin/category/add", add)   
    router.post("/api/admin/category/listing", listing)   
    router.post("/api/admin/category/delete", deleteCategory)
    router.post("/api/admin/category/deleteSelected", deleteSelectedCategory)
    router.post("/api/admin/category/changeStatus", changeStatus)
    router.post("/api/admin/category/fetchCount", totalCategories)
    
    // user routes
    router.post("/api/admin/user/listing", userlisting)
    router.post("/api/admin/user/changeStatus", changeUserStatus)
    router.post("/api/admin/user/fetchCount", totalUser)

    // FAQs routes
    router.post("/api/admin/faq/listing", faqListing)
    router.post("/api/admin/faq/add", faqAdd)
    router.post("/api/admin/faq/delete", deleteFAQ)
    router.post("/api/admin/faq/deleteSelected", deleteSelectedFAQ)
    router.post("/api/admin/faq/changeStatus", changeFAQStatus)
    router.post("/api/admin/faq/fetchCount", totalFAQ)

    // Organizations routes 
    router.post("/api/admin/organization/listing", organizationListing)
    router.post("/api/admin/organization/add", organizationAdd)
    router.post("/api/admin/organization/delete", deleteOrganization)
    router.post("/api/admin/organization/deleteSelected", deleteSelectedOrganization)
    router.post("/api/admin/organization/changeStatus", changeOrganizationStatus)
    router.post("/api/admin/organization/fetchCount", totalOrganization)

    // Questionaries Sections routes
    router.post("/api/admin/section/listing", listingSection)
    router.post("/api/admin/section/add", addSection)
    router.post("/api/admin/section/delete", deleteSection)
    router.post("/api/admin/section/deleteSelected", deleteSelectedSection)
    router.post("/api/admin/section/changeStatus", changeSectionStatus)
    router.post("/api/admin/section/fetchCount", totalSection)
    

    // Questionaries Questions  routes
    router.post("/api/admin/question/listing", listingQuestion)
    router.post("/api/admin/question/add", addQuestion)
    router.post("/api/admin/question/delete", deleteQuestion)
    router.post("/api/admin/question/deleteSelected", deleteSelectedQuestion)
    router.post("/api/admin/question/changeStatus", changeQuestionStatus)
    router.post("/api/admin/question/fetchCount", totalQuestion)

    // Admin Default Settings
    router.post("/api/admin/settings/fetch", fetchSetting)
    router.post("/api/admin/settings/save", saveSetting)

    // Admin file upload Settings
    router.post("/api/admin/upload/uploadFile", fileUpload,  uploadFile)

    
}