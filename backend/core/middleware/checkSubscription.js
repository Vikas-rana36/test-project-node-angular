const Payment = require("../../models/subscriptionPayment")
const checkSubscription = async (req, res, next) => {
	try {
		const checkPayment = await Payment.findOne({ userId: req.user.id });
        if(checkPayment){ 
            return res.json({message: jsonError[0].noPayment, error: jsonError[0].errorBoolean, responseCode: jsonError[0].unauthorized});        
        }
        let currentDate = new Date();
		expiryDateOld = checkPayment.expiryDate;
		if(currentDate.getTime() > expiryDateOld.getTime()){
            return res.json({message: jsonError[0].packExpired, error: jsonError[0].errorBoolean, responseCode: jsonError[0].unauthorized}); 
			}
		next();
	} catch (err) {
		return res.status(500).json({ msg: err.message });
	}
};

module.exports = checkSubscription;
