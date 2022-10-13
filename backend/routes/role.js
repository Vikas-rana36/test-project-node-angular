const router = require("express").Router();
const {getRole} = require("../controllers/role");
router.get("/listing", getRole );

module.exports = router;
