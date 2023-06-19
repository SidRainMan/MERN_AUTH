const Joi= require("joi")

//Register validation schema
const registerValidation = (data) => {
     const schema = Joi.object({
          name: Joi.string().min(6).required(),
          email: Joi.string().min(6).required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
          password:Joi.string().required().min(6)
     });
     return (schema.validate(data))
}


//Login validation schema
const loginValidation = (data) => {
     const schema = Joi.object({
          email: Joi.string().min(6).required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
          password:Joi.string().required().min(6)
     });
     return (schema.validate(data))
}



module.exports.registerValidation = registerValidation
module.exports.loginValidation=loginValidation