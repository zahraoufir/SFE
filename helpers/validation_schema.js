const Joi = require('@hapi/joi');

const authSchema = Joi.object({
    email : Joi.string().email().lowercase().required(),
    password : Joi.string().min(8).required(),
    first_name : Joi.string().min(3).max(20).required(),
    last_name : Joi.string().min(3).max(20).required()
})

const profileSchema = Joi.object({
    id : Joi.number().integer(),
    email : Joi.string().email().lowercase().required(),
    first_name : Joi.string().min(3).max(20).required(),
    last_name : Joi.string().min(3).max(20).required(),
    address : Joi.string().min(3).max(100),
    country : Joi.string().min(3).max(100),
    city : Joi.string().min(3).max(100),
    zip_code : Joi.number().integer(),
})

module.exports = {
    authSchema,
    profileSchema
}