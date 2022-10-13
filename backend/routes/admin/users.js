const router = require("express").Router();
const adminAuth = require('../../core/middleware/auth')
const deviceAuth = require('../../core/middleware/deviceAuth')
const {getAllUser} = require("../../controllers/admin/users");

router.get("/listing", getAllUser);



module.exports = router;