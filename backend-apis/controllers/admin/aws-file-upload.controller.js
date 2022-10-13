require('dotenv').config();
const S3 = require('aws-sdk/clients/s3');
const fs = require('fs');
const { apiResponse} = require("../../core/response/response")
const { SUCCESS, REDIRECTION, CLIENT_ERROR, SERVER_ERROR } = require("../../core/response/statusCode")
const {ERROR_MSG, SUCCESS_MSG} = require("../../core/response/messages")

// aws common variables
const accessKeyId= process.env.AWS_ACCESS_KEY_ID;
const secretAccesskey= process.env.AWS_SECRET_ACCESS_KEY;
const region =process.env.AWS_REGION;
const bucket_name =process.env.AWS_BUCKET_NAME;

// used for s3
const s3 = new S3({
    region,
    accessKeyId,
    secretAccesskey,
}) 

// upload file in s3 bucket
exports.uploadFile = async (req, res) => {
    console.log("file>>>>>>>>>>>>>>>",req.file)
    const file = req.file
    const filestream = fs.createReadStream(file.path);
    const params = {
        Bucket: bucket_name,
        Key: 'common/'+file.filename, // File name you want to save as in S3
        Body: filestream,
        ContentEncoding: 'base64',
        ContentType: file.mimetype,
        ACL:'public-read'
    }

    s3.upload(params, (err, data) => {
        if (err) { 
            return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
        }
        fs.unlink(file.path, function (err) {
            if (err) throw err;
            // if no error, file has been deleted successfully
            console.log('File deleted!');
        });
        return apiResponse(res, false, [], '', SUCCESS.OK, 0, {file_location:data.Location})
    });    
}

// s3 user logger for file
exports.uploadFileLoggedUser = async (req, res) => {
    const file = req.file
    const filestream = fs.createReadStream(file.path);
    const params = {
        Bucket: bucket_name,
        Key: id+"/"+file.filename, // File name you want to save as in S3
        Body: filestream,
        ContentEncoding: 'base64',
        ContentType: file.mimetype,
        ACL:'public-read'
    }

    s3.upload(params, (err, data) => {
        if (err) { 
            return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, 0, [])
        }
        return apiResponse(res, false, [], '', SUCCESS.OK, 0, {file_location:data.Location})
    });    

}

// file stream
exports.getFileStream = async (req, res) => {
    const file = req.file
    const downloadParams = {
        key:filekey,
        Bucket:bucket_name
    } 

    s3.getObject(downloadParams, (err, data) => {
        if(err){
            return apiResponse(res, true, [], ERROR_MSG['SYSTEM-ERROR'], SERVER_ERROR.internalServerError, [])
        }
        return apiResponse(res, false, [], '', SUCCESS.OK, 0, {file_readstream:data.createReadStream})
    })

}