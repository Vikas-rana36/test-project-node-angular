const router = require("express").Router();
const {getSubscriptionList, getSubscriptionInfo, verifySubscription } = require("../controllers/subscription");
router.post("/listing", getSubscriptionList );
router.post("/info", getSubscriptionInfo );
router.post("/verify", verifySubscription );

module.exports = router;
