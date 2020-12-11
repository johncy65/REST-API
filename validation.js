const Joi = require("joi");

const registerValidation = (data) => {
    
    const schema = Joi.object({
        firstName:Joi.string().required(),
        secondName:Joi.string().required(),
        email:Joi.string().required().email(),
        password:Joi.string().min(8).required()
    });

    return schema.validate(data,{ abortEarly: false });
};

const loginValidation = (data) => {
    
    const schema = Joi.object({
        email:Joi.string().required().email(),
        password:Joi.string().required()       
    });

    return schema.validate(data,{ abortEarly: false });
};


const validationMessages = (error) =>{
    
    const messages = [];
    
    error.details.forEach((element) => {
        const elementMessage = {};
        elementMessage["message"] = element.message;
        elementMessage["key"] = element.context.key;
        messages.push(elementMessage);
    });

    return messages;
}


const updateProfile = (data) => {
    
    const schema = Joi.object({
        firstName:Joi.string().required(),
        secondName:Joi.string().required(),
        email:Joi.string().required().email(),    
    });

    return schema.validate(data,{ abortEarly: false });
};

const updatePassword = (data) => {
    
    const schema = Joi.object({
        oldPassword:Joi.string().required(),
        newPassword:Joi.string().min(8).required(),  
    });

    return schema.validate(data,{ abortEarly: false });
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.validationMessages = validationMessages;
module.exports.updateProfile = updateProfile;
module.exports.updatePassword = updatePassword;