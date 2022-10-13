const router = require("express").Router();
const {createSubscription} = require("../../controllers/admin/subscriptionController");
const validateMiddleware = require('../../core/middleware/validateRequest')
const {subscriptionJoiSchema} = require('../../models/admin/subscription')
router.post("/add", validateMiddleware(subscriptionJoiSchema), createSubscription);
module.exports = router;