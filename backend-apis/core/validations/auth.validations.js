let Joi = require('joi').extend(require('@joi/date'));
//const Joi = require('joi').extend(require('@joi/date'));
const { User, userSchema } = require('../../models/user');
/*
We can add multiple message like this
const ValidationSchemas = Joi.object({    
    name: Joi.string()  
      .min(6)
      .required()
      .messages({
        'string.empty': 'Display name cannot be empty',
        'string.min': 'Min 6 characteers',
      })
      .optional(),
    email: Joi.string().min(6).required().email().message('Must be a valid email address'),
    password: Joi.string().required().min(6).message('Password is required!'),
  });
  */
const loginJoiSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    device_token: Joi.array().required()
})
const ForgotPasswordJoiSchema = Joi.object().keys({
    email: Joi.string().email().required(),
})

const signupJoiSchema = Joi.object().keys({
    first_name: Joi.string().max(10).required().label('First Name') ,
    last_name: Joi.string().max(10).required().label('Last Name') ,
    gender: Joi.string().max(11).required(),
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().required(),   
    confirm_password:Joi.string().required().label('Confirm Password').valid(Joi.ref('password')).options({ messages: { 'any.only': 'Password & {{#label}} does not match.'} }),	
    category_id: Joi.array().required().label('Category'), 
    dob: Joi.date().format('YYYY-MM-DD').raw().required().label('Date of birth'),
    country: Joi.string().required().label('Country'),
    otp:Joi.number().positive().greater(0),
    weight:Joi.number().positive().greater(0).required().label('Weight'),
    height:Joi.number().positive().greater(0).required().label('Height'),
    bmi:Joi.number().positive().greater(0).required().label('BMI'),
    org_id:  Joi.string().required().label('Organization'),
})

const bmiCalculateJoiSchema = Joi.object().keys({
  weight:Joi.number().positive().greater(0).required().label('Weight'),
  height:Joi.number().positive().greater(0).required().label('Height'),
})

module.exports = {loginJoiSchema, signupJoiSchema, ForgotPasswordJoiSchema, bmiCalculateJoiSchema}