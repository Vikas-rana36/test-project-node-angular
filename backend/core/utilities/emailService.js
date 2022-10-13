const nodemailer = require('nodemailer');
const config = require('config')
const fromEmail = config.get('fromMail');
const {errorResponse, successResponse} = require("../utilities/response")
const statusCode = require("../../core/utilities/statusCode")
const {ERROR, SUCCESS} = require("../../core/utilities/messages");
const dataEmpty = config.get('dataEmpty');
const emptyValidationsErrors = config.get('emptyValidationsErrors'); 
const hostEmailSmpt = config.get('hostEmailSmpt');
const portEmailSmpt = config.get('portEmailSmtp');
const userEmailSmpt = config.get('userEmailSmpt');
const passwordEmailSmpt = config.get('passwordEmailSmpt');
const  transporter =  nodemailer.createTransport({
    host: hostEmailSmpt,
    port: portEmailSmpt,
    secure: true,
    auth: {
        user: userEmailSmpt,
        pass: passwordEmailSmpt,
    }
 });
// async (req, res, next)
const sendEmail = async (mailOptions, res) => {
            const info =  await transporter.sendMail({             
                from:config.get('fromMail'),
                to:mailOptions.to,
                subject:mailOptions.subject,
                html:mailOptions.html
               })
               if(!info){
               errorResponse(ERROR.errorBoolean, emptyValidationsErrors, ERROR.somethingWrong, statusCode.CODES.SERVER_ERROR.internalServerError, dataEmpty, res)
               }
               successResponse(SUCCESS.errorBoolean, SUCCESS.checkMail, statusCode.CODES.SUCCESS.created, dataEmpty, res)
}
   
module.exports.sendEmail = sendEmail;
