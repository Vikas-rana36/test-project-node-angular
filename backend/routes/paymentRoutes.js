const router = require("express").Router();
const adminAuth = require('../core/middleware/auth')
const deviceAuth = require('../core/middleware/deviceAuth')
const {subscriptionPayment, SubscriptionTrial} = require("../controllers/paymentController");
router.post("/subscription", subscriptionPayment);
//router.post("/freeSubscription", adminAuth, deviceAuth, paymentController.freeSubscription);

module.exports = router;