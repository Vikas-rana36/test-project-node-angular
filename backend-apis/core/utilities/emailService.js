const nodemailer = require('nodemailer');
const { apiResponse } = require("../../core/response/response")
const statusCode = require("../../core/response/statusCode")
const {ERROR, SUCCESS} = require("../../core/response/messages");

const smtpHost = process.env.SMTP_HOST
const smtpPort = process.env.SMTP_PORT
const smtpUser = process.env.SMTP_USER
const smtpPassword = process.env.SMTP_PASSWORD

const  transporter =  nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: true,
    auth: {
        user: smtpUser,
        pass: smtpPassword,
    }
 });
// async (req, res, next)
const sendEmail = async (mailOptions, res) => {
    const info =  await transporter.sendMail({             
        from:process.env.EMAIL_FROM,
        to:mailOptions.to,
        subject:mailOptions.subject,
        html:mailOptions.html
    })

    if(!info)  return false 

    return true
}
   
module.exports.sendEmail = sendEmail;
