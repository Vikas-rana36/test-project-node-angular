const router = require("express").Router();
const adminAuth = require('../../core/middleware/auth')
const deviceAuth = require('../../core/middleware/deviceAuth')
const {createRole} = require("../../controllers/admin/role");
router.post("/add", createRole);

module.exports = router;
